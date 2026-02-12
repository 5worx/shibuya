# Der SHIBUYA-Distrikt und seine Bewohner

Beschreibung der Verantwortlichkeiten der einzelnen SHIBUYA-Rollen.

## 1. Der SHOGUN (Der Architekt / Admin)

Der Shogun ist der Hüter des Systems. Er setzt das "Dorf" (das Repo) auf und bestimmt die Regeln.

* **Aufgaben**: Repository- und Schlüsselverwaltung, requirements.yaml definieren, GitHub/GitLab-Struktur anlegen. README.md
* **Fokus**: Setup-Kommandos, Key-Management, Bereitstellung der Distrikte.
* **Element**: Leere (Ethereal) – Das große Ganze & die Regeln.

## 2. Die SAMURAI (Die Entwickler)

Die Krieger, die den Code in den Distrikten (SUIDO, KIBAN, etc.) schmieden.

* **Aufgaben**: Features bauen, Unit-Tests schreiben, technische Schulden begleichen.
* **Fokus**: Entwicklungsumgebung (pnpm check), nx-Kommandos, Docker-Container steuern.
* **Element**: Feuer – Die Schmiede des Codes.

## 3. Die KANBAN-BUGYO (Die ScrumMaster / PL)

"Bugyo" war ein Titel für Beamte/Verwalter im feudalen Japan. Ein Kanban-Bugyo ist der Verwalter des Flusses und der Prozesse.

* **Aufgaben**: Retrospektiven, Notizen, Team-Governance im mokuroku-Distrikt.
* **Fokus**: pnpm mokuroku:retro, pnpm mokuroku:note, pnpm mokuroku:view, git-crypt unlock.
* **Element**: Wasser – Der Fluss der Prozesse.

## 4. Die METSUKE (Die Tester / QA)

"Metsuke" waren die Inspektoren im Shogunat. Ihr Job war es, die Einhaltung von Regeln zu prüfen und Berichte über Missstände zu verfassen. *Tester suchen Fehler. Inspektoren sichern Qualität!*

* **Aufgaben**: Qualitätssicherung, Abnahmetests in den Distrikten.
* **Element**: Erde – Die feste Basis der Qualität.
* Was noch vorbereitet werden muss:
  * Eigener Workflow: pnpm check:test (um zu sehen, ob die Test-Tools da sind).
  * git-bug Integration: Ein einfacher Weg, um Issues direkt im Terminal zu erstellen, ohne das Repo zu verlassen.
  * Fokus: Bug-Reporting via git-bug, Smoke-Tests ausführen, Logs einsehen.

## 5. Die HATAMOTO (DevOps)

* **Bedeutung:** Leibwache des Shoguns
* **Fokus**: CI/CD-Integration, Infrastruktur, Automatisierung, Build-Pipeline.
* **Element**: Wind – Die Zirkulation (Pipelines) & Infrastruktur.

---

## Warum die neuen Begriffe

* Abgrenzung: "Scrum Master" und "Product Owner" sind oft durch Jira-Traumata vorbelastet. Die neuen Begriffe schaffen einen neutralen Neuanfang.
* Struktur: Shibuya ist ein Ort (das Dev System), die Rollen sind die Funktionen in diesem Ort.
* Agnostik: Da die Umgebung "agnostisch" ist, braucht es eine eigene Sprache, die nicht nach Laravel, Rust oder Jira klingt.

## Präzision durch Abstraktion.

Wenn wir Begriffe wie "Interface" nutzen, schleppen wir 30 Jahre Fehlinterpretationen mit uns herum. In SHIBUYA ist ein Begriff ein definierter Zustand innerhalb unseres Kosmos. Wir nutzen diese Namen nicht, um uns zu verkleiden, sondern um die babylonische Sprachverwirrung zu beenden.
