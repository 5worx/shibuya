use crate::AppState; // Wir brauchen den Zugriff auf den State
use crate::auth::Claims;
use crate::error::AppError;
use crate::models::item::Item;
use axum::{Json, extract::State};
use uuid::Uuid;

pub async fn get_my_items(
    State(state): State<AppState>,
    claims: Claims,
) -> Result<Json<Vec<Item>>, AppError> {
    // AppError nutzen!

    let user_uuid = Uuid::parse_str(&claims.sub)
        .map_err(|_| AppError::BadRequest("Ungültige User-ID".into()))?;

    // Dank des 'impl From<sqlx::Error>' können wir hier einfach '?' nutzen!
    let items = sqlx::query_as::<_, Item>(
        "SELECT id, title, description, owner_id FROM items WHERE owner_id = $1",
    )
    .bind(user_uuid)
    .fetch_all(&state.db)
    .await?;

    Ok(Json(items))
}
