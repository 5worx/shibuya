// packages/auth/src/index.ts
import Keycloak, { KeycloakConfig, KeycloakInitOptions } from "keycloak-js";

/**
 * Repräsentiert die extrahierten Benutzerinformationen aus dem Keycloak-Token.
 */
export interface AuthUser {
  /** Vollständiger Name des Benutzers (Display Name) */
  name?: string;
  /** E-Mail-Adresse des Benutzers */
  email?: string;
  /** Eindeutiger Benutzername aus Keycloak */
  username?: string;
  /** Liste der zugewiesenen Realm-Rollen */
  roles: string[];
}

/**
 * Zentraler Authentifizierungs-Service für das FADS-Monorepo.
 * Kapselt die Keycloak-JS Library und bietet eine Singleton-Instanz für Angular, Nuxt & Co.
 * * @example
 * const auth = AuthService.getInstance(config);
 * await auth.init();
 */
export class AuthService {
  /** Die interne Keycloak-Instanz */
  private instance: Keycloak;
  /** Statische Instanz für das Singleton-Pattern */
  private static _instance: AuthService;

  /**
   * Privater Konstruktor zur Initialisierung der Keycloak-Instanz.
   * @param config - Die Keycloak-Konfiguration (url, realm, clientId).
   */
  private constructor(config: KeycloakConfig) {
    this.instance = new Keycloak(config);
  }

  /**
   * Liefert die Singleton-Instanz des AuthService.
   * Muss beim ersten Aufruf zwingend mit einer Konfiguration versorgt werden.
   * * @param config - Optionale Konfiguration für die Erstinitialisierung.
   * @returns Die globale Instanz des AuthService.
   * @throws Error falls die Instanz noch nicht existiert und keine Config übergeben wurde.
   */
  public static getInstance(config?: KeycloakConfig): AuthService {
    if (!AuthService._instance) {
      if (!config) {
        throw new Error("AuthService must be initialized with a config first!");
      }
      AuthService._instance = new AuthService(config);
    }
    return AuthService._instance;
  }

  /**
   * Initialisiert die Verbindung zu Keycloak und prüft den Session-Status.
   * Sollte beim App-Bootstrap (z.B. APP_INITIALIZER) aufgerufen werden.
   * * @param options - Keycloak Initialisierungs-Optionen.
   * Standardmäßig wird PKCE und 'check-sso' verwendet.
   * @returns Ein Promise, das true liefert, wenn die Initialisierung erfolgreich war.
   */
  public async init(
    options: KeycloakInitOptions = {
      onLoad: "check-sso",
      pkceMethod: "S256",
    },
  ): Promise<boolean> {
    try {
      const authenticated = await this.instance.init(options);
      console.log(`Auth: Initialized (Authenticated: ${authenticated})`);
      return authenticated;
    } catch (error) {
      console.error("Auth: Failed to initialize", error);
      return false;
    }
  }

  /**
   * Triggert den Redirect zum Keycloak Login-Server.
   */
  public async login(options?: { redirectUri?: string }): Promise<void> {
    await this.instance.login(options);
  }

  /**
   * Loggt den Benutzer aus und leitet ihn zurück zur aktuellen Startseite.
   */
  public logout(): void {
    this.instance.logout({ redirectUri: window.location.origin });
  }

  /**
   * Liefert den aktuellen JWT-Token (Access Token) zurück.
   * @returns Der Token als String oder undefined, falls nicht eingeloggt.
   */
  public getToken(): string | undefined {
    return this.instance.token;
  }

  /**
   * Prüft, ob der Benutzer aktuell authentifiziert ist.
   * @returns true, falls ein gültiger Session-Status vorliegt.
   */
  public isLoggedIn(): boolean {
    return !!this.instance.authenticated;
  }

  /**
   * Extrahiert Benutzerdaten aus dem decodierten JWT-Token.
   * @returns Ein AuthUser-Objekt oder null, falls keine Session aktiv ist.
   */
  public getUser(): AuthUser | null {
    if (!this.instance.tokenParsed) return null;
    return {
      name: (this.instance.tokenParsed as any).name,
      email: (this.instance.tokenParsed as any).email,
      username: (this.instance.tokenParsed as any).preferred_username,
      roles: this.instance.realmAccess?.roles || [],
    };
  }

  /**
   * Erzeugt ein Header-Objekt für HTTP-Requests.
   * Nützlich für Fetch-API oder manuelle HTTP-Calls.
   * * @returns Objekt mit Authorization-Header inklusive Bearer-Token.
   */
  public getAuthorizationHeader(): { Authorization: string } {
    return { Authorization: `Bearer ${this.getToken()}` };
  }
}
