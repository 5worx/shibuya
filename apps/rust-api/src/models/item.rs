use serde::Serialize;
use uuid::Uuid;

#[derive(Serialize, sqlx::FromRow)]
pub struct Item {
    pub id: i32,
    pub title: String,
    pub description: Option<String>,
    pub owner_id: Uuid,
}
