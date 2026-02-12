# KundenProjektName

> Die hier aufgeführten Informationen sind reiner Präsentationscontent. *Ähnlichkeiten mit aktuellen und vergangenen Projekten sind rein zufällig!*

Zu Erstellen ist eine Angular-Anwendung mit Authentifizierung gegen Keycloak und Anbindung an eine Rust-Axum-API. Alle API-Routen können nur authentifiziert erreicht werden. Die Daten werden in einer PostgreSQL-Datenbank persisitiert.

Es handelt sich um eine ERP-Anwendung zum Verwalten, Anlegen und Löschen verschiedenster Datensätze.

Die Datensätze sind hoch frequentiert, was immer die Gefahr gegenseitiger Überschreibungen mit sich bringt. Daher müssen alle datenanzeigenden Komponenten ein SSE entgegennehmen, dass über Änderungen informiert.

Der Kunde liefert die Texte und Textbausteine sowie Übersetzungen in Englisch und Französisch. Deren Marketingagentur liefert die Icongrafiken und Bilder.
