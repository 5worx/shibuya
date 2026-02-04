import { execSync } from "child_process";
import fs from "fs";
import yaml from "js-yaml";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REQUIREMENTS_PATH = path.join(__dirname, "../requirements.yaml");

const log = (msg, type = "info") => {
  const colors = {
    info: "\x1b[36m", // Cyan
    warn: "\x1b[33m", // Gelb
    error: "\x1b[31m", // Rot
    success: "\x1b[32m", // Grün
  };
  console.log(`${colors[type] || ""}${msg}\x1b[0m`);
};

// Erkennt normale Binaries und Shell-Funktionen (wichtig für 'sdk')
const checkCommand = (cmd, description) => {
  try {
    execSync(`command -v ${cmd} > /dev/null 2>&1`);
    log(`  ✅ ${description} (${cmd}) gefunden.`, "success");
    return true;
  } catch {
    // Sonderfall für Shell-Funktionen wie sdk
    if (cmd === "sdk" && fs.existsSync(`${process.env.HOME}/.sdkman`)) {
      log(`  ✅ ${description} (${cmd}) via Verzeichnis gefunden.`, "success");
      return true;
    }
    log(`  ❌ ${description} (${cmd}) fehlt!`, "error");
    return false;
  }
};

const validateVersion = (cmd, args, expected) => {
  try {
    const output = execSync(`${cmd} ${args} 2>&1`).toString();
    // Wir nehmen nur die erste Zeile der Ausgabe für den Check
    const firstLine = output.split("\n")[0];

    if (firstLine.includes(expected)) {
      log(`     ℹ️  Version: ${expected} bestätigt.`, "success");
    } else {
      const current = firstLine.trim();
      log(
        `     ⚠️  Versions-Konflikt: Erwartet '${expected}', gefunden: '${current}'`,
        "warn",
      );
    }
  } catch (e) {
    log(`     ❌ Versionsprüfung für ${cmd} fehlgeschlagen.`, "error");
  }
};

log("\n🏙️  SHIBUYA - Environment Check\n" + "=".repeat(30));

// 1. Git Identity
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
    '      Tipp: git config --local user.name "Dein Name" && git config --local user.email "mail@example.com"',
  );
}

// 1.1 git-crypt
log("\n1.1 Prüfe Verschlüsselung (git-crypt)...");
if (checkCommand("git-crypt", "git-crypt")) {
  try {
    const status = execSync(
      "git-crypt status mokuroku/notes 2>/dev/null",
    ).toString();
    if (status.includes("encrypted")) {
      log("  ✅ git-crypt ist aktiv.", "success");
    }
  } catch (e) {
    log("  ⚠️ git-crypt installiert, aber Repo evtl. locked.", "warn");
  }
}

// 1.2 Git Hooks
log("\n1.2 Git Hooks anmelden...");
if (fs.existsSync("./.githooks")) {
  try {
    execSync("git config core.hooksPath .githooks");
    log("  ✅ Git-Hooks sind auf .githooks/ konfiguriert.", "success");
  } catch (e) {
    log("  ❌ Fehler beim Setzen des Hook-Pfades.", "error");
  }
}

// 1.3 git-bug
log("\n1.3 Prüfe 'git-bug' (Issue Tracking)...");
if (checkCommand("git-bug", "git-bug")) {
  try {
    const bugVersion = execSync("git-bug version").toString().trim();
    log(`  ✅ git-bug ist bereit (${bugVersion}).`, "success");
  } catch (e) {
    log("  ⚠️ git-bug reagiert nicht wie erwartet.", "warn");
  }
}

// 2. SSH Agent
log("\n2. Prüfe SSH-Agent...");
try {
  execSync("ssh-add -l");
  log("  ✅ SSH-Agent läuft und Identitäten sind geladen.", "success");
} catch (e) {
  log("  ⚠️  SSH-Agent läuft nicht oder keine Schlüssel geladen.", "warn");
}

// 3. Software Global
log("\n3. Prüfe erforderliche Basis-Software...");
const required = [
  { cmd: "docker", desc: "Docker" },
  { cmd: "nx", desc: "NX Monorepo Build Platform" },
  { cmd: "pnpm", desc: "PNPM Package Manager" },
];
required.forEach((s) => checkCommand(s.cmd, s.desc));

log("\n3.1 Prüfe optionale Tools (empfohlen)...");
const optional = [
  { cmd: "glow", desc: "Glow (Markdown Viewer)" },
  { cmd: "tree", desc: "Tree (Struktur Viewer)" },
  { cmd: "lazygit", desc: "LazyGit" },
  { cmd: "brew", desc: "Homebrew" },
];
optional.forEach((s) => checkCommand(s.cmd, s.desc));

// 4. Stacks
log("\n4. Projektspezifische Checks...");
if (fs.existsSync("./mokuroku")) {
  log("  ✅ Mokuroku-Verzeichnis vorhanden.", "success");
}

log("\n4.1 Prüfe projektspezifische Stacks (requirements.yaml)...");
if (fs.existsSync(REQUIREMENTS_PATH)) {
  try {
    const config = yaml.load(fs.readFileSync(REQUIREMENTS_PATH, "utf8"));

    for (const [stackName, stack] of Object.entries(config.stacks)) {
      const role = stack.responsible ? ` [Weg des ${stack.responsible}]` : "";
      log(`\n--- Stack: ${stack.description} (${stackName})${role} ---`);

      stack.tools.forEach((tool) => {
        const exists = checkCommand(tool.cmd, tool.desc);

        // Wenn in der YAML v_args und v_expect definiert sind, prüfen wir!
        if (exists && tool.v_args && tool.v_expect) {
          validateVersion(tool.cmd, tool.v_args, tool.v_expect);
        }
      });
    }
  } catch (e) {
    log(`  ❌ Fehler: ${e.message}`, "error");
  }
}

log("\n" + "=".repeat(30));
log("Check beendet. Viel Erfolg bei der Arbeit an SHIBUYA!\n");
