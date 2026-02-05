use axum::{
    Json, Router, async_trait,
    extract::{FromRequestParts, State},
    http::{StatusCode, request::Parts},
    routing::get,
};
use dotenvy::dotenv;
use lettre::transport::smtp::client::Tls;
use lettre::{Message, SmtpTransport, Transport};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use sqlx::postgres::PgPoolOptions;
use std::net::SocketAddr;
use std::time::Duration;
use tower_http::cors::CorsLayer;
use uuid::Uuid; // Importiere das Uuid-Crate

// --- AUTH STRUKTUREN ---

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String, // Die User-ID von Keycloak
    pub email: Option<String>,
    pub preferred_username: Option<String>,
}

// --- NEU: Auth-Validierung ---
#[async_trait]
impl<S> FromRequestParts<S> for Claims
where
    S: Send + Sync,
{
    type Rejection = (StatusCode, String);

    async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection> {
        // 1. Token aus Header extrahieren
        let auth_header = parts
            .headers
            .get(axum::http::header::AUTHORIZATION)
            .and_then(|h| h.to_str().ok())
            .ok_or((
                StatusCode::UNAUTHORIZED,
                "Missing Authorization header".to_string(),
            ))?;

        if !auth_header.starts_with("Bearer ") {
            return Err((StatusCode::UNAUTHORIZED, "Invalid token type".to_string()));
        }

        let token = &auth_header[7..];

        // 2. Keycloak Public Keys laden (JWKS)
        // In einem echten System würdest du das cachen, hier laden wir es für den Test live
        let jwks_url = "http://localhost:52201/realms/FADS/protocol/openid-connect/certs";
        let jwks: serde_json::Value = reqwest::get(jwks_url)
            .await
            .map_err(|_| {
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    "Konnte Keycloak Keys nicht laden".to_string(),
                )
            })?
            .json()
            .await
            .map_err(|_| {
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    "Fehler beim Parsen der Keys".to_string(),
                )
            })?;

        // 3. Token Header dekodieren, um den richtigen Key zu finden
        let header = jsonwebtoken::decode_header(token)
            .map_err(|_| (StatusCode::UNAUTHORIZED, "Invalid token header".to_string()))?;

        let kid = header
            .kid
            .ok_or((StatusCode::UNAUTHORIZED, "Missing kid in token".to_string()))?;

        // 4. Den passenden Key aus dem JWKS finden
        let jwk = jwks["keys"]
            .as_array()
            .and_then(|keys| keys.iter().find(|key| key["kid"] == kid))
            .ok_or((
                StatusCode::UNAUTHORIZED,
                "Matching key not found".to_string(),
            ))?;

        // 5. Token validieren
        let decoding_key = jsonwebtoken::DecodingKey::from_rsa_components(
            jwk["n"].as_str().unwrap(),
            jwk["e"].as_str().unwrap(),
        )
        .map_err(|_| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Invalid decoding key".to_string(),
            )
        })?;

        let mut validation = jsonwebtoken::Validation::new(jsonwebtoken::Algorithm::RS256);
        validation.set_issuer(&["http://localhost:52201/realms/FADS"]);
        // Wir deaktivieren die Audience-Prüfung für den ersten Test,
        // falls dein Angular-Client noch keine feste ID hat
        validation.validate_aud = false;

        let token_data = jsonwebtoken::decode::<Claims>(token, &decoding_key, &validation)
            .map_err(|e| {
                (
                    StatusCode::UNAUTHORIZED,
                    format!("Token validation failed: {}", e),
                )
            })?;

        Ok(token_data.claims)
    }
}

// --- APP STATE & MODELS ---

#[derive(Clone)]
struct AppState {
    db: PgPool,
}

#[derive(Serialize)]
struct StatusResponse {
    status: String,
    message: String,
    database: String,
}

#[derive(Serialize, sqlx::FromRow)]
struct Item {
    id: i32,
    title: String,
    description: Option<String>,
    owner_id: Uuid, // Ändere dies von String zu Uuid
}

#[tokio::main]
async fn main() {
    dotenv().ok();
    tracing_subscriber::fmt::init();

    let database_url =
        std::env::var("DATABASE_URL").expect("DATABASE_URL muss in der .env gesetzt sein");

    let pool = PgPoolOptions::new()
        .max_connections(5)
        .acquire_timeout(Duration::from_secs(3))
        .connect(&database_url)
        .await
        .expect("Konnte keine Verbindung zur Datenbank herstellen");

    let state = AppState { db: pool.clone() };

    // In main.rs nach der Pool-Erstellung:
    sqlx::migrate!("./migrations")
        .run(&pool)
        .await
        .expect("Konnte Migrationen nicht ausführen");

    let app = Router::new()
        .route("/api/status", get(get_status))
        .route("/api/items", get(get_my_items)) // Geschützte Route
        .route("/api/welcome", get(welcome_handler)) // Geschützte Route
        .layer(CorsLayer::permissive())
        .with_state(state);

    let addr = SocketAddr::from(([127, 0, 0, 1], 52102));
    println!(
        "🏙️  SHIBUYA API verbunden mit DB und läuft auf http://{}",
        addr
    );

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

// --- HANDLER ---

async fn get_status(State(state): State<AppState>) -> Json<StatusResponse> {
    let db_status = match sqlx::query("SELECT 1").execute(&state.db).await {
        Ok(_) => "verbunden",
        Err(_) => "Fehler",
    };

    Json(StatusResponse {
        status: "online".to_string(),
        message: "SHIBUYA Rust Backend ist bereit".to_string(),
        database: db_status.to_string(),
    })
}

async fn get_my_items(
    State(state): State<AppState>,
    claims: Claims,
) -> Result<Json<Vec<Item>>, (StatusCode, String)> {
    // 0. Logging für Sven
    println!(
        "🔑 SHIBUYA Auth: User {} möchte seine Items abholen",
        claims.sub
    );

    // 1. Explizite Konvertierung
    let user_uuid = Uuid::parse_str(&claims.sub).map_err(|_| {
        (
            StatusCode::BAD_REQUEST,
            "Ungültige User-ID Form".to_string(),
        )
    })?;

    // 2. Query mit expliziter Typ-Zuweisung für den Error-Handler
    let items_result = sqlx::query_as::<_, Item>(
        "SELECT id, title, description, owner_id FROM items WHERE owner_id = $1",
    )
    .bind(user_uuid) // Parameter binden
    .fetch_all(&state.db)
    .await;

    // 3. Fehlerbehandlung getrennt, damit Rust den Typ 'e' eindeutig zuordnen kann
    match items_result {
        Ok(items) => Ok(Json(items)),
        Err(e) => Err((StatusCode::INTERNAL_SERVER_ERROR, e.to_string())),
    }
}

// --- HILFSFUNKTION (REINE LOGIK) ---
// --- HILFSFUNKTION (REINE LOGIK) ---
pub fn perform_email_dispatch(to_email: &str) -> Result<(), String> {
    let email = Message::builder()
        .from(
            "SHIBUYA System <noreply@shibuya.dev>"
                .parse()
                .map_err(|e: lettre::address::AddressError| e.to_string())?,
        )
        .to(to_email
            .parse()
            .map_err(|e: lettre::address::AddressError| e.to_string())?)
        .subject("Willkommen bei SHIBUYA!")
        .body(String::from(
            "Dein Account wurde erfolgreich im Framework erstellt.",
        ))
        .unwrap();

    // Wir nutzen builder_dangerous, um TLS für localhost zu deaktivieren
    let transport = SmtpTransport::builder_dangerous("localhost")
        .port(52401)
        .tls(Tls::None) // Deaktiviert den SSL/TLS Handshake
        .build();

    match transport.send(&email) {
        Ok(_) => {
            println!("📨 Mailer: {} ➔ Delivered", to_email);
            Ok(())
        }
        Err(e) => {
            eprintln!("❌ SMTP Fehler: {:?}", e); // Mehr Details im Konsolen-Log
            Err(format!("Versand fehlgeschlagen: {:?}", e))
        }
    }
}

// --- HANDLER (FÜR AXUM ROUTE) ---
async fn welcome_handler(claims: Claims) -> Result<(StatusCode, String), (StatusCode, String)> {
    // Wir nehmen die E-Mail aus den Keycloak-Claims
    let user_email = claims.email.as_deref().unwrap_or("unbekannt@test.de");

    match perform_email_dispatch(user_email) {
        Ok(_) => Ok((
            StatusCode::OK,
            format!("📨 Mailer ➔ Willkommens-Mail an {} gesendet!", user_email),
        )),
        Err(e) => Err((StatusCode::INTERNAL_SERVER_ERROR, e)),
    }
}
