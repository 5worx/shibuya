import { execSync } from "child_process";
import fs from "fs";
import yaml from "js-yaml";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REQUIREMENTS_PATH = path.join(
  __dirname,
  "../requirements.workspaces.yaml",
);

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
    const firstLine = output.split("\n")[0];

    // Extrahiert die Versionsnummer (z.B. 1.93.0)
    const match = firstLine.match(/(\d+\.\d+(\.\d+)?)/);

    if (match) {
      const current = match[0];
      const currentParts = current.split(".").map(Number);
      const expectedParts = expected.split(".").map(Number);

      let isOlder = false;
      for (
        let i = 0;
        i < Math.max(currentParts.length, expectedParts.length);
        i++
      ) {
        const c = currentParts[i] || 0;
        const e = expectedParts[i] || 0;
        if (c < e) {
          isOlder = true;
          break;
        }
        if (c > e) {
          break;
        }
      }

      if (!isOlder) {
        log(
          `      ℹ️  Version: ${current} (Minimum ${expected}) bestätigt.`,
          "success",
        );
      } else {
        log(
          `      ⚠️  Version zu alt: Erwartet mindestens '${expected}', gefunden: '${current}'`,
          "warn",
        );
      }
    } else {
      // Fallback
      log(
        `      ⚠️  Konnte Version nicht eindeutig prüfen (Gefunden: '${firstLine.trim()}')`,
        "warn",
      );
    }
  } catch (e) {
    log(`      ❌ Versionsprüfung für ${cmd} fehlgeschlagen.`, "error");
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
  { cmd: "lazygit", desc: "LazyGit - Terminal GUI" },
  { cmd: "lazydocker", desc: "LazyDocker - Terminal GUI" },
  { cmd: "brew", desc: "Homebrew MacOS/Linux (Install-Tool)" },
  { cmd: "sdk", desc: "SDKMAN! (The SDK Manager)" },
];
optional.forEach((s) => checkCommand(s.cmd, s.desc));

// 4. Stacks
log("\n4. Projektspezifische Checks...");
if (fs.existsSync("./mokuroku")) {
  log("  ✅ Mokuroku-Verzeichnis vorhanden.", "success");
}

// 4.1 Prüfe projektspezifische Stacks (requirements.workspaces.yaml)...
log(
  "\n4.1 Prüfe anwendungsspezifische Stacks (requirements.workspaces.yaml)...",
);
if (fs.existsSync(REQUIREMENTS_PATH)) {
  try {
    const config = yaml.load(fs.readFileSync(REQUIREMENTS_PATH, "utf8"));

    // Beachte: In deiner YAML hieß der Key 'stacks', stell sicher, dass das
    // mit der Struktur (z.B. 'rust:') zusammenpasst.
    for (const [stackName, stack] of Object.entries(config.stacks || config)) {
      const role = stack.responsible ? ` [Weg des ${stack.responsible}]` : "";
      log(`\n--- Stack: ${stack.description} (${stackName})${role} ---`);

      stack.tools.forEach((tool) => {
        const exists = checkCommand(tool.cmd, tool.desc);

        if (!exists) {
          // NEU: Wenn das Tool fehlt und ein install-Hinweis existiert
          if (tool.install) {
            log(`      💡 Install-Hinweis: ${tool.install}`, "warn");
          }
        } else if (tool.v_args && tool.v_expect) {
          // Wenn es existiert, prüfen wir die Version
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
