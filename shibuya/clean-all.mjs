import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const buildTargets = [
  "dist",
  "build",
  ".nx",
  ".angular",
  ".stencil",
  "*.tsbuildinfo",
];

const dependencyTargets = [
  "node_modules",
  ".pnpm-store",
  "vendor",
  "pnpm-lock.yaml",
  "package-lock.json",
  "yarn.lock",
  "composer.lock",
];

async function factoryReset(options = {}) {
  const {
    cleanInfra = false,
    cleanBuilds = false,
    cleanDependencies = false,
    cleanEverything = false,
  } = options;

  console.log("🌆 SHIBUYA: Initialisiere Bereinigung...");

  // Infrastruktur stoppen
  if (cleanInfra || cleanEverything) {
    try {
      console.log("📦 Stoppe Infrastruktur via melt...");
      execSync("pnpm nx run-many -t melt --all --outputStyle=static", {
        stdio: "inherit",
      });
    } catch (error) {
      console.log("⚠️ Infrastruktur konnte nicht gestoppt werden.");
    }
  }

  // Rekursive Bereinigung mit präzisen Regeln
  const cleanPaths = (base) => {
    const findTargets = (dir, targets) => {
      let results = [];

      try {
        const entries = fs.readdirSync(dir, {
          withFileTypes: true,
          recursive: true,
        });

        entries.forEach((entry) => {
          const fullPath = path.join(
            entry.parentPath || entry.path || dir,
            entry.name,
          );

          // Spezielle Behandlung für Builds: Nicht in node_modules suchen
          if (cleanBuilds && fullPath.includes("node_modules")) {
            return;
          }

          // Bei Dependencies alle node_modules, vendor und Lock-Dateien rekursiv
          const matchCondition =
            cleanDependencies || cleanEverything
              ? targets.some(
                  (target) =>
                    entry.name === target ||
                    (target.includes("*") &&
                      new RegExp(target.replace("*", ".*")).test(entry.name)),
                )
              : cleanBuilds &&
                targets.some(
                  (target) =>
                    entry.name === target ||
                    (target.includes("*") &&
                      new RegExp(target.replace("*", ".*")).test(entry.name)),
                );

          if (matchCondition) {
            results.push(fullPath);
          }
        });
      } catch (err) {
        if (err.code !== "EACCES") {
          console.error("Fehler beim Scannen:", err);
        }
      }

      return results;
    };

    let targetsToRemove = findTargets(
      base,
      cleanBuilds
        ? buildTargets
        : cleanDependencies
          ? dependencyTargets
          : [...buildTargets, ...dependencyTargets],
    );

    // Sortieren nach Pfadlänge für verschachtelte Löschung
    targetsToRemove
      .sort((a, b) => b.length - a.length)
      .forEach((target) => {
        try {
          if (fs.existsSync(target)) {
            fs.rmSync(target, { recursive: true, force: true });
            console.log(`  - gelöscht: ${target}`);
          }
        } catch (err) {
          console.error(`Fehler beim Löschen von ${target}:`, err.message);
        }
      });
  };

  cleanPaths(process.cwd());

  console.log("\n✨ Bereinigung abgeschlossen.");
  console.log("🚀 System bereit für Neu-Installation.");
}

// Argument-basierte Ausführung
const args = process.argv.slice(2);
const options = {
  cleanInfra: args.includes("--infrastructure"),
  cleanBuilds: args.includes("--builds"),
  cleanDependencies: args.includes("--dependencies"),
  cleanEverything: args.includes("--all"),
};

factoryReset(options);
