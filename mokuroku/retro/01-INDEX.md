# 🏛️ Architectural Decision Records (ADR)

Ein **Architectural Decision Record (ADR)** ist ein kurzes Textdokument, das eine wichtige architektonische Entscheidung, deren Kontext und die Konsequenzen festhält. In **SHIBUYA** nutzen wir ADRs, um das "Warum" hinter unserer Struktur (Kiban, SUIDO, Framework-Agnostik) für die Zukunft zu konservieren.

## Warum schreiben wir ADRs?

* **Gegen das Vergessen:** Entscheidungen, die heute offensichtlich erscheinen, sind in sechs Monaten oft ein Rätsel.
* **Onboarding:** Neue Teammitglieder verstehen die Historie der Architektur, ohne alles einzeln erfragen zu müssen.
* **Vermeidung von Fehlern:** Die schriftliche Fixierung zwingt uns, Alternativen abzuwägen und Konsequenzen ehrlich zu benennen.
* **Kollaboration:** ADRs werden wie Code behandelt (Pull Requests). Architektur wird so zur Teamleistung.

## Was wird erfasst?

Jedes ADR folgt einer festen Struktur (definiert in unserer `template.md`):

1. **Status:** (Vorgeschlagen / Akzeptiert / Überholt / Abgelehnt).
2. **Kontext:** Welches Problem lösen wir? Welche technischen oder fachlichen Einschränkungen gibt es?
3. **Entscheidung:** Was genau tun wir? (Präzise Beschreibung der gewählten Lösung).
4. **Alternativen:** Welche anderen Wege gab es und warum haben wir sie verworfen?
5. **Konsequenzen:** Was bedeutet das für die Zukunft? (Sowohl positive als auch negative Auswirkungen).

## Workflow in SHIBUYA

Wir nutzen den **Mokuroku-Helper**, um den Prozess so reibungslos wie möglich zu gestalten:

1. **Erstellen:** ```bash
   pnpm mokuroku:adr "Name der Entscheidung"
