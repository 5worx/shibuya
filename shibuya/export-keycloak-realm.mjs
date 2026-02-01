import { execSync } from "child_process";
import path from "path";

// Konfiguration
const CONTAINER_NAME = "shibuya-keycloak-admin";
const REALM_NAME = "FADS";
const EXPORT_TARGET_PATH = "./infrastructure/keycloak/import/realm-export.json";

async function exportKeycloak() {
  console.log(`🚀 Starte Keycloak-Export für Realm: ${REALM_NAME}...`);

  try {
    // 1. Export innerhalb des Containers ausführen
    // Wir exportieren in eine temporäre Datei im Container
    const containerTempFile = `/tmp/realm-export.json`;

    console.log("📦 Generiere Export-Datei im Container...");
    execSync(
      `docker exec ${CONTAINER_NAME} /opt/keycloak/bin/kc.sh export --realm ${REALM_NAME} --file ${containerTempFile}`,
      { stdio: "inherit" },
    );

    // 2. Datei vom Container auf den Host kopieren
    console.log("🚚 Kopiere Datei aus dem Container...");
    execSync(
      `docker cp ${CONTAINER_NAME}:${containerTempFile} ${EXPORT_TARGET_PATH}`,
      { stdio: "inherit" },
    );

    // 3. Temporäre Datei im Container aufräumen
    execSync(`docker exec ${CONTAINER_NAME} rm ${containerTempFile}`);

    console.log(
      `✅ Erfolg! Der Realm wurde nach ${path.resolve(EXPORT_TARGET_PATH)} exportiert.`,
    );
    console.log(
      "💡 Tipp: Überprüfe die Datei und committe sie in dein Git-Repo.",
    );
  } catch (error) {
    console.error("❌ Fehler beim Export:", error.message);
    process.exit(1);
  }
}

exportKeycloak();
