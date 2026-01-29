# 🛠 Voraussetzungen

Bevor du den Distrikt betrittst, stelle sicher, dass folgende Werkzeuge auf deinem Host-System installiert sind:

* **Node.js**: Version 24.x oder höher (LTS empfohlen)
* **pnpm**: Version 10.28.x oder höher (`npm install -g pnpm`)
* **Git**: Version 2.43 oder höher
* **git-bug**: Version 0.10.x oder höher
* **Docker & Docker Compose**: Zum Hosten der Infrastruktur (Keycloak, DBs)
* **NX CLI**: Global empfohlen via `pnpm add -g nx` (alternativ via `npx nx`)

Nach dem Clone: `pnpm install`:

Nachdem die erforderliche Software und die Abhängigkeiten installiert sind, müssen noch evtl kleinere Einstellungen vorgenommen werden, damit nicht nur die Anwendungsentwicklung, sondern auch das Drumherum reibungslos läuft.

Check der Umgebung `pnpm helper:check`:

```sh
🏙️  SHIBUYA - Environment Check
==============================

1. Prüfe Git-Identität...
  ✅ Lokal konfiguriert als: Dein Name <dein.name@mailprovider.de>

2. Prüfe erforderliche Software...
  ✅ 'docker' Docker (docker) gefunden.
  ✅ 'nx' Monorepo Build Platform, install with 'pnpm add -g nx' (nx) gefunden.
  ✅ 'git-bug' (Issue Tracking) (git-bug) gefunden.

3. Prüfe optionale Tools (empfohlen)...
  ✅ 'glow' Glow (Markdown Viewer) (glow) gefunden.
  ✅ 'tree' Directory and File-structure (Viewer) (tree) gefunden.
  ✅ 'lazydocker' LazyDocker - Docker GUI  (Terminal Viewer) (lazydocker) gefunden.
  ✅ 'lazygit' LazyGit - Git GUI (Terminal Viewer) (lazygit) gefunden.

4. Projektspezifische Checks...
  ✅ Mokuroku-Verzeichnis vorhanden.

5. Git Hooks anmelden...
  ✅ Git-Hooks sind bereits korrekt auf .githooks/ konfiguriert.
  ✅ Git-Hooks Pfad wurde erfolgreich auf .githooks/ umgestellt.

6. Prüfe SSH-Agent...
  ✅ SSH-Agent läuft und Identitäten sind geladen.

==============================
Check beendet. Viel Erfolg bei der Arbeit an SHIBUYA!
```

## Empfohlene optionale, aber empfohlene Tools und Umgebungen

Es ist nicht bekannt, was für Anwendungen produziert werden. Es können auch noch zusätzliche Installationen für Go, Rust, Java, .NET, PHP usw erforderlich werden. Das hängt von den Anwendungen und Paketen im Repo ab. 

> Allen Windowsnutzern wird empfohlen über WSL im Ubuntu-Subsystem zu arbeiten. Auch wenn das Terminal vielleicht anfangs etwas gewöhnungsbedürftig ist, so ist das Arbeiten nach etwas Übung wesentlich angenehmer und vor Allem schneller.

Hier ein paar hilfreiche Tools, die ein vereinfachtes strukturiertes Arbeiten ermöglicht.

* **glow**: Terminal Anwendung zum Anzeigen und Parsen von .md-Dateien
* **tree**: Terminal Anwendung zum Anzeigen von Verzeichnis- und Dateistrukturen
* **LazyDocker**: Terminal GUI zum Anzeigen und Verwalten von Docker-Containern
* **LazyGit**: Terminal GUI für Git
* **Vim, NeoVim**: Terminal IDEs. Wenn wir in dem Projekt(en) mit `git-bug` arbeiten wollen, kann es nicht schaden, in der `.bashrc` den Editor als Standard zu definieren.

```bash
# ./.bashrc
# ...

# Setze NVim als Standard-Editor für alle Shell-Programme (inkl. Git)
export EDITOR="nvim"

# ...
```

### 🛠 Workflow-Booster: SSH-Agent Automatisierung (optional)

Damit du dein Passwort für git-bug (und Git allgemein) nur einmal pro Session eingeben musst, füge folgendes deiner `.bashrc` oder `.zshrc` hinzu:

```bash
# SSH-Agent automatisch starten oder bestehenden nutzen
SSH_KEY="$HOME/.ssh/id_ed25519"
SSH_AGENT_FILE="$HOME/.ssh/agent-environment"

# 1. Versuchen, bestehende Agent-Daten zu laden
if [ -f "$SSH_AGENT_FILE" ]; then
  . "$SSH_AGENT_FILE" >/dev/null
fi

# 2. Wenn kein Agent läuft (oder die PID nicht mehr existiert), neu starten
if [ -z "$SSH_AUTH_SOCK" ] || ! ps -p "$SSH_AGENT_PID" >/dev/null 2>&1; then
  eval "$(ssh-agent -s)" >/dev/null
  # Speichere die neuen Daten für andere Terminals
  echo "export SSH_AUTH_SOCK=$SSH_AUTH_SOCK" >"$SSH_AGENT_FILE"
  echo "export SSH_AGENT_PID=$SSH_AGENT_PID" >>"$SSH_AGENT_FILE"
  chmod 600 "$SSH_AGENT_FILE"

  if [ -f "$SSH_KEY" ]; then
    echo "SSH-Agent neu gestartet und Schlüssel geladen."
    ssh-add "$SSH_KEY"
  fi
else
  # Agent läuft bereits und wurde durch die Datei oben verbunden
  # Wir prüfen nur, ob der Schlüssel auch wirklich im Speicher ist
  if ! ssh-add -l | grep -q "$(ssh-keygen -lf "$SSH_KEY" | awk '{print $2}')"; then
    ssh-add "$SSH_KEY"
  fi
fi
```

Das ist wichtig für:

* **Reibungsloser Sync**: Die `pre-push` und `post-merge` Hooks laufen im Hintergrund ohne Unterbrechung durch.
* **Identität**: `git-bug` kann deine Einträge sofort signieren, ohne dass ein Editor-Popup oder eine Passwort-Prompts den Flow stört.

## Die Infrastruktur bauen

> Hier in diesem Showcase sind eine Angular-App mit einer Rust-Api, die sich beide eine Keycloak-Instanz teilen, grob angerissen. Nicht jedes Projekt braucht eine Infrastruktur. Aber nach hinreichender Wahrscheinlichkeit wird eine da sein.

**Hinweis**: Eindeutige Namen für Befehle und Commands sind eine nicht zu vernachlässigende Notwendigkeit in komplexen Systemen. Da fast alle Javacript-basierten Frameworks immer Befehle für _dev_, _start_ und/oder _build_ mitbringen, wäre es unklug zum Bauen der Entwicklungscontainer ebenfalls _build_ zu verwenden. Daher heissen sie hier: __forge__. ___build__ bleibt den Deployments vorbehalten!_

Wir __schmieden__ unsere Docker-Container mit `pnpm forge`

> Auf Windows mit WSL ist es bei mir ab und zu sporadisch dazu gekommen, dass einer oder mehrere Container nicht gestartet wurden und das Skript abbrach oder die Container nicht gestartet werden konnten. Es lag hier immer eine _Port-Violation_ vor und Docker behauptete Ports wären schon belegt. Das ist Quatsch. In Windows verbleiben manchmal Sockets im Zustand `TIME_WAIT`. Und dann knallt es mit einem 500er

### Troubleshooting bei Port-Problemen auf Windows

Sollten die Container beim __forge__ mit 500ern aussteigen und behaupten, die im Projekt definierten Ports wären schon belegt, dann liegt der Fehler in der Socketverwaltung von Windows. Glücklicherweise lässt sich das sehr einfach beheben.

Starte eine __PowerShell als Administrator__.

Gibt dann folgende Befehle ein:

```powershell
net stop winnat
net start winnat
```

Das sollte genügen. Ein Neustart des Rechner reicht eventuell auch aus. Aber der Neustart von winnat hat den Fehler immer behoben.

## Webadressen über Ports:urls

Sind die Container gebaut, stellen sie verschiedenste Webadressen zur Verfügung. Ein Übersicht, kann man sich mit `pnpm ports:urls` anzeigen lassen.

> __Vorsicht__ diese Adressen sind der _SOLL_-Zustand! Die Adressen werden nicht gezogen oder dynamisch ermittelt, sondern folgen dem Konzept der [Suido](./mokuroku/SUIDO.md)-Philosophie
