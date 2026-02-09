mod auth;
mod db;
mod error;
mod handlers;
mod middleware;
mod models;
mod routes;

use crate::routes::create_router;
use dotenvy::dotenv;
use std::net::SocketAddr;
use tower_http::cors::CorsLayer;

// Der AppState muss pub sein, damit die Handler in den anderen
// Dateien darauf zugreifen können (crate::main::AppState).
#[derive(Clone)]
pub struct AppState {
    pub db: sqlx::PgPool,
}

#[tokio::main]
async fn main() {
    // 1. Umgebung & Logging initialisieren
    dotenv().ok();
    tracing_subscriber::fmt::init();

    // 2. Datenbank-Pool über das db-Modul aufbauen
    let pool = db::init_pool().await;

    // 3. Migrationen beim Start ausführen (automatisch)
    db::run_migrations(&pool).await;

    // 4. State erstellen
    let state = AppState { db: pool };

    // 5. Router laden (Logik in src/routes/mod.rs)
    // Wir übergeben den State an create_router, um ihn dort zu binden
    let app = create_router(state).layer(CorsLayer::permissive());

    // 6. Server-Konfiguration & Start
    // Wir nutzen die Adresse aus deinem ursprünglichen Code
    let addr = SocketAddr::from(([127, 0, 0, 1], 52102));

    println!(
        "\n🏙️  SHIBUYA - The Framework Agnostics Development System\n\
         🚀 API läuft auf http://{}\n\
         📦 Datenbank-Status: Verbunden & Migriert\n",
        addr
    );

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
