use crate::AppState;
use crate::handlers::person_handler;
use axum::{Router, routing::get};

pub fn routes() -> Router<AppState> {
    Router::new().route("/", get(person_handler::list_people))
}
