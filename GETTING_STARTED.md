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
  ✅ Lokal konfiguriert als: DEIN NAME <deine@mail.de>

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

==============================
Check beendet. Viel Erfolg bei der Arbeit an SHIBUYA!
```

## Empfohlene optionale Tools und Umgebungen

Es ist nicht bekannt, was für Anwendungen produziert werden. Es können auch noch zusätzliche Installationen für Go, Rust, Java, .NET, PHP usw erforderlich werden. Das hängt von den Anwendungen und Paketen im Repo ab. 

> Allen Windowsnutzern wird empfohlen über WSL im Ubuntu-Subsystem zu arbeiten. Auch wenn das Terminal vielleicht anfangs etwas gewöhnungsbedürftig ist, so ist das Arbeiten nach etwas Übung wesentlich angenehmer und vor Allem schneller.

* **glow**: Terminal Anwendung zum Anzeigen und Parsen von .md-Dateien
* **tree**: Terminal Anwendung zum Anzeigen von Verzeichnis- und Dateistrukturen
* **LazyDocker**: Terminal GUI zum Anzeigen und Verwalten von Docker-Containern
* **LazyGit**: Terminal GUI für Git
