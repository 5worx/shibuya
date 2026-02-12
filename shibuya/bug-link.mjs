import { execSync } from "child_process";
import fs from "fs";
import path from "path";

// 1. Hole die ID des neuesten oder eines spezifischen Bugs
const bugId =
  process.argv[2] ||
  execSync("git bug ls -v | head -n 1").toString().split("\t")[0].trim();

if (!bugId) {
  console.error(
    "Keine Bug-ID gefunden. Erstelle erst einen mit 'git bug add'.",
  );
  process.exit(1);
}

// 2. Pfad in Mokuroku definieren
const assetPath = path.join("mokuroku", "assets", "bugs", bugId);

// 3. Ordner erstellen, falls er nicht existiert
if (!fs.existsSync(assetPath)) {
  fs.mkdirSync(assetPath, { recursive: true });

  // Optional: Erstelle eine README im Ordner als Anker
  const readmeContent = `# Assets für Bug ${bugId}\n\nHier können Screenshots, Logs oder andere Dokumente abgelegt werden.`;
  fs.writeFileSync(path.join(assetPath, "README.md"), readmeContent);

  console.log(`✅ Asset-Ordner erstellt: ${assetPath}`);
} else {
  console.log(`ℹ️ Asset-Ordner für Bug ${bugId} existiert bereits.`);
}

// 4. Den Pfad direkt in die Zwischenablage kopieren (optional, hilfreich für Markdown-Links)
console.log(`🔗 Link-Vorschlag für git-bug: [Siehe Assets](${assetPath})`);
