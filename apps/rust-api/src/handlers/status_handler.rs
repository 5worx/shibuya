use crate::AppState;
use axum::{Json, extract::State};
use serde::Serialize;

#[derive(Serialize)]
pub struct StatusResponse {
    pub status: String,
    pub message: String,
    pub database: String,
}

pub async fn get_status(State(state): State<AppState>) -> Json<StatusResponse> {
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
