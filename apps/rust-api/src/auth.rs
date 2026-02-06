use axum::{
    async_trait,
    extract::FromRequestParts,
    http::{StatusCode, request::Parts},
};
use serde::{Deserialize, Serialize};

// --- AUTH STRUKTUREN ---

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String, // Die User-ID von Keycloak
    pub email: Option<String>,
    pub preferred_username: Option<String>,
}

// --- Auth-Validierung ---
#[async_trait]
impl<S> FromRequestParts<S> for Claims
where
    S: Send + Sync,
{
    type Rejection = (StatusCode, String);

    async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection> {
        // 1. Token aus Header extrahieren
        let auth_header = parts
            .headers
            .get(axum::http::header::AUTHORIZATION)
            .and_then(|h| h.to_str().ok())
            .ok_or((
                StatusCode::UNAUTHORIZED,
                "Missing Authorization header".to_string(),
            ))?;

        if !auth_header.starts_with("Bearer ") {
            return Err((StatusCode::UNAUTHORIZED, "Invalid token type".to_string()));
        }

        let token = &auth_header[7..];

        // 2. Keycloak Public Keys laden (JWKS)
        // In SHIBUYA laden wir das aktuell live, später können wir das cachen
        let jwks_url = "http://localhost:52201/realms/FADS/protocol/openid-connect/certs";
        let jwks: serde_json::Value = reqwest::get(jwks_url)
            .await
            .map_err(|_| {
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    "Konnte Keycloak Keys nicht laden".to_string(),
                )
            })?
            .json()
            .await
            .map_err(|_| {
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    "Fehler beim Parsen der Keys".to_string(),
                )
            })?;

        // 3. Token Header dekodieren, um den richtigen Key zu finden
        let header = jsonwebtoken::decode_header(token)
            .map_err(|_| (StatusCode::UNAUTHORIZED, "Invalid token header".to_string()))?;

        let kid = header
            .kid
            .ok_or((StatusCode::UNAUTHORIZED, "Missing kid in token".to_string()))?;

        // 4. Den passenden Key aus dem JWKS finden
        let jwk = jwks["keys"]
            .as_array()
            .and_then(|keys| keys.iter().find(|key| key["kid"] == kid))
            .ok_or((
                StatusCode::UNAUTHORIZED,
                "Matching key not found".to_string(),
            ))?;

        // 5. Token validieren
        let decoding_key = jsonwebtoken::DecodingKey::from_rsa_components(
            jwk["n"].as_str().unwrap(),
            jwk["e"].as_str().unwrap(),
        )
        .map_err(|_| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Invalid decoding key".to_string(),
            )
        })?;

        let mut validation = jsonwebtoken::Validation::new(jsonwebtoken::Algorithm::RS256);
        validation.set_issuer(&["http://localhost:52201/realms/FADS"]);

        // FADS-Einstellung: Audience-Prüfung für Dev deaktiviert
        validation.validate_aud = false;

        let token_data = jsonwebtoken::decode::<Claims>(token, &decoding_key, &validation)
            .map_err(|e| {
                (
                    StatusCode::UNAUTHORIZED,
                    format!("Token validation failed: {}", e),
                )
            })?;

        Ok(token_data.claims)
    }
}
