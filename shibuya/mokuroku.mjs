import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import yaml from "js-yaml";
import { execSync } from "child_process";
import crypto from "crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, "..");
const MOKUROKU_DIR = path.join(ROOT_DIR, "mokuroku");
const TEMPLATE_DIR = path.join(MOKUROKU_DIR, ".templates");
const VAULT_FILE = path.join(MOKUROKU_DIR, "notes.vault");

// Der Tresor liegt eine Ebene ÜBER dem Repo-Verzeichnis
const EXTERNAL_VAULT_DIR = path.join(ROOT_DIR, "..", ".shibuya-vault");
const ALGORITHM = "aes-256-gcm";

const command = process.argv[2];

// 1. Einlesen der Konfiguration
let config = {};
try {
  const configPath = path.join(ROOT_DIR, "shibuya.workspaces.yaml");
  if (fs.existsSync(configPath)) {
    config = yaml.load(fs.readFileSync(configPath, "utf8"));
  }
} catch (e) {
  console.error("❌ Config-Fehler", e);
}

// 2. Schlüssel-Logik (Holen & Hashen)
const getVaultKey = () => {
  const keyName = config.project?.security?.vault_key;
  const keyPath = path.join(EXTERNAL_VAULT_DIR, keyName || "");
  if (!keyName || !fs.existsSync(keyPath)) {
    console.error(`\x1b[31m❌ Schlüssel fehlt in: ${keyPath}\x1b[0m`);
    process.exit(1);
  }
  const content = fs.readFileSync(keyPath, "utf8").trim();
  return crypto.createHash("sha256").update(content).digest();
};

// 3. AES-GCM Funktionen
const encrypt = (buffer, key) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const enc = Buffer.concat([cipher.update(buffer), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), enc]);
};

const decrypt = (buffer, key) => {
  const iv = buffer.subarray(0, 12);
  const tag = buffer.subarray(12, 28);
  const enc = buffer.subarray(28);
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(enc), decipher.final()]);
};

// 4. Tresor-Management (Bewahrt die Ordnerstruktur)
const unlockNotes = () => {
  if (fs.existsSync(VAULT_FILE)) {
    console.log("\x1b[34m🔓 Öffne Tresor...\x1b[0m");
    const key = getVaultKey();
    const decrypted = decrypt(fs.readFileSync(VAULT_FILE), key);
    const files = JSON.parse(decrypted.toString());

    Object.entries(files).forEach(([relPath, content]) => {
      const fullPath = path.join(MOKUROKU_DIR, relPath);
      fs.mkdirSync(path.dirname(fullPath), { recursive: true });
      fs.writeFileSync(fullPath, content);
    });
  }
};

const lockNotes = () => {
  const files = {};
  const categories = ["notes", "retro"];
  let foundAny = false;

  categories.forEach((cat) => {
    const catDir = path.join(MOKUROKU_DIR, cat);
    if (fs.existsSync(catDir)) {
      foundAny = true;
      fs.readdirSync(catDir).forEach((f) => {
        if (f.endsWith(".md")) {
          // Speichere relativen Pfad (z.B. "retro/file.md") als Key
          files[path.join(cat, f)] = fs.readFileSync(
            path.join(catDir, f),
            "utf8",
          );
        }
      });
    }
  });

  if (foundAny) {
    console.log("\x1b[34m🔒 Versiegle alle Kategorien...\x1b[0m");
    const key = getVaultKey();
    const vaultData = encrypt(Buffer.from(JSON.stringify(files)), key);
    fs.writeFileSync(VAULT_FILE, vaultData);

    categories.forEach((cat) => {
      const catDir = path.join(MOKUROKU_DIR, cat);
      if (fs.existsSync(catDir))
        fs.rmSync(catDir, { recursive: true, force: true });
    });
    console.log("\x1b[32m✅ Tresor aktualisiert (Struktur gewahrt).\x1b[0m");
  }
};

// 5. User-Interface & Korrekte Ablage
const createEntry = (type) => {
  const author = execSync("git config --local user.name").toString().trim();
  const email = execSync("git config --local user.email").toString().trim();

  // Zielverzeichnis ist nun wieder typspezifisch (retro oder notes)
  const targetDir = path.join(MOKUROKU_DIR, type);
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

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
    .replaceAll("{{AUTHOR}}", `${author} <${email}>`);

  fs.writeFileSync(fullPath, content);
  console.log(
    `\x1b[32m🚀 ${type.toUpperCase()} erstellt in ${type}/: ${fileName}\x1b[0m`,
  );
  execSync(`${process.env.EDITOR || "vi"} ${fullPath}`, { stdio: "inherit" });
};

// 6. Router
switch (command) {
  case "retro":
  case "notes":
    unlockNotes();
    createEntry(command);
    break;
  case "lock":
    lockNotes();
    break;
  case "unlock":
    unlockNotes();
    break;
  case "view":
    execSync("node shibuya/mokuroku-viewer.mjs", { stdio: "inherit" });
    break;
  default:
    console.log(
      "Nutze: pnpm mokuroku [retro|notes|lock|unlock|view] -t 'Titel'",
    );
}
