import fs from "fs";
import { spawn, spawnSync } from "child_process";
import path from "path";
import yaml from "js-yaml";

const args = process.argv.slice(2);
const mode = args[0] || "dev"; // 'start', 'dev', 'stop', 'forge', 'melt'
const appsFlag =
  args
    .find((a) => a.startsWith("--apps="))
    ?.split("=")[1]
    ?.split(",") || [];

if (appsFlag.length === 0) {
  console.error("❌ Bitte gib mindestens eine App an: --apps=angular-app");
  process.exit(1);
}

let settings = {
  parallel: 20,
  outputStyle: "stream",
};

let allProjects = new Set();
let infraToCleanup = new Set();

appsFlag.forEach((app) => allProjects.add(app));

// 1. Konfiguration verarbeiten
appsFlag.forEach((appName) => {
  const configPath = path.join(process.cwd(), "apps", appName, "shibuya.yaml");

  if (fs.existsSync(configPath)) {
    const config = yaml.load(fs.readFileSync(configPath, "utf8"));

    if (config.settings) {
      if (config.settings.parallel)
        settings.parallel = config.settings.parallel;
      if (config.settings.outputStyle)
        settings.outputStyle = config.settings.outputStyle;
    }

    const addWithCheck = (projectList, type) => {
      if (!projectList) return;
      projectList.forEach((dep) => {
        if (dep !== appName) {
          allProjects.add(dep);
          // Alles was aus der infrastructure Gruppe kommt, landet im Cleanup
          if (type === "infrastructure") infraToCleanup.add(dep);
        }
      });
    };

    // NEUE LOGIK: Auflösen der Workflows
    const workflow = config.workflows?.[mode];

    if (workflow) {
      workflow.forEach((item) => {
        if (typeof item === "string" && item.startsWith("components.")) {
          const group = item.split(".")[1];
          const resolvedList = config.components?.[group];
          addWithCheck(resolvedList, group);
        } else {
          allProjects.add(item);
        }
      });
    }

    // AUTOMATIK: Im 'dev' Mode wollen wir immer die Infrastruktur dabei haben
    if (mode === "dev" && config.components?.infrastructure) {
      addWithCheck(config.components.infrastructure, "infrastructure");
    }
  } else {
    console.warn(`⚠️ Keine shibuya.yaml gefunden unter ${configPath}`);
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

// 2. NX starten
const child = spawn(
  "pnpm",
  [
    "nx",
    "run-many",
    "-t",
    mode,
    "-p",
    projectsArray.join(","),
    `--parallel=${settings.parallel}`,
    `--outputStyle=${settings.outputStyle}`,
  ],
  { stdio: "inherit", shell: true },
);

// 3. Cleanup Logik
let isCleaningUp = false;
const cleanup = (signal) => {
  if (isCleaningUp) return;
  isCleaningUp = true;

  if (mode === "dev") {
    console.log(
      `\n🌆 SHIBUYA schaltet in den Standby. Watcher beendet, Infra aktiv.`,
    );
    console.log(`💡 Tipp: Nutze "pnpm stop" zum Herunterfahren der Container.`);
  } else if (infraToCleanup.size > 0) {
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

child.on("close", (code) => {
  console.log(`\n📡 NX-Prozess beendet (Code ${code})`);
  if (code !== 0 && !isCleaningUp) cleanup("PROCESS_ERROR");
});
