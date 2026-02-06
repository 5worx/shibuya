use crate::AppState;
use crate::handlers::item_handler;
use axum::{Router, routing::get};

pub fn routes() -> Router<AppState> {
    Router::new().route("/", get(item_handler::get_my_items))
}
