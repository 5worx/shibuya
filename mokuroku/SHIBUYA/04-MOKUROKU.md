# 📜 MOKUROKU (目録) - Der Katalog

im Katalog werden die *lebenden* Dokumente verwaltet. Alles *was zum Projekt gehört* und von allen Beteiligten gesehen werden soll, wird hier dokumentiert.

Diese werden im Root des Mokuroku-Ordners geführt.

Zu den **minimalen Anforderungen** in der `01-INDEX.md` gehört:

## Kurze Beschreibung des Projektes

Beschreibe in wenigen Absätzen das Projekt. Hier sollte der Techstack beschrieben werden und um welchen Anwendungstyp es sich handelt. Auch Motivation und Kernkonzept der Anwendung(en) sollten hier beschrieben sein. Dafür steht die `01-INDEX.md` zur Verfügung.

Optional können auch noch Informationen darüber gesammelt werden, welchen Anteil der Kunde am Projekt hat. Bspw Lieferung von Bildern und Texten.

### Beispiel

*Zu Erstellen ist eine Angular-Anwendung mit Authentifizierung gegen Keycloak und Anbindung an eine Rust-Axum-API. Alle API-Routen können nur authentifiziert erreicht werden. Die Daten werden in einer PostgreSQL-Datenbank persisitiert.*

*Es handelt sich um eine ERP-Anwendung zum Verwalten, Anlegen und Löschen verschiedenster Datensätze.*

*Die Datensätze sind hoch frequentiert, was immer die Gefahr gegenseitiger Überschreibungen mit sich bringt. Daher müssen alle datenanzeigenden Komponenten ein SSE entgegennehmen, dass über Änderungen informiert.*

*Der Kunde liefert die Texte und Textbausteine sowie Übersetzungen in Englisch und Französisch. Deren Marketingagentur liefert die Icongrafiken und Bilder.*

## Definition of Ready - DoR

*Wann darf ein Ticket/Feature überhaupt in den Sprint oder die Entwicklung?*

Die DoR ist dein Schutzschild gegen unklare Anforderungen. 

Ein Feature ist "ready", wenn:

* **Klarer Scope**: Das "Warum" und das "Was" sind verständlich (User Story Format).
* **Akzeptanzkriterien**: Es ist definiert, wie der Erfolg gemessen wird (z.B. "API liefert 200 OK und die korrekten JSON-Daten").
* **Abhängigkeiten geklärt**: Ist der Keycloak-Realm vorbereitet? Steht das DB-Schema? (Besonders wichtig bei deinem Stack).
* **Schätzung**: Das Team hat ein gemeinsames Verständnis über die Komplexität.
* **Mockups/Verträge**: Für das Frontend liegen Designs oder für die API die Schnittstellenbeschreibungen (Contracts) vor.

## Definition of Done - DoD

*Wann ist eine Aufgabe wirklich "fertig"? (Und zwar "Produktions-fertig", nicht nur "auf meinem Rechner fertig")*

Die DoD ist dein Qualitätsversprechen.

* **Code Quality**: Der Code ist nach den Rust/Angular-Standards formatiert (z.B. `cargo fmt` und `eslint` liefen durch).
* **Testing**: Unit-Tests sind erfolgreich, und die neuen Endpunkte wurden (z.B. via `httpyac`) verifiziert.
* **Review**: Ein Peer-Review (oder bei dir: der finale Check gegen die Architektur-Guidelines) hat stattgefunden.
* **Dokumentation**: Die Änderungen wurden in Mokuroku oder dem Code-Doc reflektiert.
* **Infrastruktur**: Falls nötig, wurden Migrationen erstellt und das `docker-compose.yml` oder die `.env.example` aktualisiert.
* **Integration**: Die App lässt sich im NX-Workspace ohne Fehler bauen (`nx build`).
* **Agnostik-Check**: Keine projektspezifischen Hardcodierungen in Core-Komponenten.

## Teilnehmer

Die Teilnehmer bzw Ansprechpartner eines Projektes werden mit ihren Verantwortlichkeiten in der [02-CONTRIBUTORS.md](../02-CONTRIBUTORS.md) gepflegt.

## Linklist zu externen Resourcen

Hier werden die Links in separate Resourcen wie Jira/Confluence oder ähnliches eingetragen.

## Projektspezifischer Bereich

Am Ende sollten weitere Informationen gepflegt werden, wenn es das Projekt efordert oder das Projektteam für nötig erachtet.
