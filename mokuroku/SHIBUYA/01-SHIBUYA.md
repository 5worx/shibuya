# SHIBUYA - The Framework Agnostic Development System

![SHIBUYA](/mokuroku/assets/images/logos/shibuya.svg)

> __SHIBUYA__ (nach William Gibson, der als einer der Begründer des Cyberpunk-Genres gilt): _"In der Ästhetik des Cyberpunk ist __SHIBUYA__ das _leuchtende Herz der Vernetzung_ – ein Ort, an dem die Grenze zwischen Hardware und Software verschwimmt._ Als Dispatcher übernimmt __SHIBUYA__ diese Rolle: Er filtert das Rauschen der Abhängigkeiten und schafft eine klare Struktur inmitten der technologischen Komplexität. Ein digitaler Distrikt, der niemals schläft."

__Dein Entwicklungssystem. Dein Fokus. Deine Freiheit.__ 

Vergiss starre Skripte und manuelle Setups. SHIBUYA ist das Framework Agnostic Development System, das Komplexität in Einfachheit verwandelt. Mit einer app-zentrischen Orchestrierung, die Infrastruktur und Abhängigkeiten genau dann liefert, wenn du sie brauchst – und sie im Hintergrund laufen lässt, wenn du sie nicht mehr siehst. __Baue Software, kein Setup.__

## ⛩️ Das Ökosystem (Nomenklatur)

Hinter den Namen im SHIBUYA-System steckt eine klare Philosophie. Jedes Modul erfüllt eine spezifische Rolle im "Distrikt":

### 🚦 SHIBUYA Orchestrator

* **Bedeutung:** Das pulsierende Herz der Vernetzung.
* **Rolle:** Der Dispatcher, der alles zusammenhält. Er koordiniert die Ströme zwischen den darauf aufgebauten Anwendungen und ist der "Kleber" der Infrastruktur.

### 🌊 SUIDO (水道)

* **Bedeutung:** Wasserweg oder Kanalisation
* **Rolle:** Logische und eindeutiges Schema zur Port-Vergabe unterhalb Shibuyas

### 📜 MOKUROKU (目録)

* **Bedeutung:** Das Inventar / Der Katalog
* **Rolle:** Technisches Verzeichnis und Dokumentation der Bestandteile.

### 🏗️ KIBAN (基盤) – Das Fundament (Frontend und uU NodeJS-Backends wie ExpressJS)

* **Bedeutung:** Basis / Infrastruktur / Unterbau.
* **Rolle:** Beherbergt die unsichtbare Logik. Hier liegen Serialisierung, Transformationen und grundlegende JS-Klassen, die framework-übergreifend in den Anwendungen genutzt werden können. Ohne Kiban gibt es keine Stabilität durch wiederverwendbare Komponenten.

### 🎭 KUROKO (黒衣) – Die unsichtbaren Bühnen (WebComponents) -Helfer

* **Bedeutung:** Die in Schwarz gekleideten Bühnenhelfer im japanischen Theater.
* **Rolle:** Unsere Stencil Web Components. Wie die Kuroko arbeiten sie hochgradig effizient im Verborgenen (Shadow DOM), um die visuelle Show zu ermöglichen, ohne dass die Apps sich um die komplexe UI-Logik kümmern müssen.

## 🎯 Kernprinzipien

- __App-Zentrisch__: Jede App definiert in ihrer eigenen shibuya.yaml, was sie zum Arbeiten benötigt.
- __Persistent Infra__: Infrastruktur (Docker) wird gestartet, bleibt aber auch nach dem Beenden der Dev-Server aktiv. Kein unnötiges Warten auf Datenbanken.
- __Modular & Agnostisch__: Egal ob _Angular_, _Stencil_, _React_ oder _Go_ – der SHIBUYA Orchestrator bedient jedes Framework über NX-Targets.
- __Parallelität__: Maximale Ausnutzung der Hardware durch parallele Task-Ausführung.

## 🏗 Struktur

Das System basiert auf einer klaren Trennung:

```text
.
├── apps/                 # Endbenutzer-Anwendungen (z.B. Angular)
│   └── angular-app/
│       └── shibuya.yaml  # Das "Gehirn" der App
│       └── project.json  # Der "Befehlshaber" der App
├── packages/             # Gemeinsam genutzte Libs & Komponenten (Kiban, Kuroko, ...)
├── infrastructure/       # Docker-Umgebungen (Keycloak, DBs, etc.)
├── shibuya/              # Setup-, Helper- & Cleanup-Scripts
└── shibuya.js            # Der Dispatcher (SHIBUYA)
```

## 🧠 Das SHIBUYA-Bushido (Mindset): Was du "wollen" musst. Das Commitment gegen "Schatten-IT"

* **Ich will, dass andere auf meiner Arbeit aufbauen können.** (Keine Sackgassen bauen, keine "Magic Code"-Silos).
* **Ich will die Wahrheit im Repo.** (Keine veralteten Confluence-Seiten; wenn es wichtig ist, steht es in MOKUROKU oder im Code).
* **Ich will Agnostik vor Bequemlichkeit.** (Ich vermeide Hardcodierung, auch wenn es fünf Minuten länger dauert, damit das System überall fliegen kann).
* **Ich will "Erfassbarkeit" statt Komplexität.** (Ich erkläre das Warum, nicht nur das Was. Ein komplizierter Algorithmus braucht eine einfache Erklärung).
* **Ich will saubere Pfade hinterlassen.** (Git-Bugs, Commits und Dokumentation sind für mich keine Last, sondern das Fundament für Qualität).
* **Ich will, dass das System für mich arbeitet, nicht ich für das System.** (Ich nutze SUIDO und Automationen, um meinen Kopf für die echte Logik frei zu halten).
* **Ich will radikale Transparenz.** (Fehler und Bugs werden offen im git-bug getrackt, statt sie in privaten Chats zu verstecken).

## Der Sensei - Eine Spielerei oder doch Gamification-Ansatz?

Die heutige Spielenwicklung kommt nicht ohne Loading-Screens aus. Damit die nicht so langweilig sind, werden abwechselnd Hinweise zum Spiel eingeblendet. Diese sind als "Loading Screen Tips", "Gameplay Hints" oder als "Flavor Text" etabliert. 

Neben dem reinen Informationsgehalt erfüllen diese Texte zwei wichtige Aufgaben, die für die Einhaltung der SHIBUYA-Philosophie (Stichwort: Erfassbarkeit) interessant sind:

* **Perceived Wait Time** (Gefühlte Wartezeit): Ein statischer Ladebalken fühlt sich länger an als ein Bildschirm, auf dem man etwas lesen kann. Das Gehirn wird beschäftigt („Cognitive Load“), wodurch die Zeit subjektiv schneller vergeht.
* **Micro-Learning**: Anstatt die Agilen Prinzipien mühevoll auswendig zu lernen, nutzt man die „Totzeit“, um Wissen in kleinen Häppchen zu geniessen.

> Der Sensei (nicht Sensai, das bedeutet "Deodorant") hilft, die Prinzipien des [Agilen Manifests](https://agilemanifesto.org/iso/de/principles.html) in Erinnerung zu behalten.

---
