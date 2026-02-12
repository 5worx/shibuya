import express from "express";
import path from "path";
import fs from "fs";
import yaml from "js-yaml";

const app = express();
const ROOT_DIR = process.cwd();
const SUIDO_CONFIG_PATH = path.join(
  ROOT_DIR,
  "shibuya",
  "suido",
  "suido.config.yaml",
);

// --- Die SUIDO-Magie ---
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

const PORT = getMokurokuPort();

// --- Express Setup ---
app.use("/mokuroku", express.static(path.join(ROOT_DIR, "mokuroku")));

app.get("/", (req, res) => {
  res.send(`
        <body style="background:#111; color:#0f0; font-family: 'Courier New', monospace; padding:2rem;">
            <h1>🏙️ SHIBUYA SYSTEM SERVER</h1>
            <hr style="border:1px solid #0f0">
            <p>MODE: AGNOSTIC DEVELOPMENT</p>
            <p>PORT: ${PORT} (SUIDO DETERMINED)</p>
            <p>STATUS: RUNNING</p>
            <ul style="list-style: '[ ] '">
                <li><a href="/mokuroku" style="color:#0f0">Open Mokuroku Explorer</a></li>
            </ul>
        </body>
    `);
});

app.listen(PORT, () => {
  console.log(`\n\x1b[32m  🏙️  SHIBUYA-SERVER\x1b[0m`);
  console.log(`  \x1b[34mPort:\x1b[0m    ${PORT}`);
  console.log(`  \x1b[34mStatus:\x1b[0m  Ready to serve, Sven.\n`);
});
