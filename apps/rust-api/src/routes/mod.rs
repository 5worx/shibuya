use crate::AppState;
use crate::middleware::auth_layer::require_auth;
use axum::{Router, middleware, routing::get};
mod people_routes;

pub fn create_router(state: AppState) -> Router {
    let api_routes = Router::new()
        .route(
            "/welcome",
            get(crate::handlers::email_handler::welcome_handler),
        )
        .nest("/people", people_routes::routes())
        .route_layer(middleware::from_fn(require_auth));

    Router::new()
        .route("/", get(crate::handlers::status_handler::get_status))
        .nest("/api", api_routes)
        .with_state(state)

    // Router::new()
    //     // Direkte Routen (Status)
    //     .route(
    //         "/api/status",
    //         get(crate::handlers::status_handler::get_status),
    //     )
    //     // Geschützte Routen (Welcome/Email)
    //     .route(
    //         "/api/welcome",
    //         get(crate::handlers::email_handler::welcome_handler),
    //     )
    //     .nest("/api/people", people_routes::routes())
    //     .with_state(state)
}
