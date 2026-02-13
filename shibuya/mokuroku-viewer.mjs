import express from "express";
import path from "path";
import { readFile, readdir, stat } from "fs/promises";
import { join, relative, sep } from "path";
import { marked } from "marked";
import open from "open";
import { BacklogController } from "./mokuroku-backlog-controller.mjs";

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

  /** Backlog Button */
  html += `<li class="nav-item">
        <a href="/backlog" class="nav-link ${activeFile === "backlog" ? "active" : ""}" style="color: var(--cyan)">🚀 BACKLOG</a>
      </li>`;

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

app.use(express.json());
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

// Die Backlog-Route
app.get("/backlog", async (req, res) => {
  const bugs = BacklogController.getBugs();
  const files = await getAllFiles(MOKUROKU_DIR);

  const sprintNames = ["Backlog", "Sprint 1", "Sprint 2", "Sprint 3"];

  const backlogHtml = `
    <h1 style="display: flex; justify-content: space-between;">
        <span>🚀 Agile Backlog</span>
        <small style="font-size: 0.5em; color: var(--folder)">SUIDO Port: ${PORT}</small>
    </h1>

    <div style="display: flex; gap: 1.5rem; align-items: flex-start;">
        ${sprintNames
          .map(
            (name, index) => `
            <div class="sprint-column"
                 ondrop="drop(event, ${index})"
                 ondragover="allowDrop(event)"
                 style="background: var(--sidebar); border: 1px solid #414868; border-radius: 8px; flex: 1; min-height: 600px; display: flex; flex-direction: column;">

                <h3 style="padding: 10px; margin: 0; background: #2f3549; border-radius: 8px 8px 0 0; font-size: 0.9rem; text-align: center;">
                    ${name}
                </h3>

                <div class="cards-container" style="padding: 10px; flex: 1;">
                    ${bugs
                      .filter((b) => b.sprint === index)
                      .map(
                        (b) => `
                        <div id="${b.id}"
                             draggable="true"
                             ondragstart="drag(event)"
                             style="background: var(--bg); border: 1px solid #414868; padding: 12px; margin-bottom: 10px; border-radius: 4px; cursor: grab; font-size: 0.85rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                            <div style="color: var(--cyan); font-family: monospace; font-weight: bold; margin-bottom: 5px;">#${b.id}</div>
                            <div style="color: var(--text)">${b.title}</div>
                        </div>
                    `,
                      )
                      .join("")}
                </div>
            </div>
        `,
          )
          .join("")}
    </div>

    <script>
        function allowDrop(ev) { ev.preventDefault(); }
        function drag(ev) { ev.dataTransfer.setData("text", ev.target.id); }

        async function drop(ev, sprintNum) {
            ev.preventDefault();
            const id = ev.dataTransfer.getData("text");

            // UI Feedback
            const card = document.getElementById(id);
            card.style.opacity = "0.5";
            card.style.border = "1px solid var(--folder)";

            const response = await fetch('/api/backlog/move', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ id, sprint: sprintNum })
            });

            if (response.ok) {
                // Seite neu laden um git-bug Zustand zu spiegeln
                window.location.reload();
            } else {
                alert("Fehler: Eventuell ist die git-bug WebUI offen? (Lock)");
                card.style.opacity = "1";
            }
        }
    </script>
  `;

  res.send(layout(backlogHtml, files, "backlog"));
});

// API Endpunkt zum Verschieben
app.post("/api/backlog/move", (req, res) => {
  const { id, sprint } = req.body;
  BacklogController.setSprint(id, sprint);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(
    `\x1b[36m🏙️ Mokuroku View aktiv auf http://localhost:${PORT}\x1b[0m`,
  );
  open(`http://localhost:${PORT}`);
});
