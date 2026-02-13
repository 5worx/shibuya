# Bugtracking mit git-bug und Synergieeffekte mit MOKUROKU

> Das hier ist etwas **für Fortgeschrittene**. Voraussetzung ist das Verständnis von Issue- und Bugtracking, wie man sie erfasst und beschreibt und natürlich zuweist und abarbeitet.

Git hat schon lange sein internes Bugtracking. Allerdings ein sehr rudimentäres, das weder die Verknüpfung untereinander, noch eine Einordnung nach Kategorien oder Priorität erlaubt. Man kann auch keine Anhänge oder Grafiken dazupacken.

Dafür bietet es aber was anderes:

* **Aktualität**: Jedes Issue ist an die Repo-Historie gebunden.
* **Offline**: Energieeffizienzklasse A++.
* **Wahrheit im Repo (SHIBUYA-Philosophie)**: Der Stand der Bugs entspricht immer dem Stand des Repos.

> Sollte es kein Issuetracking im Projekt geben oder nicht klar ist, empfehle ich diese Lösung, da fast alle Manager wie Jira in der Lage sind, die mit `git-bug` erfassten Issues zu importieren (also wenn nötig). Auch bin ich mir ziemlich sicher, dass in scharfen Projekten andere Ticketsysteme zum Einsatz kommen werden. Daher ist das hier eher für autarke Projekte oder für diejenigen, die sich das zutrauen. Kann aber auch für Bugs genutzt werden, die nicht im Kunden-Jira auftauchen sollen.

> Oliver bspw pflegt eine `Todo.md`, wo alle die Dinge drin erfasst sind, die das System besser machen, aber im Backlog nicht zwingend erfasst werden müssen. Eine Alternative wäre dafür `git-bug`. Aber kein Muß. Auch das ist letzlich eine Teamentscheidung.

## Einmaliges Setup (Onboarding)

Bevor du den ersten Bug erstellen kannst, musst du dir eine Identität im System geben. Das verknüpft deine Bugs und Kommentare mit deinem Namen, ohne auf GitHub-Profile angewiesen zu sein.

### Schritt A: Identität erstellen

Führe folgenden Befehl aus:

```sh
git-bug user new
```

* **Name**: Nutze deinen vollen Namen (z. B. "Magnus Magniafazzulla").
* **Email**: Deine geschäftliche E-Mail.
* Das Tool fragt dich evtl. nach einem Passwort zum Schutz deines privaten Schlüssels.

### Schritt B: Identität prüfen

Checke, ob du aktiv bist

```sh
git-bug user
```

### Schritt C: Automatisierung (Bereits vorbereitet)

In SHIBUYA sind bereits Git-Hooks hinterlegt. Sobald du `git push` oder `git pull` ausführst, werden deine Bugs im Hintergrund mit dem Server synchronisiert. Du musst dich also nicht um `git bug push` kümmern.

### Schritt D: Anzeigen

`git-bug` bietet dir zwei Möglichkeiten, Issues zu verwalten, ohne jedes Mal lange Befehle tippen zu müssen.

1. Web UI (empfohlen): `git-bug webui`
2. Terminal UI (HARDBOILED): `git-bug termui`

## Schritt E: Einordnung über Labels

Das ist zwar ein vollwertiger Bugtracker, aber lässt nur Einordnung über Tags zu. Damit die Pflege nicht zur Last wird, sind nur wenige Tags vorgegeben, die aber den Großteil der Einordnung übernehmen.

> Im Sinne des _Agilen Manifests_ ist es natürlich absolut zulässig, das sich das Projektteam selber organisiert und seine Tags ggf selber definiert. Daher sind die folgenden Gruppierungen auch eher als Vorschlag zu verstehen.

### Priorität

Nutzt folgende Tags für die Definition der Priorität:

1. `1` = **DRINGEND** - Alles stehen und liegen lassen. Dieser Bug ist _umsatzkritisch_ oder führt zum _Appsterben_. Sofort beheben!
2. `2` = **WICHTIG** - Diese Aufgabe muss als Nächstes angegangen werden und das zügig. Häufig bei Augfgaben, auf deren Fertigstellung andere aufbauen müssen.
3. `3` = **NORMAL** - Eine übliche Aufgabe.
4. `4` = **NICE2HAVE** - Spätere Ausbaustufen, Verbesserung des Handlings, usw usf

### Art des Eintrags

Es gibt eigentlich nur wenige Aufgabentypen. Es gibt die **`STORY`**, die eine komplette Aufgabe für die Implementierung der Anwendungsfeatures beschreibt. Den **`TASK`**, der eine Aufgabe in Anwendungen aber auch organisatorischer Natur beinhalten können, wie bspw eine Protoyperstellung oder ein Bereitstellung von Dokumentationen und Beschreibungen. Aber auch _Technische Schulden (TechDepts)_ werden als **TASK** geführt. Und natürlich den **`FIX`**, der wohl selbsterklärend ist.

### Bearbeiter/ Prozess

Natürlich müssen wir auch wissen, wer den Task bearbeitet und in welchem Zustand er ist. Auch hier machen wir uns die Label zunutze. Damit wir aber nicht den ganzen Bereich mit Label zumüllen, kombinieren wir den User mit dem Prozess.

Beispiele

- `bunke:🔵` = 🔵 -> new
- `ssch:🟠` = 🟠 -> in progress
- `galibaeva:🟢` = 🟢 -> ready_for_review
- `m.strobelt:` = ⚪ -> done

### Bereich (Scope) - optional

Dieses System besteht aus vier Bereichen: `apps/`, `packages/`, `infrastructure/`, `shibuya/`. Und imgrunde können nur hier Aufgaben anfallen. Um auch über die Typo der Labels sofort Zuordnungen machen zu können, haben die Bereichslabels ein andere Schreibweise:

- `scope:apps`
- `scope:packages`
- `scope:infra`
- `scope:shibuya`

## Ein Issue erfassen

Das Dumme ist ja, dass es *git-bug* heisst. Wir erfassen allerdings zusätzlich auch TASKS und STORIES.

Wenn man ein Issue erfassen will, geht das auf verschiedene Weise.

### git-bug webui

Man kann die WebUI über das Terminal mit `git bug webui` starten.

> Vielleicht etwas gewöhnungsbedürftig, wenn man andere wesentlich komfortablerer Plattformen kennt. Da will ich niemanden etwas vormachen. Die Einfachheit und Effektivität sieht man erst, wenn man damit arbeitet.

Man erfasst hier etwas im Stop-Motion-Rythmus:

- Klicke auf den Button <kbd>NEW BUG<kbd>
- Erfasse in der nächsten Maske *nur* den Titel und speichere mit <kbd>SUBMIT NEW BUG</kbd>.
- Setze in der nächsten Maske die *Labels* (s.  unten)
-

#### *Labels* setzen

Die Liste der Labels setzt sich aus denn zusammen, die schon einmal verwendet wurden.
