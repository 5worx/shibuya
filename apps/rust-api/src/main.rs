use axum::{Json, Router, routing::get};
use serde::Serialize;
use std::net::SocketAddr;
use tower_http::cors::CorsLayer;

#[derive(Serialize)]
struct StatusResponse {
    status: String,
    message: String,
    devsystem: String,
}

#[tokio::main]
async fn main() {
    // Initialisiere Logging
    tracing_subscriber::fmt::init();

    // Erstelle die Route
    let app = Router::new()
        .route("/api/status", get(get_status))
        // CORS für die Angular-App hinzufügen
        .layer(CorsLayer::permissive());

    // Server-Adresse definieren
    let addr = SocketAddr::from(([127, 0, 0, 1], 52102));
    println!("🏙️  RUST API läuft auf http://{}", addr);

    // Server starten
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn get_status() -> Json<StatusResponse> {
    Json(StatusResponse {
        status: "online".to_string(),
        message: "Rust Backend ist bereit".to_string(),
        devsystem: "SHIBUYA FADS".to_string(),
    })
}
