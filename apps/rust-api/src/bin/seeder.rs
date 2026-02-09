use serde::Deserialize;
use sqlx::postgres::PgPoolOptions;
use std::time::Duration;
use std::{env, fs, process};

#[derive(Deserialize)]
struct PersonSeed {
    firstname: String,
    lastname: String,
    role: String,
    email: String,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // 1. Umgebung laden
    dotenvy::dotenv().ok();

    // 2. Argumente prüfen (Pfad zur JSON Datei)
    let args: Vec<String> = env::args().collect();
    if args.len() < 2 {
        eprintln!("❌ Fehler: Bitte gib einen Dateipfad an (z.B. seeds/persons.dev.json)");
        process::exit(1);
    }
    let file_path = &args[1];

    let mut db_url = env::var("DATABASE_URL").expect("DATABASE_URL fehlt");

    // SSL-Check für lokale Entwicklung (verhindert den "0 bytes" Fehler)
    if !db_url.contains("sslmode=") {
        if db_url.contains('?') {
            db_url.push_str("&sslmode=disable");
        } else {
            db_url.push_str("?sslmode=disable");
        }
    }

    // 3. Datenbank-Verbindung aufbauen
    let pool = PgPoolOptions::new()
        .max_connections(1)
        .acquire_timeout(Duration::from_secs(5))
        .connect(&db_url)
        .await
        .map_err(|e| format!("Fehler beim Verbindungsaufbau zur DB: {}", e))?;

    // --- MIGRATIONEN ENTFERNT ---
    // Das Schema wird jetzt extern über "sqlx migrate run" gesteuert.

    // 4. JSON-Datei einlesen
    let data = fs::read_to_string(file_path)
        .map_err(|e| format!("Konnte Datei '{}' nicht öffnen: {}", file_path, e))?;

    let people: Vec<PersonSeed> = serde_json::from_str(&data)
        .map_err(|e| format!("Fehler beim Parsen der JSON-Daten: {}", e))?;

    println!(
        "🌱 SHIBUYA Seeder: Starte Daten-Import aus '{}'...",
        file_path
    );

    // 5. Daten einfügen (Idempotent dank ON CONFLICT)
    for p in &people {
        sqlx::query!(
            "INSERT INTO people (firstname, lastname, role, email)
             VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING",
            p.firstname,
            p.lastname,
            p.role,
            p.email
        )
        .execute(&pool)
        .await
        .map_err(|e| format!("Fehler beim Einfügen von {}: {}", p.email, e))?;
    }

    println!(
        "✅ Seeding für {} Einträge erfolgreich abgeschlossen.",
        people.len()
    );
    Ok(())
}
