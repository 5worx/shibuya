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

    // 2. Argumente prüfen
    let args: Vec<String> = env::args().collect();
    if args.len() < 2 {
        eprintln!("❌ Fehler: Bitte gib einen Dateipfad an (z.B. seeds/persons.dev.json)");
        process::exit(1);
    }
    let file_path = &args[1];

    // Datenbank URL holen (Hier reicht ein einfacher Check, keine Compile-Time Prüfung)
    let db_url =
        env::var("DATABASE_URL").unwrap_or_else(|_| "postgres://localhost/dummy".to_string());

    // 3. Datenbank-Verbindung aufbauen
    // Falls die DB beim Start nicht da ist, bricht der Seeder zur LAUFZEIT ab, nicht beim Build.
    let pool = PgPoolOptions::new()
        .max_connections(1)
        .acquire_timeout(Duration::from_secs(5))
        .connect(&db_url)
        .await
        .map_err(|e| format!("Fehler beim Verbindungsaufbau zur DB: {}", e))?;

    // 4. JSON-Datei einlesen
    let data = fs::read_to_string(file_path)
        .map_err(|e| format!("Konnte Datei '{}' nicht öffnen: {}", file_path, e))?;

    let people: Vec<PersonSeed> = serde_json::from_str(&data)
        .map_err(|e| format!("Fehler beim Parsen der JSON-Daten: {}", e))?;

    println!("🌱 Seeder: Starte Daten-Import aus '{}'...", file_path);

    // 5. Daten einfügen
    // WICHTIG: sqlx::query (ohne !) nutzen, um die Compile-Time DB-Prüfung zu umgehen
    for p in &people {
        sqlx::query(
            "INSERT INTO people (firstname, lastname, role, email)
             VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING",
        )
        .bind(&p.firstname)
        .bind(&p.lastname)
        .bind(&p.role)
        .bind(&p.email)
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
