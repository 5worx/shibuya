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

Check der *Umgebung* `pnpm helper:check`:

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

> **Nützlich?** in der ROOT-`package.json` wird `helper:check` zusammen mit dem `sensei`-Skript ausgeführt. Der Sensei (nicht Sensai, das bedeutet "Deodorant) hilft, die Prinzipien des [Agilen Manifests](https://agilemanifesto.org/iso/de/principles.html) in Erinnerung zu behalten.

### WSL / Linux Subsystem für Win

> Allen Windowsnutzern wird empfohlen über WSL im Ubuntu-Subsystem zu arbeiten. Auch wenn das Terminal vielleicht anfangs etwas gewöhnungsbedürftig ist, so ist das Arbeiten nach etwas Übung wesentlich angenehmer und vor Allem schneller.

Folge den offiziellen Anleitungen 

* https://learn.microsoft.com/de-de/windows/wsl/install
* https://praxistipps.chip.de/linux-subsystem-unter-windows-aktivieren-so-gehts-bei-windows-10-und-11_104185

Empfohlen wird die **LTS-Version Ubuntu**.

#### Optionale, aber empfohlene Tools und Umgebungen

Es ist nicht bekannt, was für Anwendungen produziert werden. Es können auch noch zusätzliche Installationen für Go, Rust, Java, .NET, PHP usw erforderlich werden. Das hängt von den Anwendungen und Paketen im Repo ab. 

Hier ein paar hilfreiche Tools, die ein vereinfachtes strukturiertes Arbeiten ermöglichen.

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

Das ist wichtig für:

* **Reibungsloser Sync**: Die `pre-push` und `post-merge` Hooks laufen im Hintergrund ohne Unterbrechung durch.
* **Identität**: `git-bug` kann deine Einträge sofort signieren, ohne dass ein Editor-Popup oder eine Passwort-Prompts den Flow stört.

#### Wezterm als Terminal-Emulator unter Windows.

Zugegeben, wer schonmal die MacOS-Terminals oder mit Linux über die Commandline gearbeitet hat, wird mit den nativen Terminal-Emulatoren von Windows nur wenig anfangen können. Glücklicherweise gibt es mittlerweile mehr Alternativen zu dem omnipräsenten _Putty_.

Download [WezTerm](https://wezterm.org/)

WezTerm wird in `Lua` konfiguriert. Dafür legt man in Windows in seinem `Benutzer-Ordner` einfach die leere Datei `.wezterm.lua` an.

__ODER__

**Pro-Tipp**: Als Dev hat man es ja gern, wenn die eigene Entwicklungsumgebung immer schnell zur Verfügung steht, egal an welcher Workstation man gerade ist. Viele habe ihre persönlichen Konfigurationen daher bei Github in privaten Repos. Dafür müssen die aber an einem zentralen Ort sein.

Der zentrale Ort in einem Ubuntu-Subsystem ist: `\\wsl.localhost\Ubuntu-24.04\home\{YOURNAME}\.config\` im Windows-Explorer. Dort legen wir uns den Ordner `wezterm` an und legen wieder eine leere `.wezterm.lua` rein.

Jetzt der Trick über _Symlinks_:

Wir öffnen eine _Powershell_. Wenn nicht anders konfiguriert, öffnet sich die Shell automatisch im Benutzer-Ordner. Wir löschen die hier liegende `.wezterm.lua`, denn wir wollen, dass die Config aus dem Ubuntu-Subsystem gezogen wird, wo auch die restlichen Konfigurationen liegen werden.

```ps1
New-Item -ItemType SymbolicLink -Path "C:\Users\{USER}\.wezterm.lua" -Target "\\wsl.localhost\Ubuntu-24.04\home\{YOURNAME}\.config\wezterm\wezterm.lua"
```

Jetzt könnt ihr euer Terminal nach euren Wünschen konfigurieren. Wer noch keine Wünsche hat, kann mit meiner Konfiguration anfangen:

> **Convenience-Tipp**: Kopiert die `.wezterm.lua` in ein KI-Prompt eurer Wahl und lasst sie euch erläutern.

```lua
local wezterm = require("wezterm")
local act = wezterm.action

local config = {}

-- Der normale Befehl für neue Tabs/Panes (ohne Zitat)
local normal_wsl_prog = { "wsl.exe", "-d", "Ubuntu-24.04", "--cd", "~" }

-- Bruce Lee Zitat
local quote = [[
„Give me six hours to chop down a tree and I will spend the first four sharpening the axe.” 
— Unknown
]]

-- Erststart-Kommando (mit Zitat und danach Bash)
local welcome_command_string = 'echo "' .. quote .. '" && exec bash'

-- Use config builder object if possible
if wezterm.config_builder then
	config = wezterm.config_builder()
end

-- 1. WSL as default shell
-- wezterm boots dirctly to linux subsystem
config.default_prog = { "wsl.exe", "-d", "Ubuntu-24.04", "--cd", "~", "--exec", "bash", "-c", welcome_command_string }

-- Settings
config.color_scheme = "Github Dark (Gogh)"
config.font = wezterm.font_with_fallback({
	{
		family = "D2CodingLigature Nerd Font",
		scale = 1,
	},
})
config.window_background_opacity = 0.95
config.window_decorations = "RESIZE"
config.window_close_confirmation = "AlwaysPrompt"
config.scrollback_lines = 3000
config.line_height = 1.25

-- For example, changing the initial geometry for new windows:
config.initial_cols = 160
config.initial_rows = 35

config.window_padding = {
	left = 25,
	right = 25,
	top = 20,
	bottom = 35,
}

config.inactive_pane_hsb = {
	brightness = 0.4,
}

config.use_fancy_tab_bar = false
config.status_update_interval = 1000

wezterm.on("update-right-status", function(window, pane)
	-- Workspace name
	local stat = window:active_workspace()
	if window:active_key_table() then
		stat = window:active_key_table()
	end
	if window:leader_is_active() then
		stat = "LDR"
	end

	-- Current working directory
	local basename = function(s)
		return string.gsub(s, "(.*[/\\])(.*)", "%2")
	end
	local cwd_url = pane:get_current_working_dir()
	local cwd_string = basename(cwd_url.file_path)
	local cmd = basename(pane:get_foreground_process_name())
	local time = wezterm.strftime("%H:%M %d.%m.%Y")

	window:set_right_status(wezterm.format({
		{ Text = wezterm.nerdfonts.oct_table .. "  " .. stat },
		{ Text = " | " },
		{ Text = wezterm.nerdfonts.md_calendar .. "  " .. time },
	}))
end)

config.max_fps = 144
config.animation_fps = 30

-- keymaps
-- using ALT for tabs & panes
config.keys = {

	-- Tab management (Nutzt jetzt das normale Programm ohne Echo)
	{ key = "t", mods = "ALT", action = act.SpawnCommandInNewTab({ args = normal_wsl_prog }) },
	{ key = "w", mods = "ALT", action = act.CloseCurrentTab({ confirm = false }) },

	-- Pane management (Ebenfalls ohne Echo)
	{
		key = "v",
		mods = "ALT",
		action = act.SplitPane({
			direction = "Down",
			command = { args = normal_wsl_prog },
		}),
	},
	{
		key = "h",
		mods = "ALT",
		action = act.SplitPane({
			direction = "Right",
			command = { args = normal_wsl_prog },
		}),
	},

	{ key = "q", mods = "ALT", action = act.CloseCurrentPane({ confirm = false }) },

	-- Pane navigation (move between panes using ALT + Arrows)
	{ key = "LeftArrow", mods = "ALT", action = act.ActivatePaneDirection("Left") },
	{ key = "RightArrow", mods = "ALT", action = act.ActivatePaneDirection("Right") },
	{ key = "UpArrow", mods = "ALT", action = act.ActivatePaneDirection("Up") },
	{ key = "DownArrow", mods = "ALT", action = act.ActivatePaneDirection("Down") },
}

-- mousebinding
config.mouse_bindings = {

	{
		event = { Down = { streak = 1, button = "Right" } },
		mods = "NONE",
		action = wezterm.action({ PasteFrom = "Clipboard" }),
	},
}

return config
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

## Die Infrastruktur bauen

> Hier in diesem Showcase sind eine **Angular-App** mit einer **Rust-Api**, die sich beide eine Keycloak-Instanz teilen, grob angerissen. Nicht jedes Projekt braucht eine Infrastruktur. Aber nach hinreichender Wahrscheinlichkeit wird eine da sein.

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

Das sollte genügen. Ein Neustart des Rechner reicht eventuell auch aus. Aber der Neustart von `winnat` hat den Fehler immer behoben.

## Webadressen über Ports:urls

Sind die Container gebaut, stellen sie verschiedenste Webadressen zur Verfügung. Ein Übersicht, kann man sich mit `pnpm suido:urls` anzeigen lassen.

> __Vorsicht__ diese Adressen sind der **SOLL-Zustand!** Die Adressen werden nicht gezogen oder dynamisch ermittelt, sondern folgen dem Konzept der [Suido](./mokuroku/SUIDO.md)-Philosophie.

## Beginne zu entwickeln

Sind die Container gebaut und laufen, kann man die Entwicklung starten: `pnpm dev`.

Auf dem Terminal sieht jetzt die Dev-Logs der jeweiligen Anwendungen, die in der ROOT-`package.json` definiert sind. Zurzeit dieser Beschreibung ist das `node ./shibuya.js dev --apps=angular-app,rust-api`. Übersetzt heißt der Befehl: _Starte die Befehle, die du in der `angular-app/project.json` und der `rust-api/project.json` im Eintrag `"dev"` findest und führe sie aus._

Im Terminal erscheinen die Dev-Logs und man kann anfangen im Quelltext rumzumachen. Ab jetzt kann man sich in der Welt der Angular- oder Rust-Entwicklung, oder was auch immer man da gerade hat, bewegen.
