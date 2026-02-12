# MOKUROKU HARDBOILED

Mokuroku bietet nicht nur die statische Dokumentation über Markdown-Dateien, sondern bietet darüberhinaus noch eine automatisierbare Erfassung der *Retrospektiv*-Meetings und die Erfassung **verschlüsseler Notizen**.

Das ist was für hartgesottene Terminal-Benutzer und die, die es werden wollen. Und es lohnt sich!

Erforderliche Grundkenntnisse:

- Grundlagen der Terminalnutzung (Navigation, Ordner-Verzeichnisse)
- Git (Git Push/Pull und Wechseln des Branches)
- Editieren einer Datei mit [Vim](https://www.vim.org/download.php) oder [NeoVim](https://neovim.io/)
- Handhabung des Verschlüsselungskeys beim Anlegen von Notizen. (Sonderfall! Benutzung nur, wenn volle Teamakzeptanz besteht)

> Um der Wahrheit die Ehre zu geben, ist **das Anlegen verschlüsselter Notizen** das einzige Feature, das ich persönlich ziemlich gut finde und es deshalb mit drin gelassen habe. Wohl wissend, dass es nur selten angewendet werden wird, weil es dann doch etwas mehr Handling voraussetzt.

Der Ablauf ist für die Retrodokumentation und die verschlüsselten Notizen gleich. Nur die Verschlüsselung erfordert extra Schritte. Die kommen später.

Zur Orientierung: Wenn das Projektteam nichts anderes entschieden hat, wird empfohlen, Notizen und Retro-Protokolle im Entwicklungsbranch (im Allgemeinen `develop`) vorzunehmen.

1. Das Reviewmeeting wird im Allgemeinen aus dem `develop` gemacht
2. `develop` ist immer ein lauffähiger Stand
3. `develop` kann bei Bedarf in die `feature`-Branches gemergt werden.
4. Setzt kein Branch-Hopping voraus

## mokuroku:retro

Um die Ergebnisse (Action-Items) festzuhalten, kann die Vorlage aus dem `mokuroku/.templates/retro.md` verwendet werden. Es gibt hier zwei Möglichkeiten:

### 1. Kopieren der Template-Datei

Kopiere die `retro.md` aus `mokuroku/.templates/` in das `mokuroku/retro/`-Verzeichnis.

Gib der Datei einen sinnvollen Namen. Bspw `2026-02-24-sprint-001.md`.

Erfasse die Daten und committe die Datei und pushe sie ins Repo.

> Die Vorlage ist nicht in Stein gemeißelt. Das Projektteam entscheidet, was alles in das Protokoll gehört! Es kann selbstverständlich angepasst werden.

### 2. Automatisierte Erfassung

Wem das Kopieren und Umbennen zu anstrengend ist, kann das auch in einem Schritt über den RUN-Command `pnpm mokuroku:retro -t "Sprint 001"` tun.

Nach der Ausführung wird eine MD-Datei in den `retro`-Ordner gelegt. Der Dateiname wird durch den Zeitstempel und dem serialisiertem Titel automatisch bestimmt. Ist in eurer `.bashrc` ein Standard-Editor (s. `07-HARDBOILED.md`) konfiguriert, dann öffnet sich die IDE mit der Datei.

```markdown
# 🔄 Retro-Beschluss: Sprint 001

* **Datum:** 11.2.2026
* **Moderation:** Sven Schoppe <sven.schoppe@link-innovation.de>

## 🎯 Fokus der Retrospektive

*Kurze Beschreibung des Schwerpunkts.*

## ✅ Beschlüsse & Änderungen

*Was wurde konkret entschieden? Wer setzt es um?*

## 🏁 Action Items

- [ ] ...
- [ ] ...
- [ ] ...
```

Der Titel wurde ja beim Aufruf mitgegeben und die Platzhalter werden aus den Umgebungsvariablen von Git befüllt.

Korrigieren kann man jederzeit. Löschen geht auch. Aber da es immer eingecheckt werden muss, sehen wir ja, was mit der Datei über die Zeit passiert ist. Und schon brauche ich keinerlei Zusatzabsprachen und laufe auch nicht Gefahr, das jemand heimlich einen Beschluss ändert. Ein Gefahr, die bei Fremdsystemen durchaus besteht.

## mokuroku:notes

Im Vergleich zu den Retro-Protokollen können wir Notizen zusätzlich noch verschlüsseln. Dann sind sie eine Binärdatei, die nicht lesbar ist, wenn man in bspw GitLab, Bitbucket oder Github die Datei anklickt. Für diejenigen, die den Schlüssel nicht besitzen, wird auch nichts entschlüsselt.

> Die Notizen sind nur von denen zu bearbeiten und einsehbar, die auch im Besitz des Schlüssels sind.

Dieses Projekt nutzt `git-crypt`, um sensible Daten in `mokuroku/notes/` zu schützen. Ohne den passenden Schlüssel sind diese Dateien verschlüsselt (binärer Zeichensalat).

### Voraussetzungen

* `git-crypt` ist installiert (prüfbar via `pnpm shibuya:check`).
* Du hast die Datei `project-kpn.key` von einem Admin erhalten.

### Setup

1. Erstelle den Vault-Ordner **außerhalb** des Repos:
  `mkdir -p ../.shibuya-vault`

2. Lege den erhaltenen Schlüssel `project-kpn.key` in diesen Ordner.

3. Entsperre das Repository:
   `pnpm mokuroku:unlock`

Sobald das Repo entsperrt ist, kannst du ganz normal mit den Dateien arbeiten. Beim Committen werden sie automatisch wieder verschlüsselt.

---

> TODO: Dieser Teil gehört ins Handbuch, das Informationen und Anleitungen ausserhalb des Repos führt!

## 🛡️ SHIBUYA Security Admin Guide

Anleitung für die Initialisierung und Verwaltung der Verschlüsselung.

### A. Neues Projekt aufsetzen

1. **Initialisieren:**
   Führe im neuen Repo aus:
   git-crypt init

2. **Key exportieren:**
   Speichere den Key sicher außerhalb des Repos:
   git-crypt export-key ../.shibuya-vault/project-name.key

3. **Regeln prüfen:**
   Die `.gitattributes` muss folgende Zeilen enthalten:
   mokuroku/notes/** filter=git-crypt diff=git-crypt
   mokuroku/.templates/secret-*.md filter=git-crypt diff=git-crypt

### B. Integrität sicherstellen

Um den Key im `shibuya:check` zu verifizieren, ermittle den SHA-256 Hash:
shasum -a 256 ../.shibuya-vault/project-name.key

Trage diesen Wert in die `shibuya.workspaces.yaml` unter `project.security.vault_fingerprint` ein.

###  C. Schlüsselverteilung
* Übermittle den Key nur über sichere Kanäle (1Password, verschlüsselter Vault).
* Der Key darf **niemals** in das Git-Repository selbst eingecheckt werden.
