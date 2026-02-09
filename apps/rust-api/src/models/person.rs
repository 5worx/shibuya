use serde::Serialize;

#[derive(Serialize, sqlx::FromRow)]
pub struct Person {
    pub id: i32,
    pub firstname: String,
    pub lastname: String,
    pub role: String,
    pub email: String,
}
