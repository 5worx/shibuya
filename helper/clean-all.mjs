import { execSync } from "child_process";
import fs from "fs";
import path from "path";

// Wir definieren die Muster, die wir rekursiv löschen wollen (wie dein 'find')
const patternsToClean = [
  "**/node_modules",
  "**/dist",
  "**/.nx",
  "**/.angular",
  "**/.stencil",
  "**/build",
  "**/*.tsbuildinfo",
  "pnpm-lock.yaml",
  ".pnpm-store",
];

async function factoryReset() {
  console.log("🌆 SHIBUYA: Initialisiere vollständigen Factory Reset...");

  // 1. Infrastruktur & Docker
  try {
    console.log("📦 Stoppe Infrastruktur und bereinige Container-Daten...");
    // Wir nutzen deinen nx command
    execSync("pnpm nx run-many -t melt --all --outputStyle=static", {
      stdio: "inherit",
    });
  } catch (error) {
    console.log(
      "⚠️ Hinweis: Infrastruktur konnte nicht gestoppt werden (vielleicht schon offline).",
    );
  }

  // 2. Rekursives Löschen
  console.log(
    "🗑️ Lösche alle Artefakte (node_modules, dist, build-infos, caches)...",
  );

  // Da wir keine externen Abhängigkeiten wie 'rimraf' erzwingen wollen,
  // nutzen wir eine kleine rekursive Helferfunktion
  const deleteRecursive = (dir) => {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      files.forEach((file) => {
        const curPath = path.join(dir, file);
        if (fs.lstatSync(curPath).isDirectory()) {
          deleteRecursive(curPath);
        } else {
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(dir);
    }
  };

  // Wir nutzen eine einfachere Variante von fs.rmSync (verfügbar seit Node 14.14+)
  // Diese ist das Äquivalent zu 'rm -rf'
  const cleanPaths = (base, patterns) => {
    // Da wir keine schwere Glob-Lib einbinden wollen, gehen wir die Verzeichnisse durch
    // oder nutzen Shell-Commands für die Performance, falls verfügbar.
    // Aber für die echte Plattformunabhängigkeit nutzen wir die native Node-API:

    const allEntries = fs.readdirSync(base, {
      withFileTypes: true,
      recursive: true,
    });

    // Wir filtern die Einträge basierend auf deinen Namen
    const targets = allEntries
      .filter((entry) => {
        const name = entry.name;
        return (
          name === "node_modules" ||
          name === "dist" ||
          name === ".nx" ||
          name === ".angular" ||
          name === ".stencil" ||
          name === "build" ||
          name.endsWith(".tsbuildinfo")
        );
      })
      .map((entry) => path.join(entry.parentPath || entry.path, entry.name));

    // Einzelne Files wie lock-files hinzufügen
    if (fs.existsSync("pnpm-lock.yaml")) targets.push("pnpm-lock.yaml");
    if (fs.existsSync(".pnpm-store")) targets.push(".pnpm-store");

    // Sortieren, damit wir tiefste Pfade zuerst löschen
    targets.sort((a, b) => b.length - a.length);

    targets.forEach((target) => {
      try {
        if (fs.existsSync(target)) {
          fs.rmSync(target, { recursive: true, force: true });
          console.log(`  - gelöscht: ${target}`);
        }
      } catch (err) {
        console.error(`  ❌ Fehler bei ${target}:`, err.message);
      }
    });
  };

  cleanPaths(process.cwd());

  console.log("\n✨ Der Distrikt ist im Auslieferungszustand.");
  console.log("🚀 SHIBUYA: System bereit für Neu-Installation (pnpm install).");
}

factoryReset();
