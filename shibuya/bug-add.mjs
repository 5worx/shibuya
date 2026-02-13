import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import yaml from "js-yaml";

// 1. Parameter prüfen
const [type, title] = [process.argv[2], process.argv[3]];
if (!["STORY", "TASK", "FIX"].includes(type) || !title) {
  console.error("❌ pnpm bug:add [STORY|TASK|FIX] 'Titel'");
  process.exit(1);
}

const ROOT_DIR = process.cwd();
const SUIDO_CONFIG_PATH = path.join(
  ROOT_DIR,
  "shibuya",
  "suido",
  "suido.config.yaml",
);

function getMokurokuPort() {
  try {
    const raw = yaml.load(fs.readFileSync(SUIDO_CONFIG_PATH, "utf8"));
    const prefix = raw.SETTINGS?.portprefix || 52;
    const category = 8; // SHIBUYA Kategorie
    const appId = raw.SHIBUYA?.mokuroku || 1;

    // Die SUIDO-Formel: {PREFIX}{CATEGORY}{ID.padStart(2, '0')}
    return parseInt(
      `${prefix}${category}${appId.toString().padStart(2, "0")}`,
      10,
    );
  } catch (e) {
    console.warn("⚠️ SUIDO Config nicht lesbar, weiche auf Default 52801 aus.");
    return 52801;
  }
}

// 2. SUIDO Port für den Link holen
const PORT = getMokurokuPort() || 3000;

try {
  // 3. Bug in git-bug anlegen
  // WICHTIG: -m "" sorgt dafür, dass kein Editor für die Beschreibung aufgeht!
  console.log(`\x1b[34m🐛 Erstelle Bug in git-bug...\x1b[0m`);

  // 3. Bug erstellen (mit -m um den Editor zu umgehen)
  const rawOutput = execSync(
    `git-bug bug new -t "${title}" -m "Asset-Ordner automatisch erstellt."`,
  )
    .toString()
    .trim();

  // Sicherer Extraktions-Weg: Wir suchen nach dem Hex-String
  // Der Output ist: "bug <ID> created"
  const parts = rawOutput.split(/\s+/);
  const bugId = parts[0];

  if (!bugId || bugId === "created") {
    throw new Error(
      `ID konnte nicht extrahiert werden. Output war: "${rawOutput}"`,
    );
  }

  // 4. Label hinzufügen
  // Falls "label add" nicht geht, probier "label" allein - laut deiner Hilfe-Liste: git-bug bug label [BUG_ID]
  console.log(`🏷️  Setze Label: ${type}...`);
  execSync(`git-bug bug label new "${bugId}" "${type}"`);

  // 4. Mokuroku Asset-Ordner erstellen
  const assetPath = `mokuroku/assets/bugs/${bugId}`;
  fs.mkdirSync(path.join(process.cwd(), assetPath), { recursive: true });

  // 5. Den SUIDO-konformen Link generieren
  const assetUrl = `http://localhost:${PORT}/${assetPath}`;
  const markdownLink = `[📂 Assets & Screenshots](${assetUrl})`;

  // 6. Kommentar in git-bug schreiben
  execSync(`git-bug bug comment new "${bugId}" -m "${markdownLink}"`);

  console.log(`\n\x1b[32m✅ Bug ${bugId} angelegt.\x1b[0m`);
  console.log(`🔗 SUIDO-Link: ${assetUrl}`);

  // 7. Explorer öffnen
  const openCmd = process.platform === "darwin" ? "open" : "xdg-open";
  execSync(`${openCmd} "${path.resolve(assetPath)}"`);
} catch (e) {
  console.log(e.message);
  if (
    e.message.includes("locked by the process pid") ||
    e.message.includes("already in use")
  ) {
    console.error(
      "\n\x1b[31m🛑 SUIDO-BLOCKADE: git-bug Datenbank ist gesperrt!\x1b[0m",
    );
    console.error(
      "Die WebUI scheint noch zu laufen. Bitte beende die WebUI im anderen Terminal-Tab (Strg+C),",
    );
    console.error(
      "führe diesen Befehl erneut aus und starte die WebUI danach wieder.\n",
    );
  } else {
    console.error("❌ Fehler:", e.message);
  }
  process.exit(1);
}
