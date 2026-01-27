import fs from "fs";
import yaml from "js-yaml";
import path from "path";
/**
 * Port-Konfigurationsdatei für das Monorepo.
 *
 * Implementiert das 5-stellige Schema: 52XXX
 * XX (42): Monorepo-Präfix
 * Y: Kategorie-Index (0=API, 1=UI, 2=Admin etc.)
 * ZZ: Eindeutige App-ID innerhalb der Kategorie (01 bis 99)
 */

// Anpassen, falls mehrere Monorepos auf einer Workstation
// betrieben werden müssen
const MONOREPO_PREFIX = 52;

const MAX_APPS_PER_CATEGORY = 99;
const HOST = "http://localhost"; // Standard-Host für die URL-Anzeige

/**
 * Definiert die logischen Kategorien und ihren 1-stelligen Index (Y in {MONOREPO_PREFIX}YZZ).
 *
 * > Die Ports mit {MONOREPO_PREFIX}9xx dürfen _nicht_ belegt werden!
 */
const CATEGORY_MAP = {
  PACKAGES: 0, // {MONOREPO_PREFIX}0xx: Backend Services, APIs
  APPS: 1, // {MONOREPO_PREFIX}1xx: User-Facing Frontends
  INFRA: 2, // {MONOREPO_PREFIX}2xx: Admin-Interfaces, CMS
  DB: 3, // {MONOREPO_PREFIX}3xx: Mock Server, Tools
  SMTP: 4, // {MONOREPO_PREFIX}4xx: SMTP
};

const configPath = path.join(
  process.cwd(),
  "helper",
  "ports",
  "port.config.yaml",
);

let APPLICATIONS_CONFIG = {
  [CATEGORY_MAP.PACKAGES]: {},
  [CATEGORY_MAP.APPS]: {},
  [CATEGORY_MAP.INFRA]: {},
  [CATEGORY_MAP.DB]: {},
  [CATEGORY_MAP.SMTP]: {},
};

if (fs.existsSync(configPath)) {
  const rawConfig = yaml.load(fs.readFileSync(configPath, "utf8"));
  APPLICATIONS_CONFIG = {
    [CATEGORY_MAP.PACKAGES]: rawConfig.PACKAGES || {},
    [CATEGORY_MAP.APPS]: rawConfig.APPS || {},
    [CATEGORY_MAP.INFRA]: rawConfig.INFRA || {},
    [CATEGORY_MAP.DB]: rawConfig.DB || {},
    [CATEGORY_MAP.SMTP]: rawConfig.SMTP || {},
  };
} else {
  console.warn(`⚠️ Keine port.config.yaml gefunden unter ${configPath}`);
}

/**
 * Berechnet den endgültigen 5-stelligen Port-Wert ({MONOREPO_PREFIX}YZZ).
 *
 * @param {number} categoryIndex Der Index der Kategorie (0, 1, 2, 3).
 * @param {number} appIndex Der sequenzielle Index der App in dieser Kategorie (startet bei 1).
 * @returns {number} Der vollständige 5-stellige Port.
 */
function calculatePort(categoryIndex, appIndex) {
  if (appIndex > MAX_APPS_PER_CATEGORY) {
    throw new Error(
      `Kategorie ${categoryIndex} hat mehr als ${MAX_APPS_PER_CATEGORY} Apps. Bitte erweitere das Schema.`,
    );
  }

  const appSlot = appIndex.toString().padStart(2, "0");
  const suffix = `${categoryIndex}${appSlot}`;
  const fullPortString = `${MONOREPO_PREFIX}${suffix}`;

  return parseInt(fullPortString, 10);
}

/**
 * Die Hauptfunktion, die die Ports für alle Anwendungen berechnet.
 * @returns {Object<string, number>} Ein Objekt, das Anwendungsnamen auf ihre Ports abbildet.
 */
function generatePortConfig() {
  const portMap = {};

  for (const categoryIndex in APPLICATIONS_CONFIG) {
    const categoryApps = APPLICATIONS_CONFIG[categoryIndex];

    // Da categoryApps jetzt ein Objekt { "app-name": ID } ist:
    Object.entries(categoryApps).forEach(([appName, appId]) => {
      // Wir nehmen jetzt direkt die appId (ZZ) aus deiner Config!
      const port = calculatePort(parseInt(categoryIndex, 10), appId);

      if (portMap[appName]) {
        console.warn(
          `WARNUNG: Doppelte Anwendung gefunden: ${appName}. Bitte Namen in APPLICATIONS_CONFIG prüfen.`,
        );
      }

      portMap[appName] = port;
    });
  }

  return portMap;
}
// Generiere die finale Konfiguration, die exportiert wird
const Ports = generatePortConfig();

/**
 * Überprüft die Kommandozeilen-Argumente und gibt die Port-Tabelle aus.
 */
function displayPortTable() {
  const showUrls = process.argv.includes("--urls");

  if (showUrls) {
    // Erzeuge eine neue Map, die die URLs enthält
    const urlMap = Object.entries(Ports).reduce((acc, [appName, port]) => {
      acc[appName] = `${HOST}:${port}`;
      return acc;
    }, {});

    console.log(
      `--- Generierte Monorepo URLs (${MONOREPO_PREFIX}XXX Schema) ---`,
    );
    console.table(urlMap);
    console.log("--------------------------------------------------");
  }
}

// Führe die Ausgabe nur aus, wenn das Skript direkt über Node.js aufgerufen wird
if (process.argv[1] && process.argv[1].endsWith("port.config.js")) {
  displayPortTable();
}

// Exportiere die Konfiguration, damit sie in deinen Entwicklungs-Skripten importiert werden kann
export { Ports, CATEGORY_MAP, MONOREPO_PREFIX };
