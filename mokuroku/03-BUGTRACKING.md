# Bugtracking mit git-bug

Git hat schon lange sein internes Bugtracking. Allerdings ein sehr rudimentäres, das weder die Verknüpfung untereinander, noch eine Einordnung nach Kategorien oder Priorität erlaubt. Man knn auch keine Anhänge oder Grafiken dazupacken.

## Einmaliges Setup (Onboarding)

Bevor du den ersten Bug erstellen kannst, musst du dir eine Identität im System geben. Das verknüpft deine Bugs und Kommentare mit deinem Namen, ohne auf GitHub-Profile angewiesen zu sein.

### Schritt A: Identität erstellen

Führe folgenden Befehl aus:

```sh
git-bug user new
```

* **Name**: Nutze deinen vollen Namen (z. B. "Magnus Magniafazulla").
* **Email**: Deine geschäftliche E-Mail.
* Das Tool fragt dich evtl. nach einem Passwort zum Schutz deines privaten Schlüssels.

### Schritt B: Identität prüfen

Checke, ob du aktiv bist

```sh
git-bug user
```

## Schritt XX: Einordnung über Labels

Das ist zwar ein vollwertiger Bugtracker, aber lässt nur Einordnung über Tags zu. Damit die Pflege nicht zur Last wird, sind nur wenige Tags vorgegeben, die aber den Großteil der Einordnung übernehmen.

> Im Sinne des _Agilen Manifests_ ist es natürlich absolut zulässig, das sich das Projektteam selber organisiert und seine Tags ggf selber definiert. Daher sind die folgenden Gruppierungen auch eher als Vorschlag zu verstehen.

### Priorität

Nutzt folgende Tags für die Definition der Priorität:

1. `DRINGEND` - Alles stehen und liegen lassen. Dieser Bug ist _umsatzkritisch_ oder führt zum _Appsterben_. Sofort beheben!
2. `WICHTIG` - Diese Aufgabe muss als Nächstes angegangen werden und das zügig. Häufig bei Augfgaben, auf deren Fertigstellung andere aufbauen müssen.
3. `NORMAL` - Eine übliche Aufgabe.
4. `NICE2HAVE` - Spätere Ausbaustufen, Verbesserung des Handlings, usw usf

### Art des Eintrags

Es gibt eigentlich nur wenige Aufgabentypen. Es gibt die **`Story`**, die eine komplette Aufgabe für die Implementierung der Anwendungsfeatures beschreibt. Den **`Task`** die eine Aufgabe in Anwendungen aber auch organisatorischer Natur beinhalten können, wie bspw eine Protoyperstellung oder ein Bereitstellung von Dokumentationen und Beschreibungen. Aber auch _Technische Schulden (TechDepts)_ werden als **Task** geführt. Und natürlich den **`Fix`**, der wohl selbsterklärend ist.

### Bereich (Scope)

Dieses System besteht aus vier Bereichen: `apps/`, `packages/`, `infrastructure/`, `helper/`. Und imgrunde können nur hier Aufgaben anfallen. Um auch über die Typo der Labels sofort Zuordnungen machen zu können, haben die Bereichslabels ein andere Schreibweise:

- `scope:apps`
- `scope:packages`
- `scope:infra`
- `scope:helper`
