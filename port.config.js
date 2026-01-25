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
 * Definiert die logischen Kategorien und ihren 1-stelligen Index (Y in 52YZZ).
 *
 * > Die Ports mit 529xx dürfen _nicht_ belegt werden!
 */
const CATEGORY_MAP = {
  PACKAGES: 0, // 520xx: Backend Services, APIs
  APPS: 1, // 521xx: User-Facing Frontends
  INFRA: 2, // 522xx: Admin-Interfaces, CMS
  DB: 3, // 523xx: Mock Server, Tools
};

/**
 * Liste aller Anwendungen, gruppiert nach der Kategorie.
 * Füge hier einfach die Namen deiner Anwendungen immer am Ende hinzu. Die Reihenfolge
 * bestimmt die zugewiesene App-ID (ZZ).
 *
 * > DenkDran!: Nur Anwendungen, die über eine Adresse errechbar sein müssen, sollten hier eingetragen werden. Packages, die nur Skriptressourcen bereitstellen, brauchen keine localhost:PORT Adresse
 *
 * > Die Reihenfolge bestimmt die IP. Einige Anwendungen können dieses Skript verarbeiten und sich den PORT hier rausziehen. Die Docker-Container von bspw Keycloak können das nicht. Daher sollten neue Anwendungen grundsätzlich hinten angehängt werden.
 */
const APPLICATIONS_CONFIG = {
  [CATEGORY_MAP.PACKAGES]: ["kuroko"],
  [CATEGORY_MAP.APPS]: ["angular-app"],
  [CATEGORY_MAP.INFRA]: ["infra-keycloak-pgadmin", "infra-shibuya-pgadmin"],
  [CATEGORY_MAP.DB]: ["infra-keycloak-db", "infra-shibuya-db"],
};

/**
 * Berechnet den endgültigen 5-stelligen Port-Wert (42YZZ).
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
    const apps = APPLICATIONS_CONFIG[categoryIndex];

    apps.forEach((appName, index) => {
      const appSlotIndex = index + 1;
      const port = calculatePort(parseInt(categoryIndex, 10), appSlotIndex);

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

    console.log("--- Generierte Monorepo URLs (42XXX Schema) ---");
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
