# 📜 SHIBUYA Mokuroku (目録)

> Das lebende Verzeichnis des Framework Agnostic Development Systems.

## Vorwort (kann in scharfen Projekten entfernt werden)

Während eines Projektablaufs fallen eine Menge Informationen an. Nicht nur technischer, sondern auch im hohen Maße organisatorischer und sensibler Natur. All diese Infos werden im Allgemeinen gerne auf unterschiedlichsten Systemen wie Jira/Confluence verteilt. Das entpuppt sich oft als suboptimal, da die Infos sehr häufig hinter dem Repostand hinterherhängen oder irgendwer ständig damit beschäftigt ist, die Zugangssituation zu klären. Manchmal läuft das gut, dann brauchen wir uns keine Gedanken machen. Wenn das allerdings nicht gut läuft, müssen wir als entwickelndes Prokjektteam ausweichen können. **Das leistet Mokuroku!**

Die SHIBUYA-Phiosophie besagt, dass alles was wichtig ist, auch in SHIBUYA bleibt. Das beinhaltet, dass die Infos sich mit dem Repostand decken müssen. Nur so kriegt man eine eindeutige Historie über den Projektverlauf hin, die sich sogar automatisiert visualisieren liesse. Denn dafür sind Versionskontrollen ja schließlich da. Und Versionskontrollen wie `Git` können noch sehr viel mehr.

Für Devs sollte das Arbeiten mit der Versionskontrolle und mit verschiedenen Dateitypen keine Hürde darstellen. Anders sieht das bei Projektleitern und Scrummastern aus. Und erst recht bei Vertrieb und Geschäftsführung. Der Prozess muss leicht verständlich und mit einfachen Handgriffen zu erlernen sein.

Aber so ganz frei vom Einsatz "ungewohnter Software" und dann auch noch über ein Terminal wird es nicht funktionieren. Wer sich darauf nicht einlassen kann oder nicht will, muss andere Lösungen für das Management finden.

Wer sich das zutraut, wird sehr schnell feststellen, dass es nach dem Überwinden der Anfangshürde sehr viel einfacher wird und Verwaltungsaufwand sich reduziert.

Und dann gibt es noch die Informationen, die nicht für jedermanns Augen bestimmt sind. **Interne und sensible Informationen müssen verschlüsselt werden!**

## 🏛️ Mokuroku - Philosophie

Alles, was für den Projekterfolg wichtig ist, bleibt in SHIBUYA. Wir synchronisieren Informationen mit dem Repository-Stand, um eine lückenlose und ehrliche und transparente Projekthistorie zu gewährleisten.

## 🗺️ Navigation

- [👥 Projektbeteiligte & Rollen](./02-CONTRIBUTORS.md)
- 🛠️ Tooling & Onboarding - `GETTING_STARTED.md`

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


## 🐛 Internes Bugtracking

Bugs werden dezentral via `git-bug` verwaltet.

- `git-bug webui` zur grafischen Übersicht.
- [Anleitung zum Bugtracking](./03-BUGTRACKING.md)

## Scrummaster / Projektleiter - eigene Projektnotizen

Man kommt ja nicht drumherum. Es muss einen Ort für Informationen geben, die nichts mit dem Quelltext oder der technischen Dokumentation zu tun hat. Das ist die Welt der **Scrummaster** und **Projektleiter**, aber auch für den Vertrieb, den Technischen Projektleiter und die Geschäftsführung, die zumindest reinschauen können muss.
