# SHIBUYA - The Framework Agnostic Development System

__Dein Monorepo. Dein Fokus. Deine Freiheit.__ 

Vergiss starre Skripte und manuelle Setups. SHIBUYA ist das Framework Agnostic Development System, das Komplexität in Einfachheit verwandelt. Mit einer app-zentrischen Orchestrierung, die Infrastruktur und Abhängigkeiten genau dann liefert, wenn du sie brauchst – und sie im Hintergrund laufen lässt, wenn du sie nicht mehr siehst. __Baue Software, kein Setup.__

## ⛩️ Das Ökosystem (Nomenklatur)

Hinter den Namen im SHIBUYA-System steckt eine klare Philosophie. Jedes Modul erfüllt eine spezifische Rolle im "Distrikt":

### 🏗️ KIBAN (基盤) – Das Fundament
* **Bedeutung:** Basis / Infrastruktur / Unterbau.
* **Rolle:** Beherbergt die unsichtbare Logik. Hier liegen Serialisierung, Transformationen und grundlegende JS-Klassen, die framework-übergreifend in den Anwendungen genutzt werden können. Ohne Kiban gibt es keine Stabilität in den Datenströmen.

### 🎭 KUROKO (黒衣) – Die unsichtbaren Helfer
* **Bedeutung:** Die in Schwarz gekleideten Bühnenhelfer im japanischen Theater.
* **Rolle:** Unsere Stencil Web Components. Wie die Kuroko arbeiten sie hochgradig effizient im Verborgenen (Shadow DOM), um die visuelle Show zu ermöglichen, ohne dass die Apps sich um die komplexe UI-Logik kümmern müssen.

### 🚦 SHIBUYA Orchestrator
* **Bedeutung:** Das pulsierende Herz der Vernetzung.
* **Rolle:** Der Dispatcher, der alles zusammenhält. Er koordiniert die Ströme zwischen Kiban (Logik), Kuroko (UI) und den darauf aufgebauten Anwendungen.

## 🎯 Kernprinzipien

- __App-Zentrisch__: Jede App definiert in ihrer eigenen shibuya.yaml, was sie zum Arbeiten benötigt.
- __Persistent Infra__: Infrastruktur (Docker) wird gestartet, bleibt aber auch nach dem Beenden der Dev-Server aktiv. Kein unnötiges Warten auf Datenbanken.
- __Modular & Agnostisch__: Egal ob _Angular_, _Stencil_, _React_ oder _Go_ – der SHIBUYA Orchestrator bedient jedes Framework über NX-Targets.
- __Parallelität__: Maximale Ausnutzung deiner Hardware durch parallele Task-Ausführung.

## 🏗 Struktur

Das System basiert auf einer klaren Trennung von Verantwortlichkeiten:

```text
.
├── apps/                 # Endbenutzer-Anwendungen (z.B. Angular)
│   └── angular-app/
│       └── shibuya.yaml  # Das "Gehirn" der App
├── packages/             # Gemeinsam genutzte Libs & Komponenten
├── infrastructure/       # Docker-Umgebungen (Keycloak, DBs, etc.)
├── helper/               # Setup- & Cleanup-Scripts
└── shibuya.js            # Der Dispatcher (SHIBUYA)
```

> __SHIBUYA__ (nach William Gibson, der als einer der Begründer des Cyberpunk-Genres gilt): _"In der Ästhetik des Cyberpunk ist __SHIBUYA__ das _leuchtende Herz der Vernetzung_ – ein Ort, an dem die Grenze zwischen Hardware und Software verschwimmt. Als Dispatcher übernimmt __SHIBUYA__ diese Rolle im F.A.D.S: Er filtert das Rauschen der Abhängigkeiten und schafft eine klare Struktur inmitten der technologischen Komplexität. Ein digitaler Distrikt, der niemals schläft."_

## 🛠 Voraussetzungen

Bevor du den Distrikt betrittst, stelle sicher, dass folgende Werkzeuge auf deinem Host-System installiert sind:

* **Node.js**: Version 24.x oder höher (LTS empfohlen)
* **pnpm**: Version 10.28.x oder höher (`npm install -g pnpm`)
* **Docker & Docker Compose**: Zum Hosten der Infrastruktur (Keycloak, DBs)
* **Unix-Shell**: Linux, macOS oder WSL2/Git Bash (für die `.sh` Helper-Scripts)
* **NX CLI**: Global empfohlen via `pnpm add -g nx` (alternativ via `npx nx`)

> Check den Status deiner Umgebung `node -v && pnpm -v && docker compose version`
