import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import yaml from "js-yaml";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, "..");
const MOKUROKU_DIR = path.join(ROOT_DIR, "mokuroku");
const TEMPLATE_DIR = path.join(MOKUROKU_DIR, ".templates");

const command = process.argv[2];

// Hilfsfunktion: Git-Identität
const getAuthor = () => {
  try {
    const name = execSync("git config --local user.name").toString().trim();
    const email = execSync("git config --local user.email").toString().trim();
    return `${name} <${email}>`;
  } catch {
    return "Unbekannter Autor";
  }
};

const createEntry = (type) => {
  const targetDir = path.join(MOKUROKU_DIR, type);
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

  // Argument Parsing für Titel (-t)
  const args = process.argv.slice(3);
  const tIndex = args.findIndex((arg) => arg === "-t");
  const title =
    tIndex !== -1 && args[tIndex + 1] ? args[tIndex + 1] : `neuer-${type}`;

  const now = new Date();
  const timestamp = `${now.toISOString().split("T")[0]}-${now.getHours().toString().padStart(2, "0")}${now.getMinutes().toString().padStart(2, "0")}`;
  const fileName = `${timestamp}-${title.toLowerCase().replace(/\s+/g, "-")}.md`;
  const fullPath = path.join(targetDir, fileName);

  // Template Logik
  const templatePath = path.join(TEMPLATE_DIR, `${type}.md`);
  let content = fs.existsSync(templatePath)
    ? fs.readFileSync(templatePath, "utf8")
    : `# ${type.toUpperCase()}: {{TITLE}}\n\nAutor: {{AUTHOR}}`;

  content = content
    .replaceAll("{{TITLE}}", title)
    .replaceAll("{{DATE}}", now.toLocaleDateString("de-DE"))
    .replaceAll("{{AUTHOR}}", getAuthor());

  fs.writeFileSync(fullPath, content);
  console.log(`\x1b[32m🚀 ${type.toUpperCase()} erstellt: ${fileName}\x1b[0m`);

  // Editor öffnen
  execSync(`${process.env.EDITOR || "vi"} ${fullPath}`, { stdio: "inherit" });
};

// Router
switch (command) {
  case "retro":
  case "notes":
    createEntry(command);
    break;
  case "view":
    execSync("node shibuya/mokuroku-viewer.mjs", { stdio: "inherit" });
    break;
  case "unlock":
    const keyName = config.project?.security?.vault_key || "project.key";
    const keyPath = path.join(ROOT_DIR, "..", ".shibuya-vault", keyName);

    if (!fs.existsSync(keyPath)) {
      console.error(`\x1b[31m❌ Key nicht gefunden in: ${keyPath}\x1b[0m`);
      process.exit(1);
    }

    console.log(
      `\x1b[34m🔓 SHIBUYA: Entriegele Tresor mit ${keyName}...\x1b[0m`,
    );
    try {
      execSync(`git-crypt unlock ${keyPath}`);
      console.log("\x1b[32m✅ Tresor ist offen. Viel Erfolg, Kuroko.\x1b[0m");
    } catch (e) {
      console.error(
        "\x1b[31m❌ Unlock fehlgeschlagen. Ist git-crypt installiert?\x1b[0m",
      );
    }
    break;
  default:
    console.log(
      "Benutzung: pnpm mokuroku [retro|notes|view|unlock] -t 'Titel'",
    );
}
