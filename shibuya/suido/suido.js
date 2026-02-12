import fs from "fs";
import yaml from "js-yaml";
import path from "path";
/**
 * SUIDO (水道) - Das Port-Leitsystem für SHIBUYA.
 * * Diese Strategie kanalisiert den Datenverkehr des Monorepos über
 * ein deterministisches 5-stelliges Schema: {PREFIX}{DISTRICT}{ID}
 */

const CONFIGPATH = path.join(
  process.cwd(),
  "shibuya",
  "suido",
  "suido.config.yaml",
);

// Anpassen, falls mehrere Monorepos auf einer Workstation
// betrieben werden müssen
let MONOREPO_PREFIX = 52;
if (fs.existsSync(CONFIGPATH)) {
  const rawConfig = yaml.load(fs.readFileSync(CONFIGPATH, "utf8"));
  MONOREPO_PREFIX = rawConfig.SETTINGS.portprefix;
} else {
  console.warn(
    `⚠️ Kein Eintrag für den PortPrefix in der suido.config.yaml gefunden. Stattdessen den default 52 angenommen.`,
  );
}

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
  STORAGE: 3, // {MONOREPO_PREFIX}3xx: Mock Server, Tools
  COMM: 4, // {MONOREPO_PREFIX}4xx: SMTP
  SHIBUYA: 8, // {MONOREPO_PREFIX}8xx: Shibuya localhost ports (e.g mokuroku)
};

let APPLICATIONS_CONFIG = {
  [CATEGORY_MAP.PACKAGES]: {},
  [CATEGORY_MAP.APPS]: {},
  [CATEGORY_MAP.INFRA]: {},
  [CATEGORY_MAP.STORAGE]: {},
  [CATEGORY_MAP.COMM]: {},
  [CATEGORY_MAP.SHIBUYA]: {},
};

if (fs.existsSync(CONFIGPATH)) {
  const rawConfig = yaml.load(fs.readFileSync(CONFIGPATH, "utf8"));
  APPLICATIONS_CONFIG = {
    [CATEGORY_MAP.PACKAGES]: rawConfig.PACKAGES || {},
    [CATEGORY_MAP.APPS]: rawConfig.APPS || {},
    [CATEGORY_MAP.INFRA]: rawConfig.INFRA || {},
    [CATEGORY_MAP.STORAGE]: rawConfig.STORAGE || {},
    [CATEGORY_MAP.COMM]: rawConfig.COMM || {},
    [CATEGORY_MAP.SHIBUYA]: rawConfig.SHIBUYA || {},
  };
} else {
  console.warn(`⚠️ Keine suido.config.yaml gefunden unter ${CONFIGPATH}`);
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
  const usedPorts = new Set(); // SUIDO-Guard: Verhindert Rohrbrüche

  for (const categoryIndex in APPLICATIONS_CONFIG) {
    const categoryApps = APPLICATIONS_CONFIG[categoryIndex];

    Object.entries(categoryApps).forEach(([appName, appId]) => {
      const port = calculatePort(parseInt(categoryIndex, 10), appId);

      if (usedPorts.has(port)) {
        throw new Error(
          `🛑 SUIDO-KOLLISION: Port ${port} wird mehrfach beansprucht! ` +
            `Prüfe die ID ${appId} in Kategorie ${categoryIndex}.`,
        );
      }

      usedPorts.add(port);
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
      `\n\x1b[34m--- 💧 SUIDO Port-Matrix [Prefix: ${MONOREPO_PREFIX}] ---\x1b[0m`,
    );
    console.table(urlMap);
    console.log("--------------------------------------------------");
  }
}

// Führe die Ausgabe nur aus, wenn das Skript direkt über Node.js aufgerufen wird
if (process.argv[1] && process.argv[1].endsWith("suido.js")) {
  displayPortTable();
}

// Exportiere die Konfiguration, damit sie in deinen Entwicklungs-Skripten importiert werden kann
export { Ports, CATEGORY_MAP, MONOREPO_PREFIX };
