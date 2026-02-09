use crate::AppState;
use axum::{Router, routing::get};
mod people_routes;

pub fn create_router(state: AppState) -> Router {
    Router::new()
        // Direkte Routen (Status)
        .route(
            "/api/status",
            get(crate::handlers::status_handler::get_status),
        )
        // Geschützte Routen (Welcome/Email)
        .route(
            "/api/welcome",
            get(crate::handlers::email_handler::welcome_handler),
        )
        .nest("/api/people", people_routes::routes())
        .with_state(state)
}
