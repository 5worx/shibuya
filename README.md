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

## Was wir bereits haben

### 1. Systemübersicht
SHIBUYA ist ein modularer Workspace auf Basis von **NX**, der auf maximale Flexibilität und strikte Trennung von Identität, Logik und Daten ausgelegt ist. 

| Komponente | Technologie | Port | Verantwortung |
| :--- | :--- | :--- | :--- |
| **Frontend** | Angular 21 (Signals) | `52101` | User Interface & Token Management |
| **API (BE)** | Rust (Axum, SQLx) | `52102` | Business Logic & DB-Interaktion |
| **Auth (IAM)** | Keycloak | `52201` | Identitätsprüfung & JWT-Ausstellung |
| **Database** | PostgreSQL | `54302` | Persistenz (Relationale Daten) |
| **Mail** | Mailpit | `52203` | E-Mail Testing (Password Reset etc.) |

---

### 2. Authentifizierungs-Flow (JWT)

Das System nutzt den OpenID Connect (OIDC) Standard zur Absicherung der Ressourcen:

1. **Login:** Der User authentifiziert sich im Angular-Frontend gegen den Keycloak Realm `FADS`.
2. **Token:** Angular erhält einen **Access Token (JWT)** und speichert diesen im `AuthService`.
3. **Request:** Der `authInterceptor` in Angular injiziert den Token automatisch in den Header für alle API-Anfragen an `localhost`.
   - Header: `Authorization: Bearer <JWT>`
4. **Validierung:** Das Rust-Backend (Axum) validiert den Token bei jedem Request:
   - Lädt Public Keys (JWKS) von Keycloak.
   - Prüft Signatur, Issuer (`/realms/FADS`) und Ablaufdatum.
5. **Identity:** Die `sub` (Subject-UUID) aus dem Token wird extrahiert und zur Filterung von User-Daten (`owner_id`) in der Datenbank genutzt.

---

### 3. Datenbank-Architektur & Migrationen
Wir setzen auf **SQLx** für typsichere Abfragen und ein automatisiertes Migrations-Management.

- **Storage:** PostgreSQL läuft als Docker-Container.
- **Migrationen:** SQL-Dateien befinden sich unter `apps/rust-api/migrations/`.
- **Automatisierung:** Die Rust-API führt anstehende Migrationen beim Startvorgang selbstständig aus (`sqlx::migrate!`).
- **Sicherheit:** Row-Level-Security Logik wird über die `owner_id` (UUID) in den SQL-Queries abgebildet.

---

### 4. Developer Workflow (Cheat Sheet)

#### System-Reset & Kaltstart
Wenn der Workspace komplett bereinigt wurde (`pn helper:clean` + Volumes gelöscht):

```bash
# 1. Infrastruktur & Apps bauen (Docker-Images & Rust Binaries)
pnpm forge

# 2. Development Mode starten (NX Orchestration)
pnpm dev

# 3. optional: API test
pnpx httpyac apps/rust-api/tests/api.http --all

# 4. Troubleshooting
# Oft ist es die Berechtigung beimKeycloak Container
sudo chown -R $(id -u):$(id -g) /home/ssch/projects/FADS/infrastructure/keycloak/data
```
