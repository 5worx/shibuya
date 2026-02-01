import { execSync } from "child_process";
import fs from "fs";

const log = (msg, type = "info") => {
  const colors = {
    info: "\x1b[36m",
    warn: "\x1b[33m",
    error: "\x1b[31m",
    success: "\x1b[32m",
  };
  console.log(`${colors[type] || ""}${msg}\x1b[0m`);
};

const checkCommand = (cmd, description) => {
  try {
    execSync(`command -v ${cmd} > /dev/null 2>&1`);
    log(`  ✅ ${description} (${cmd}) gefunden.`, "success");
    return true;
  } catch {
    log(`  ❌ ${description} (${cmd}) fehlt!`, "error");
    return false;
  }
};

log("\n🏙️  SHIBUYA - Environment Check\n" + "=".repeat(30));

// 1. Git Check
log("\n1. Prüfe Git-Identität...");
try {
  const name = execSync("git config --local --get user.name").toString().trim();
  const email = execSync("git config --local --get user.email")
    .toString()
    .trim();
  log(`  ✅ Lokal konfiguriert als: ${name} <${email}>`, "success");
} catch {
  log("  ⚠️  Keine LOKALE Git-Identität gefunden!", "warn");
  log(
    '     Bitte ausführen: git config --local user.name "Dein Name" && git config --local user.email "deine@mail.de"',
  );
}

// 2. Erforderliche Software
log("\n2. Prüfe erforderliche Software...");
const required = [
  { cmd: "docker", desc: "'docker' Docker" },
  {
    cmd: "nx",
    desc: "'nx' Monorepo Build Platform, install with 'pnpm add -g nx'",
  },
  { cmd: "git-bug", desc: "'git-bug' (Issue Tracking)" },
];

const optional = [
  { cmd: "glow", desc: "'glow' Glow (Markdown Viewer)" },
  { cmd: "tree", desc: "'tree' Directory and File-structure (Viewer)" },
  {
    cmd: "lazydocker",
    desc: "'lazydocker' LazyDocker - Docker GUI  (Terminal Viewer)",
  },
  { cmd: "lazygit", desc: "'lazygit' LazyGit - Git GUI (Terminal Viewer)" },
];

required.forEach((s) => checkCommand(s.cmd, s.desc));
log("\n3. Prüfe optionale Tools (empfohlen)...");
optional.forEach((s) => checkCommand(s.cmd, s.desc));

// 4. Projektstruktur / Mokuroku
log("\n4. Projektspezifische Checks...");
if (fs.existsSync("./mokuroku")) {
  log("  ✅ Mokuroku-Verzeichnis vorhanden.", "success");
} else {
  log("  ⚠️  Mokuroku fehlt. Erstelle es mit 'pnpm mokuroku'.", "warn");
}

// 5. Githooks
log("\n5. Git Hooks anmelden...");
if (fs.existsSync("./.githooks")) {
  try {
    // Prüfen, ob der Pfad bereits auf .githooks zeigt
    const currentPath = execSync("git config core.hooksPath").toString().trim();
    if (currentPath === ".githooks") {
      log(
        "  ✅ Git-Hooks sind bereits korrekt auf .githooks/ konfiguriert.",
        "success",
      );
    }
  } catch (e) {
    // Falls core.hooksPath noch gar nicht gesetzt ist, wirft Git einen Fehler
  }

  try {
    execSync("git config core.hooksPath .githooks");
    log(
      "  ✅ Git-Hooks Pfad wurde erfolgreich auf .githooks/ umgestellt.",
      "success",
    );
  } catch (e) {
    log("  ❌ Fehler beim Setzen des Hook-Pfades.", "error");
  }
} else {
  log("  ❌ Fehler beim Setzen des Hook-Pfades.", "error");
}

// Ergänzung für den Check-Skript:
log("\n6. Prüfe SSH-Agent...");
try {
  execSync("ssh-add -l");
  log("  ✅ SSH-Agent läuft und Identitäten sind geladen.", "success");
} catch (e) {
  log("  ⚠️  SSH-Agent läuft nicht oder keine Schlüssel geladen.", "warn");
  log(
    "      Tipp: Führe 'eval `ssh-agent` && ssh-add' aus, um Passworteingaben zu minimieren.",
  );
}

log("\n" + "=".repeat(30));
log("Check beendet. Viel Erfolg bei der Arbeit an SHIBUYA!\n");
