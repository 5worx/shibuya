use axum::{Json, Router, extract::State, routing::get};
use dotenvy::dotenv;
use serde::Serialize;
use sqlx::PgPool;
use sqlx::postgres::PgPoolOptions;
use std::net::SocketAddr;
use std::time::Duration;
use tower_http::cors::CorsLayer;

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

#[tokio::main]
async fn main() {
    // 1. Lade die .env Datei (Das hat gefehlt!)
    dotenv().ok();

    // Logging initialisieren
    tracing_subscriber::fmt::init();

    // Datenbank-Verbindung herstellen
    let database_url =
        std::env::var("DATABASE_URL").expect("DATABASE_URL muss in der .env gesetzt sein");

    let pool = PgPoolOptions::new()
        .max_connections(5)
        .acquire_timeout(Duration::from_secs(3))
        .connect(&database_url)
        .await
        .expect("Konnte keine Verbindung zur Datenbank herstellen");

    let state = AppState { db: pool };

    // Router definieren
    let app = Router::new()
        .route("/api/status", get(get_status))
        .layer(CorsLayer::permissive())
        .with_state(state);

    // Auf Port 52102 lauschen
    let addr = SocketAddr::from(([127, 0, 0, 1], 52102));
    println!(
        "🏙️  SHIBUYA API verbunden mit DB und läuft auf http://{}",
        addr
    );

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn get_status(State(state): State<AppState>) -> Json<StatusResponse> {
    // Kleiner Check, ob die DB antwortet
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
