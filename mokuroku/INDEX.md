# 📜 SHIBUYA Mokuroku (目録)

> Das lebende Verzeichnis des Framework Agnostic Development Systems.

## Vorwort (kann in scharfen Projekten entfernt werden)

Während eines Projektablaufs fallen eine Menge Informationen an. Nicht nur technischer, sondern auch im hohen Maße organisatorischer Natur. All diese Infos werden gerne auf unterschiedlichsten Systemen wie Jira/Confluence verteilt. Das entpuppt sich oft als suboptimal, da die Infos sehr häufig hinter dem Repostand hinterherhängen. Wie sehr hängt von Scrummastern und Productownern ab.  
Welche Art von Infos geteilt werden müssen, hängt auch vom Projekt und den zu erstellenden Anwendungen ab. 

Die SHIBUYA-Phiosophie besagt, dass alles was wichtig ist, auch in SHIBUYA bleibt. Das beinhaltet, dass die Infos sich mit dem Repostand decken müssen. Nur so kriegt man eine eindeutige Historie über den Projektverlauf hin, die sich sogar automatisiert visualisieren liesse. Denn dafür sind Versionskontrollen ja schließlich da.

Wichtige Informationen sind:

## 👥 Projektverantwortlichkeiten

Übersicht über die Projektbeteiligten und deren Verantwortlichkeiten.

- **🟢 Aktiv [Link Innovation GmbH] Sven Schoppe (sven.schoppe@link-innovation.de)**
  - Fokus: SHIBUYA-Philosophie, System-Design, Rust-Integration, Dokumentations-Struktur, Troubleshooting.
  - Verantwortlich für: Core-Entscheidungen, Infrastruktur-Layout.
  - Position: Lead Development
  - Im Projekt seit: Anfang an

## 🔗 Schnellzugriff & Links

Externe Resourcen, Link zu Unterlagen, TaskManagement usw.

- **API (Lokal):** [http://localhost:52102/api/status](http://localhost:52102/api/status)
- **Keycloak Admin:** [http://localhost:52201](http://localhost:52201)
- **Mailpit UI:** [http://localhost:52402](http://localhost:52402)
- **pgAdmin:** [http://localhost:52202](http://localhost:52202)


## 🏗️ System-Architektur

Dieses Projekt folgt dem **SHIBUYA**-Prinzip: Maximale Autonomie der Komponenten bei zentraler Infrastruktur-Governance.

| Komponente | Typ | Verantwortung | Status |
| :--- | :--- | :--- | :--- |
| `apps/rust-api` | Backend | Core Business Logic & Auth-Validierung | 🟢 Aktiv |
| `apps/angular-app` | Frontend | User Interface & State Management | 🟢 Aktiv |
| `infrastructure/` | Infra | Docker-Zentrale (DB, Keycloak, Mail) | ⚙️ Stabil |


## 🐛 Defekt-Management
Bugs werden dezentral via `git-bug` verwaltet.
- `git-bug webui` zur grafischen Übersicht.
