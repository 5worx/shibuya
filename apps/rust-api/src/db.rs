use sqlx::PgPool;
use sqlx::postgres::PgPoolOptions;
use std::time::Duration;

pub async fn init_pool() -> PgPool {
    let database_url =
        std::env::var("DATABASE_URL").expect("DATABASE_URL muss in der .env gesetzt sein");

    PgPoolOptions::new()
        .max_connections(5)
        .acquire_timeout(Duration::from_secs(3))
        .connect(&database_url)
        .await
        .expect("Konnte keine Verbindung zur Datenbank herstellen")
}

pub async fn run_migrations(pool: &PgPool) {
    // 1. Schema-Migrationen
    sqlx::migrate!("./migrations")
        .run(pool)
        .await
        .expect("Migrationen fehlgeschlagen");

    println!("✅ SHIBUYA: Datenbank-Migrationen erfolgreich angewendet.");
}
