# 🌊 SUIDO (水道) - Die Port-Architektur

**SUIDO** (Japanisch für *Wasserleitung* oder *Kanalisation*) ist das deterministische Port-Leitsystem für das **SHIBUYA**-Entwicklungs-Framework. 

In einer komplexen Monorepo-Umgebung ist die manuelle Vergabe von Ports oft chaotisch. SUIDO löst dies durch eine mathematische Matrix, die jedem Dienst einen festen, vorhersehbaren Pfad im Netzwerkstack zuweist.

---

## 🧭 Das 52YZZ-Schema

Jeder Port im System folgt einer strengen 5-stelligen Logik, um Kollisionen zu vermeiden und die Zugehörigkeit eines Dienstes auf den ersten Blick erkennbar zu machen.

### Formel: `[52][Y][ZZ]`

1.  **52 (Präfix):** Die Kennung für das SHIBUYA-Monorepo.
2.  **Y (Distrikt):** Die logische Kategorie des Dienstes (siehe Distrikt-Map).
3.  **ZZ (ID):** Die eindeutige Kennung (01-99) innerhalb eines Distrikts.



---

## 🗺️ Die Distrikt-Map (Y)

| Index (Y) | Distrikt | Beschreibung |
| :--- | :--- | :--- |
| **0** | **PACKAGES** | Interne APIs, Core-Services, Kiban, Kuroko, Zentrale Resourcen, Microservices |
| **1** | **APPS** | User-Facing Frontends (Angular, React, etc.). Backends usw |
| **2** | **INFRA** | Admin-Tools, Dashboards, Keycloak-Admin, Mailpit etc |
| **3** | **STORAGE** | Datenbanken (PostgreSQL, Redis, etc.). |
| **4** | **COMM** | SMTP and others |

---

## 🛠️ Workflow für Entwickler

Das SUIDO-Prinzip setzt auf **bewusstes Engineering**. Ports werden nicht magisch zugewiesen, sondern aktiv definiert:

1.  **ID reservieren:** Prüfe die `helper/ports/port.config.yaml`, welche IDs in deinem Distrikt noch frei sind.
2.  **Eintragen:** Füge deine neue App mit der nächsten freien ID hinzu.
3.  **Implementieren:** Übernimm diesen Port manuell in deine Docker-Konfiguration, Umgebungsvariablen oder `project.json`.

> **Warum manuell?** Die bewusste Auseinandersetzung mit dem Port-Layout fördert das Verständnis für die Systemarchitektur und verhindert "Blind-Deployments". *Wer das Rohr legt, muss wissen, wohin es führt.*

---

## 🚫 Goldene Regeln

* **Keine Zufälle:** Nutze niemals dynamische Ports (`:0`) oder Standard-Ports (`8080`, `5432`), die außerhalb von SUIDO liegen.
* **Kein Wildwuchs:** Distrikt 9 ist für systemkritische Notfälle reserviert und darf nicht für reguläre Apps genutzt werden.
* **Dokumentationspflicht:** Jede Änderung an der `suido.config.yaml` ist ein administrativer Akt und muss im Commit begründet werden.

---
*„Absorb what is useful, reject what is useless, and add what is essentially your own.“ — Bruce Lee*
