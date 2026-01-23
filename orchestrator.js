import fs from "fs";
import { spawn, spawnSync } from "child_process";
import path from "path";
import yaml from "js-yaml";

const args = process.argv.slice(2);
const mode = args[0] || "dev"; // 'start' oder 'dev'
const appsFlag =
  args
    .find((a) => a.startsWith("--apps="))
    ?.split("=")[1]
    ?.split(",") || [];

if (appsFlag.length === 0) {
  console.error("❌ Bitte gib mindestens eine App an: --apps=angular-app");
  process.exit(1);
}

// ... (oben beim Initialisieren)
let settings = {
  parallel: 20, // Default
  outputStyle: "stream", // Default
};

let allProjects = new Set();
let infraToCleanup = new Set();

// WICHTIG: Die Apps aus dem Flag direkt als "Haupt-Projekte" hinzufügen
appsFlag.forEach((app) => allProjects.add(app));

// 1. Dezentrale YAMLs einsammeln (Nur den angeforderten Mode!)
appsFlag.forEach((appName) => {
  const configPath = path.join(
    process.cwd(),
    "apps",
    appName,
    "orchestrator.yaml",
  );

  if (fs.existsSync(configPath)) {
    const config = yaml.load(fs.readFileSync(configPath, "utf8"));

    // Settings aus der YAML lesen, falls vorhanden
    if (config.settings) {
      if (config.settings.parallel)
        settings.parallel = config.settings.parallel;
      if (config.settings.outputStyle)
        settings.outputStyle = config.settings.outputStyle;
    }

    // Hilfsfunktion zum Hinzufügen mit Zirkel-Check
    const addWithCheck = (projectList, type) => {
      if (!projectList) return;
      projectList.forEach((dep) => {
        if (dep === appName) {
          console.warn(
            `⚠️  Hinweis: "${appName}" listet sich in seiner orchestrator.yaml selbst unter "${type}" auf. Das ist redundant und wurde ignoriert.`,
          );
        } else {
          allProjects.add(dep);
          if (type === "infrastructure") infraToCleanup.add(dep);
        }
      });
    };

    const section = config[mode]; // Hier wird nur 'start' ODER 'dev' geladen

    if (section) {
      addWithCheck(section.apps, "apps");
      addWithCheck(section.packages, "packages");
      addWithCheck(section.infrastructure, "infrastructure");
    }

    // Auch den 'start' Block für Infra prüfen, wenn im dev-Mode
    if (mode === "dev" && config.start?.infrastructure) {
      addWithCheck(config.start.infrastructure, "infrastructure");
    }
  } else {
    console.warn(`⚠️ Keine orchestrator.yaml gefunden unter ${configPath}`);
    allProjects.add(appName);
  }
});

const projectsArray = Array.from(allProjects);
if (projectsArray.length === 0) {
  console.error(`❌ Keine Projekte im Modus [${mode}] gefunden.`);
  process.exit(1);
}

console.log(`\x1b[36m%s\x1b[0m`, `🏙️  SHIBUYA Dispatcher [${mode}]`);
console.log(`📦 Verbinde Signale für: ${projectsArray.join(", ")}`);

// 2. NX starten mit dem Target, das dem Modus entspricht
// Wenn mode='start', dann wird 'nx run-many -t start' ausgeführt.
const child = spawn(
  "pnpm",
  [
    "nx",
    "run-many",
    "-t",
    mode,
    "-p",
    projectsArray.join(","),
    `--parallel=${settings.parallel}`, // Dynamisch aus YAML
    `--outputStyle=${settings.outputStyle}`, // Dynamisch aus YAML
  ],
  { stdio: "inherit", shell: true },
);

// 3. Cleanup Logik
// 3. Cleanup Logik
let isCleaningUp = false;
const cleanup = (signal) => {
  if (isCleaningUp) return;
  isCleaningUp = true;

  // LOGIK-ÄNDERUNG:
  // Wir fahren die Container NICHT automatisch runter, wenn wir im dev-Modus sind.
  // Das erlaubt schnelles Re-Starten des Watchers, ohne auf Docker zu warten.

  if (mode === "dev") {
    console.log(
      `\n🌆 SHIBUYA schaltet in den Standby. Watcher beendet, Infra aktiv.`,
    );

    console.log(
      `💡 Tipp: Nutze "pnpm start", um sie zu prüfen oder Docker Desktop zum Stoppen.`,
    );
  } else if (infraToCleanup.size > 0) {
    // Nur in anderen Modi (z.B. Test-Pipelines) fahren wir wirklich alles runter
    console.log(`\n🧹 SHIBUYA (Signal: ${signal}): Räume den Distrikt auf...`);
    infraToCleanup.forEach((infra) => {
      spawnSync("pnpm", ["nx", "run", `${infra}:down`], {
        stdio: "inherit",
        shell: true,
      });
    });
  }

  process.exit(0);
};

process.on("SIGINT", () => cleanup("SIGINT"));
process.on("SIGTERM", () => cleanup("SIGTERM"));

// Falls NX fertig ist (z.B. weil docker-compose up -d ein Kurzläufer ist)
child.on("close", (code) => {
  console.log(`\n📡 NX-Prozess beendet (Code ${code})`);
  // Wenn wir nur 'start' aufrufen, ist NX nach dem Docker-Start fertig.
  // Wir räumen NUR auf, wenn ein Fehler vorlag (code != 0) oder wir explizit abbrechen.
  if (code !== 0 && !isCleaningUp) cleanup("PROCESS_ERROR");
});
