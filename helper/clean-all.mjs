import { execSync } from "child_process";
import fs from "fs";
import path from "path";

// Die Liste der Verdächtigen
const targetsToMatch = [
  "node_modules",
  "dist",
  "target", // Rust Artefakte
  ".nx",
  ".angular",
  ".stencil",
  "build",
  ".pnpm-store",
];

async function factoryReset() {
  console.log("🌆 SHIBUYA: Initialisiere vollständigen Factory Reset...");

  // 1. Infrastruktur & Docker
  try {
    console.log(
      "📦 Stoppe Infrastruktur und bereinige Container-Daten via melt...",
    );
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
    "🗑️ Lösche alle Artefakte (node_modules, dist, target, build-infos, caches)...",
  );

  const cleanPaths = (base) => {
    let allEntries = [];
    try {
      // Wir lesen rekursiv ein, fangen aber EACCES ab (für gesperrte Docker-Ordner)
      allEntries = fs.readdirSync(base, {
        withFileTypes: true,
        recursive: true,
      });
    } catch (err) {
      if (err.code === "EACCES") {
        console.warn(`  ⚠️  Kein Zugriff auf: ${base} (wird übersprungen)`);
        return;
      }
      throw err;
    }

    // Wir filtern die Einträge basierend auf Namen oder Endung
    const targets = allEntries
      .filter((entry) => {
        const name = entry.name;
        return targetsToMatch.includes(name) || name.endsWith(".tsbuildinfo");
      })
      .map((entry) =>
        path.join(entry.parentPath || entry.path || base, entry.name),
      );

    // Einzelne Files wie lock-files manuell hinzufügen, falls sie im Root liegen
    if (fs.existsSync("pnpm-lock.yaml")) targets.push("pnpm-lock.yaml");

    // Sortieren nach Länge (umgekehrte Tiefe), damit wir Unterordner vor Eltern löschen
    targets.sort((a, b) => b.length - a.length);

    // Echte Duplikate entfernen (falls durch rekursives Einlesen doppelt erfasst)
    const uniqueTargets = [...new Set(targets)];

    uniqueTargets.forEach((target) => {
      try {
        if (fs.existsSync(target)) {
          fs.rmSync(target, { recursive: true, force: true });
          console.log(`  - gelöscht: ${target}`);
        }
      } catch (err) {
        // Falls wir hier doch ein EACCES bekommen (z.B. Keycloak/data), loggen wir es nur
        if (err.code === "EACCES") {
          console.error(
            `  ⚠️  Berechtigungsfehler bei ${target} (Docker-Leiche?)`,
          );
        } else {
          console.error(`  ❌ Fehler bei ${target}:`, err.message);
        }
      }
    });
  };

  cleanPaths(process.cwd());

  console.log("\n✨ Der Distrikt ist im Auslieferungszustand.");
  console.log("🚀 SHIBUYA: System bereit für Neu-Installation (pnpm install).");
}

factoryReset();
