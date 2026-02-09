
use axum::{
    extract::Request,
    middleware::Next,
    response::Response,
    http::{StatusCode, header},
};

pub async fn require_auth(
    req: Request,
    next: Next,
) -> Result<Response, StatusCode> {
    let auth_header = req.headers()
        .get(header::AUTHORIZATION)
        .and_then(|h| h.to_str().ok());

    match auth_header {
        Some(auth_str) if auth_str.starts_with("Bearer ") => {
            // Hier kommt später die echte JWT-Verifizierung hin!
            // Für den Moment prüfen wir nur, ob überhaupt etwas da ist.
            Ok(next.run(req).await)
        }
        _ => {
            println!("🚫 Zugriff verweigert: Fehlender oder ungültiger Token");
            Err(StatusCode::UNAUTHORIZED)
        }
    }
}
