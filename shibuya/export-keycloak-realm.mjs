import { execSync } from "child_process";
import path from "path";

// 1. Argumente parsen
const args = process.argv.slice(2);

const getArgValue = (key) => {
  const arg = args.find((a) => a.startsWith(`--${key}=`));
  return arg ? arg.split("=")[1] : null;
};

const CONTAINER_NAME = getArgValue("container-name");
const REALM_NAME = getArgValue("realm");
const TARGET_PATH = getArgValue("target-path");

async function exportKeycloak() {
  // Validierung aller drei Parameter
  if (!CONTAINER_NAME || !REALM_NAME || !TARGET_PATH) {
    console.error("❌ Fehler: Fehlende Argumente!");
    console.error(
      "Benutzung: node ... --container-name=<name> --realm=<realm> --target-path=<path>",
    );
    process.exit(1);
  }

  console.log(`🚀 SHIBUYA-Export-Dienst:`);
  console.log(`   🏗️  Container:   ${CONTAINER_NAME}`);
  console.log(`   🔑 Realm:       ${REALM_NAME}`);
  console.log(`   📂 Zielpfad:    ${TARGET_PATH}`);

  try {
    const containerTempFile = `/tmp/realm-export-${REALM_NAME}.json`;

    // 1. Export im Container ausführen
    console.log("📦 Generiere Daten...");
    execSync(
      `docker exec ${CONTAINER_NAME} /opt/keycloak/bin/kc.sh export --realm ${REALM_NAME} --file ${containerTempFile}`,
      { stdio: "inherit" },
    );

    // 2. Datei kopieren (nutzt jetzt den dynamischen Pfad)
    console.log("🚚 Kopiere auf Host...");
    execSync(
      `docker cp ${CONTAINER_NAME}:${containerTempFile} ${TARGET_PATH}`,
      { stdio: "inherit" },
    );

    // 3. Cleanup
    execSync(`docker exec ${CONTAINER_NAME} rm ${containerTempFile}`);

    console.log(`\n✅ Erfolg! Exportiert nach: ${path.resolve(TARGET_PATH)}`);
  } catch (error) {
    console.error("\n❌ Fehler beim Export:");
    console.error(error.message);
    process.exit(1);
  }
}

exportKeycloak();
