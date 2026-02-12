import { execSync } from "child_process";
import fs from "fs";
import path from "path";

// 1. DYNAMISCHE ID HOLEN
let bugId;
try {
  // Wir holen die Liste und nehmen die erste ID
  const output = execSync("git-bug bug").toString().trim();
  if (!output) throw new Error();

  // Extrahiert die ID (erste Spalte der ersten Zeile)
  bugId = output.split("\n")[0].split(/\s+/)[0].replace(/[[\]]/g, "");
} catch (e) {
  console.error("❌ Fehler: Keine Bug-ID gefunden.");
  process.exit(1);
}

// 2. PFADE DEFINIEREN
// Dieser Pfad ist relativ zum Projekt-Root
const relativePath = `mokuroku/assets/bugs/${bugId}`;
const fullPath = path.resolve(relativePath);

// 3. ORDNER ERSTELLEN (falls neu)
if (!fs.existsSync(relativePath)) {
  fs.mkdirSync(relativePath, { recursive: true });
  fs.writeFileSync(path.join(relativePath, "README.md"), `# Assets: ${bugId}`);
}

// 4. DER LINK FÜR DIE WEBUI
// Wir bauen die URL so zusammen, dass sie auf deinen Express-Server zeigt
const shibuyaServerUrl = `http://localhost:3000/${relativePath}`;
const markdownLink = `[📂 Assets öffnen](${shibuyaServerUrl})`;

// 5. AUSGABE & CLIPBOARD
console.log(`\n✅ Link für git-bug generiert (ID: ${bugId}):`);
console.log(`\x1b[34m${markdownLink}\x1b[0m\n`);

try {
  const copyCmd =
    process.platform === "darwin" ? "pbcopy" : "xclip -selection clipboard";
  execSync(`echo -n '${markdownLink}' | ${copyCmd}`);
  console.log("📋 In Zwischenablage kopiert!");
} catch (e) {
  // Falls xclip fehlt, nicht schlimm
}

// 6. ORDNER LOKAL ÖFFNEN
try {
  const openCmd = process.platform === "darwin" ? "open" : "xdg-open";
  execSync(`${openCmd} "${fullPath}"`);
} catch (e) {}
