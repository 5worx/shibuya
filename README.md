# KundenProjektName

> Willkommen im Distrikt SHIBUYA!

Angular-Anwendung mit Rust-Api mit Keycloak-Authentifizierung und PostgreSQL-Datenbank

## Getting started

Installiere *NodeJS*-Abhängigkeiten mit `pnpm install`. Wichtig für die Ausführung der *Run-Commands*.

Verfügbare *Run-Commands* anzeigen mit `pnpm run`.

Nach dem Auschecken prüfen, ob alle *Abhängigkeiten* und *Tools* installiert sind: `pnpm shibuya:check`.

## Übersicht der gültigen Urls

Mit `pnpm suido:urls` kann man sich die gültigen URLs ansehen. Diese repräsentieren den **SOLL**-Zustand. Mehr dazu im Mokuroku-Katalog unter *SUIDO*.

> URLs natürlich nur gültig, wenn die Infrastruktur gebaut wurde und die `apps/` mit `pnpm dev` gestartet wurden!

## Infrastruktur bauen

Für das FE und das BE werden *Docker Container* benötigt: `pnpm forge`.

Diese Infrastruktur beinhaltet Webfrontends für *PG Admin*. Es dauert etwas, bis diese gestartet und im Browser erreichbar sind.

> Und dauert noch länger, wenn Images neu heruntergeladen werden müssen.

## Parallel-Entwicklung ist der Default.

`pnpm dev` startet die Angular-Anwendung und die Rust-Api im Development-Modus.

### Nur Rust-Api Entwicklung

Dafür wird nur die Infrastruktur benötigt. Diese sollte gebaut sein. Dann kann man die Rust-Entwicklung isoliert vom FE starten:

```sh
# Option 1
cd apps/rust-api
cargo watch

# Option 2 - aus dem root
pnpx nx rust-api dev
```

### Nur Angular-Entwicklung

Es wird die Rust-API benötigt. Die Infrastruktur logischerweise auch.

```sh
# Rust-Api bauen und laufen lassen
cd apps/rust-api
cargo run
```

2. Terminalfenster

```sh
# Option 1
cd apps/angular-app
pnpm dev

# Option 2 - aus dem root
pnpx nx dev angular-app 
```

## Troubleshooting

Ansprechpartner bei technischen Problemen: Sven Schoppe (sven.schoppe@link-innovation.de)
