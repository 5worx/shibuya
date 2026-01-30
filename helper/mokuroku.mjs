import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MOKUROKU_DIR = path.join(__dirname, "../mokuroku");
const TEMPLATE_DIR = path.join(MOKUROKU_DIR, ".templates");

const command = process.argv[2];

const checkGitSetup = () => {
  try {
    const name = execSync("git config --local user.name").toString().trim();
    const email = execSync("git config --local user.email").toString().trim();
    return `${name} <${email}>`;
  } catch {
    console.warn(
      "\x1b[33m⚠️ Git-Identität fehlt! Bitte 'git config --local user.name' setzen.\x1b[0m",
    );
    return "Unbekannter Autor";
  }
};

const createEntry = (type) => {
  const author = checkGitSetup();
  const targetDir = path.join(MOKUROKU_DIR, type);
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

  // Argument Parsing für -t
  const args = process.argv.slice(3);
  const tIndex = args.findIndex((arg) => arg === "-t");
  const title =
    tIndex !== -1 && args[tIndex + 1] ? args[tIndex + 1] : `neuer-${type}`;

  const now = new Date();
  const timestamp = `${now.toISOString().split("T")[0]}-${now.getHours().toString().padStart(2, "0")}${now.getMinutes().toString().padStart(2, "0")}`;

  const fileName = `${timestamp}-${title.toLowerCase().replace(/\s+/g, "-")}.md`;
  const fullPath = path.join(targetDir, fileName);

  const templatePath = path.join(TEMPLATE_DIR, `${type}.md`);
  let content = fs.existsSync(templatePath)
    ? fs.readFileSync(templatePath, "utf8")
    : `# ${type.toUpperCase()}: {{TITLE}}\n\nAutor: {{AUTHOR}}`;

  content = content
    .replaceAll("{{TITLE}}", title)
    .replaceAll("{{DATE}}", now.toLocaleDateString("de-DE"))
    .replaceAll("{{AUTHOR}}", author);

  fs.writeFileSync(fullPath, content);
  console.log(`\x1b[32m🚀 ${type.toUpperCase()} erstellt: ${fileName}\x1b[0m`);

  execSync(`${process.env.EDITOR || "vi"} ${fullPath}`, { stdio: "inherit" });
};

switch (command) {
  case "retro":
  case "notes":
    createEntry(command);
    break;
  case "view":
    // Hier rufen wir deinen Express-Viewer auf
    execSync("node helper/tools/mokuroku-viewer.mjs", { stdio: "inherit" });
    break;

  default:
    console.log("Benutzung: pnpm mokuroku [retro|notes|view] -t 'Titel'");
}
