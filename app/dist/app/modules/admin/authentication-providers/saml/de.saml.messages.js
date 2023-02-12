(function (angular) {
  'use strict';

  angular
      .module('coyo.admin.authenticationProviders.saml')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('de', {
          "ADMIN.AUTHENTICATION.SAML.NAME": "SAML",
          "ADMIN.AUTHENTICATION.SAML.DESCRIPTION": "Security Assertion Markup Language",
          "ADMIN.AUTHENTICATION.SAML.LOCAL_METADATA_LINK": "Lokale Serviceanbieter XML Metadaten",
          "ADMIN.AUTHENTICATION.SAML.LOCAL_AUTH_ENDPOINT_LINK": "Lokaler Authentifizierungs-Endpunkt",
          "ADMIN.AUTHENTICATION.SAML.LOCAL_LOGOUT_ENDPOINT_LINK": "Lokaler Logout-Endpunkt",
          "ADMIN.AUTHENTICATION.SAML.IS_ADFS": "AD FS",
          "ADMIN.AUTHENTICATION.SAML.IS_ADFS.HELP": "Auswählen wenn es sich beim Identitäts-Anbieter um ein Microsoft Active Directory Federation Services (AD FS) handelt",
          "ADMIN.AUTHENTICATION.SAML.ENTITY_ID": "Entitäts-ID",
          "ADMIN.AUTHENTICATION.SAML.ENTITY_ID.HELP": "Die Entitäts-ID, welche in den XML Metadaten des Identitäts-Anbieters gefunden werden kann.",
          "ADMIN.AUTHENTICATION.SAML.AUTH_ENDPOINT": "Authentifizierungs-URL",
          "ADMIN.AUTHENTICATION.SAML.AUTH_ENDPOINT.HELP": "Der Authentifizierungs-Endpunkt des Identitäts-Anbieters.",
          "ADMIN.AUTHENTICATION.SAML.IDP_TRUST_ANCHOR": "IDP Trust Anchor Zertifikat",
          "ADMIN.AUTHENTICATION.SAML.IDP_TRUST_ANCHOR.HELP": "Ein gültiges, Base64-enkodiertes X.509 Zertifikat im PEM Format, welches zur Validierung des vom IDP für die Signierung der Antworten genutzten Zertifikats genutzt werden kann. Kann entweder das IDP Zertifikat selbst oder eines aus dessen Vertrauenskette sein.",
          "ADMIN.AUTHENTICATION.SAML.LOGOUT_ENDPOINT": "Logout-URL",
          "ADMIN.AUTHENTICATION.SAML.LOGOUT_ENDPOINT.HELP": "Der Logout-Endpunkt des Identitäts-Anbieters.",
          "ADMIN.AUTHENTICATION.SAML.LOGOUT_METHOD": "Logout Methode",
          "ADMIN.AUTHENTICATION.SAML.LOGOUT_METHOD.HELP": "Legt fest welche Logout Methoden der Client zur Verfügung stellen soll. Die lokale meldet den User nur von COYO ab, die globale beendet auch die SAML Session. Achtung: Global/Federated Logout im Zusammenspiel mit einem AD FS funktioniert nicht wie gewünscht!",
          "ADMIN.AUTHENTICATION.SAML.LOGOUT_METHOD.": "",
          "ADMIN.AUTHENTICATION.SAML.LOGOUT_METHOD.LOCAL": "Lokal",
          "ADMIN.AUTHENTICATION.SAML.LOGOUT_METHOD.GLOBAL": "Global/Federated",
          "ADMIN.AUTHENTICATION.SAML.LOGOUT_METHOD.LOCAL_AND_GLOBAL": "Lokal und Global/Federated",
          "ADMIN.AUTHENTICATION.SAML.AUTHENTICATION_EXPIRY_IN_SECONDS": "Antwortgültigkeit",
          "ADMIN.AUTHENTICATION.SAML.AUTHENTICATION_EXPIRY_IN_SECONDS.HELP": "Maximale Gültigkeitsdauer der Authentifierungsantworten in Sekunden",
          "ADMIN.AUTHENTICATION.SAML.SIGN_REQUEST": "Anfragen signieren",
          "ADMIN.AUTHENTICATION.SAML.SIGN_REQUEST.HELP": "Aktivieren um Authentifizierungsanfragen zu signieren. Dies erfordert ein Zertifikat und einen privaten Schlüssel.",
          "ADMIN.AUTHENTICATION.SAML.SIGNING_CERTIFICATE": "Zertifikat",
          "ADMIN.AUTHENTICATION.SAML.SIGNING_CERTIFICATE.HELP": "Ein gültiges, Base64-enkodiertes X.509 Zertifikat im PEM Format.",
          "ADMIN.AUTHENTICATION.SAML.SIGNING_PRIVATE_KEY_PASSWORD": "Passwort",
          "ADMIN.AUTHENTICATION.SAML.SIGNING_PRIVATE_KEY_PASSWORD.HELP": "Optionales Passwort falls der private Schlüssel passwortgeschützt ist.",
          "ADMIN.AUTHENTICATION.SAML.SIGNING_PRIVATE_KEY_PASSWORD.HINT": "Nur für Änderung des bisherigen Passworts angeben.",
          "ADMIN.AUTHENTICATION.SAML.SIGNING_PRIVATE_KEY": "Privater Schlüssel",
          "ADMIN.AUTHENTICATION.SAML.SIGNING_PRIVATE_KEY.HELP": "Privater Schlüssel (RSA/DSA), PKCS#1 oder PKCS#8 im PEM Format",
          "ADMIN.AUTHENTICATION.SAML.SIGNING_PRIVATE_KEY.HINT": "Nur für Änderung des bisherigen privaten Schlüssels angeben.",
          "ADMIN.AUTHENTICATION.SAML.USER_DIRECTORY": "Benutzerverzeichnis",
          "ADMIN.AUTHENTICATION.SAML.TABS.HEADINGS.GENERAL": "Allgemein",
          "ADMIN.AUTHENTICATION.SAML.TABS.HEADINGS.SIGN_REQUEST": "Anfragesignierung",
          "ADMIN.AUTHENTICATION.SAML.TABS.HEADINGS.VALIDATE_RESPONSE": "Antwortvalidierung",
          "ADMIN.AUTHENTICATION.SAML.USER_DIRECTORY.HELP": "Benutzerverzeichnis welches die User Metadaten (Authorisierung) bereit stellt.",
          "ADMIN.AUTHENTICATION.SAML.DISABLE_TRUST_CHECK": "Deaktiviere Zertifikatsprüfung",
          "ADMIN.AUTHENTICATION.SAML.DISABLE_TRUST_CHECK.HELP": "Deaktiviere die Vertrauensprüfung für mit fremden Zertifikaten unterschriebene Authentifierungsantworten. Nützlich bei selbstsignierten Zertifikaten. Sollte niemals in Produktionsumgebungen verwendet werden."
        });
        /* eslint-enable quotes */
      });
})(angular);
