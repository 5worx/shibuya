# 🏙️ SHIBUYA – Quick Start Guide für SM, PL & Tester

Willkommen im **SHIBUYA Framework**. Dieses System hilft uns, Beschlüsse, Notizen und Projektumgebungen einfach und sicher zu verwalten. Hier sind die wichtigsten Befehle für die tägliche Arbeit.

---

### 🛠️ 1. Vorbereitungen (Der "Alles OK?" Check)
Bevor du startest, prüfe, ob dein Rechner bereit ist. Das Skript zeigt dir genau an, was fehlt.

**Befehl:**
`pnpm check`

* **Für Tester:** Schau besonders auf die "Stacks" (Rust, PHP, Go). Hier siehst du, ob deine Testumgebung vollständig ist.
* **Für SM/PL:** Achte darauf, dass unter Punkt 7 (Verschlüsselung) ein grünes Häkchen ist.

---

### 📝 2. Dokumentation (Mokuroku)
Wir schreiben keine losen Dokumente mehr, sondern nutzen strukturierte Vorlagen direkt im Projekt.

* **Retro-Beschluss erfassen:**
    `pnpm mokuroku:retro -t "Retro-Sprint-22"`
    *(Öffnet eine Vorlage für Keep, Change und Action-Items).*
* **Arbeitsnotiz erstellen:**
    `pnpm mokuroku:note -t "Feedback-Gespräch-Sven"`
    *(Deine privaten Gedanken zum Projektverlauf).*
* **Dokumente lesen (Browser):**
    `pnpm mokuroku:view`
    *(Öffnet unser internes Dashboard, wo du alle Dokumente bequem lesen kannst).*

---

### 🔐 3. Sicherheit (Keine Angst vor Git!)
Deine Notizen sind im Repository **verschlüsselt**. Niemand ohne den Tresor-Schlüssel kann deine privaten Notizen lesen.

1.  **Einmalig aufschließen:** Du bekommst von Sven den `shibuya-treasure.key`.
    `git-crypt unlock /pfad/zum/key`
2.  **Arbeiten:** Du schreibst ganz normale Notizen.
3.  **Sichern:** Sobald du deine Arbeit hochlädst (`git commit`), werden die Dateien **automatisch** wieder versiegelt. Du musst nichts weiter tun!

---

### 💡 Tipps für den Alltag
* **Titel:** Nutze bei `-t` kurze Namen ohne Leerzeichen (z. B. `design-meeting` statt `Das Meeting über Design`).
* **Editor:** Wenn sich dein Editor (vi/vim) öffnet und du nicht weißt, wie du rauskommst: Tippe `:wq` zum Speichern und Beenden.
* **Fehler?** Wenn etwas rot markiert ist, kopiere die Fehlermeldung einfach an Sven.

---
*SHIBUYA - The Framework Agnostic Development System. Version 2026.1*
