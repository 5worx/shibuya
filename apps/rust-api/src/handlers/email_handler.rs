use crate::auth::Claims;
use axum::http::StatusCode;
use lettre::transport::smtp::client::Tls;
use lettre::{Message, SmtpTransport, Transport};

pub async fn welcome_handler(claims: Claims) -> Result<(StatusCode, String), (StatusCode, String)> {
    let user_email = claims.email.as_deref().unwrap_or("unbekannt@test.de");

    match perform_email_dispatch(user_email) {
        Ok(_) => Ok((
            StatusCode::OK,
            format!("📨 Mailer ➔ Willkommens-Mail an {} gesendet!", user_email),
        )),
        Err(e) => Err((StatusCode::INTERNAL_SERVER_ERROR, e)),
    }
}

// Die reine Logik-Funktion
pub fn perform_email_dispatch(to_email: &str) -> Result<(), String> {
    let email = Message::builder()
        .from("SHIBUYA System <noreply@shibuya.dev>".parse().unwrap())
        .to(to_email
            .parse()
            .map_err(|e: lettre::address::AddressError| e.to_string())?)
        .subject("Willkommen bei SHIBUYA!")
        .body(String::from(
            "Dein Account wurde erfolgreich im Framework erstellt.",
        ))
        .unwrap();

    let transport = SmtpTransport::builder_dangerous("localhost")
        .port(52401)
        .tls(Tls::None)
        .build();

    match transport.send(&email) {
        Ok(_) => {
            println!("📨 Mailer: {} ➔ Delivered", to_email);
            Ok(())
        }
        Err(e) => {
            eprintln!("❌ SMTP Fehler: {:?}", e);
            Err(format!("Versand fehlgeschlagen: {:?}", e))
        }
    }
}
