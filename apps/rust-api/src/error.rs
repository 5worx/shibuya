use axum::{
    Json,
    http::StatusCode,
    response::{IntoResponse, Response},
};
use serde_json::json;

#[allow(dead_code)]
pub enum AppError {
    BadRequest(String),
    DatabaseError(sqlx::Error),
}

// Hier passiert die Magie: Wir sagen Axum, wie jeder Fehler als HTTP-Response aussieht
impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, error_message) = match self {
            AppError::BadRequest(msg) => (StatusCode::BAD_REQUEST, msg),
            AppError::DatabaseError(err) => (StatusCode::INTERNAL_SERVER_ERROR, err.to_string()),
        };

        let body = Json(json!({
            "error": error_message,
        }));

        (status, body).into_response()
    }
}

// Damit wir sqlx::Error einfach mit '?' in AppError umwandeln können
impl From<sqlx::Error> for AppError {
    fn from(err: sqlx::Error) -> Self {
        AppError::DatabaseError(err)
    }
}
