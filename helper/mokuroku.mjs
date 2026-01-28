import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MOKUROKU_DIR = path.join(__dirname, "../mokuroku");
const ADR_DIR = path.join(MOKUROKU_DIR, "adr");
const TEMPLATE_PATH = path.join(ADR_DIR, "template.md");

const getGitConfig = (key) => {
  try {
    return execSync(`git config --local ${key}`).toString().trim();
  } catch {
    return null;
  }
};

const checkGitSetup = () => {
  const name = getGitConfig("user.name");
  const email = getGitConfig("user.email");

  if (!name || !email) {
    console.warn(
      "\x1b[33m%s\x1b[0m",
      "⚠️  WARNUNG: Git-Identität nicht vollständig konfiguriert!",
    );
    console.log("Bitte setze deine Daten mit:");
    console.log(`  git config --local user.name "Dein Name"`);
    console.log(`  git config --local user.email "deine@mail.de"\n`);
    return null;
  }
  return `${name} <${email}>`;
};

// Hilfsfunktion: Prüfen ob ein Befehl existiert (agnostisch)
const commandExists = (cmd) => {
  try {
    execSync(`command -v ${cmd} > /dev/null 2>&1`);
    return true;
  } catch {
    return false;
  }
};

const command = process.argv[2];

switch (command) {
  case "view":
    const indexPath = path.join(MOKUROKU_DIR, "INDEX.md");
    if (commandExists("glow")) {
      execSync(`glow ${indexPath}`, { stdio: "inherit" });
    } else {
      console.log(fs.readFileSync(indexPath, "utf8"));
    }
    break;

  case "adr":
    const author = checkGitSetup();
    if (!author) process.exit(1);

    const title = process.argv.slice(3).join(" ") || "neue-entscheidung";
    const dateStr = new Date().toISOString().split("T")[0];
    const fileName = `${dateStr}-${title.toLowerCase().replace(/\s+/g, "-")}.md`;
    const fullPath = path.join(ADR_DIR, fileName);

    let template = fs.existsSync(TEMPLATE_PATH)
      ? fs.readFileSync(TEMPLATE_PATH, "utf8")
      : "# ADR: {{TITLE}}\nAutor: {{AUTHOR}}"; // Minimal-Fallback

    const content = template
      .replace("{{TITLE}}", title)
      .replace("{{DATE}}", new Date().toLocaleDateString("de-DE"))
      .replace("{{AUTHOR}}", author);

    fs.writeFileSync(fullPath, content);
    console.log(`🚀 ADR erstellt: ${fileName}`);

    execSync(`${process.env.EDITOR || "vi"} ${fullPath}`, { stdio: "inherit" });
    break;

  default:
    console.log("Usage: pnpm mokuroku [view|adr]");
}
