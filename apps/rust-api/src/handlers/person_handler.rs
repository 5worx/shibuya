use crate::AppState;
use crate::error::AppError;
use crate::models::person::Person;
use axum::{Json, extract::State};

pub async fn list_people(State(state): State<AppState>) -> Result<Json<Vec<Person>>, AppError> {
    let people = sqlx::query_as::<_, Person>(
        "SELECT id, firstname, lastname, role, email FROM people ORDER BY id ASC",
    )
    .fetch_all(&state.db)
    .await?;

    Ok(Json(people))
}
