import express from "express";
import path from "path";
import { readFile, readdir, stat } from "fs/promises";
import { join, relative, sep } from "path";
import { marked } from "marked";
import open from "open";

const app = express();
const ROOT_DIR = process.cwd();
const SUIDO_CONFIG_PATH = path.join(
  ROOT_DIR,
  "shibuya",
  "suido",
  "suido.config.yaml",
);
const MOKUROKU_DIR = join(process.cwd(), "mokuroku");

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

// Rekursive Funktion, um alle .md Dateien zu finden
async function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = await readdir(dirPath);

  for (const file of files) {
    const absolutePath = join(dirPath, file);
    if ((await stat(absolutePath)).isDirectory()) {
      arrayOfFiles = await getAllFiles(absolutePath, arrayOfFiles);
    } else if (file.endsWith(".md")) {
      arrayOfFiles.push(relative(MOKUROKU_DIR, absolutePath));
    }
  }
  return arrayOfFiles;
}

const layout = (content, fileList, activeFile) => `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <title>SHIBUYA - Mokuroku</title>
    <style>
        :root { --bg: #1a1b26; --sidebar: #24283b; --text: #a9b1d6; --cyan: #73daca; --blue: #7aa2f7; --folder: #e0af68; }
        body { background: var(--bg); color: var(--text); font-family: 'Segoe UI', sans-serif; margin: 0; display: flex; height: 100vh; }
        nav { width: 300px; background: var(--sidebar); border-right: 1px solid #414868; padding: 1.5rem; overflow-y: auto; }
        nav h2 { color: var(--cyan); font-size: 1.2rem; margin-bottom: 1.5rem; }
        .nav-item { margin: 0.3rem 0; font-size: 0.9rem; }
        .nav-link { color: var(--text); text-decoration: none; display: block; padding: 0.4rem 0.8rem; border-radius: 4px; transition: 0.2s; }
        .nav-link:hover { background: #2f3549; color: var(--blue); }
        .nav-link.active { background: var(--blue); color: var(--bg); font-weight: bold; }
        .folder-label { font-weight: bold; color: var(--folder); margin-top: 1rem; margin-bottom: 0.2rem; display: block; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; }
        main { flex: 1; padding: 2rem 4rem; overflow-y: auto; }
        .content { max-width: 900px; margin: auto; }
        h1, h2, h3 { color: var(--cyan); border-bottom: 1px solid #414868; padding-bottom: 0.3rem; }
        pre { background: #24283b; padding: 1rem; border-radius: 8px; border: 1px solid #414868; color: #e0af68; }
        code { font-family: 'Fira Code', monospace; }
    </style>
</head>
<body>
    <nav>
        <h2>🏙️ SHIBUYA</h2>
        ${renderNavigation(fileList, activeFile)}
    </nav>
    <main><div class="content">${content}</div></main>
</body>
</html>`;

function renderNavigation(files, activeFile) {
  let html = "<ul>";
  let lastFolder = "";

  files.forEach((file) => {
    const parts = file.split(sep);
    const fileName = parts.pop();
    const currentFolder = parts.join(" / ");

    if (currentFolder !== lastFolder) {
      html += `<span class="folder-label">${currentFolder || "ROOT"}</span>`;
      lastFolder = currentFolder;
    }

    html += `<li class="nav-item">
            <a href="/view/${encodeURIComponent(file)}" class="nav-link ${file === activeFile ? "active" : ""}">
                ${fileName.replace(".md", "")}
            </a>
        </li>`;
  });
  return html + "</ul>";
}

app.use("/mokuroku", express.static(path.join(ROOT_DIR, "mokuroku")));

app.get("/", async (req, res) => {
  const files = await getAllFiles(MOKUROKU_DIR);
  res.send(
    layout(
      `<h1>Willkommen im Mokuroku</h1><p>Wähle ein Dokument aus der Struktur links aus.</p>`,
      files,
    ),
  );
});

app.get("/view/:file", async (req, res) => {
  try {
    const decodedFile = decodeURIComponent(req.params.file);
    const files = await getAllFiles(MOKUROKU_DIR);
    const content = await readFile(join(MOKUROKU_DIR, decodedFile), "utf-8");
    const html = marked(content);
    res.send(layout(html, files, decodedFile));
  } catch (e) {
    res.status(404).send("Datei nicht gefunden.");
  }
});

app.listen(PORT, () => {
  console.log(
    `\x1b[36m🏙️ Mokuroku View aktiv auf http://localhost:${PORT}\x1b[0m`,
  );
  open(`http://localhost:${PORT}`);
});
