(function (angular) {
  'use strict';

  angular
      .module('coyo.admin.authenticationProviders.saml')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('en', {
          "ADMIN.AUTHENTICATION.SAML.NAME": "SAML",
          "ADMIN.AUTHENTICATION.SAML.DESCRIPTION": "Security Assertion Markup Language",
          "ADMIN.AUTHENTICATION.SAML.LOCAL_METADATA_LINK": "Local service provider XML metadata",
          "ADMIN.AUTHENTICATION.SAML.LOCAL_AUTH_ENDPOINT_LINK": "Local authentication endpoint",
          "ADMIN.AUTHENTICATION.SAML.LOCAL_LOGOUT_ENDPOINT_LINK": "Local logout endpoint",
          "ADMIN.AUTHENTICATION.SAML.IS_ADFS": "AD FS",
          "ADMIN.AUTHENTICATION.SAML.IS_ADFS.HELP": "Check if the identitiy provider is a Microsoft Active Directory Federation Services (AD FS)",
          "ADMIN.AUTHENTICATION.SAML.ENTITY_ID": "Entity ID",
          "ADMIN.AUTHENTICATION.SAML.ENTITY_ID.HELP": "The entity ID, located in the identity provider's metadata XML.",
          "ADMIN.AUTHENTICATION.SAML.AUTH_ENDPOINT": "Authentication Endpoint",
          "ADMIN.AUTHENTICATION.SAML.AUTH_ENDPOINT.HELP": "The identity provider's authentication endpoint URL.",
          "ADMIN.AUTHENTICATION.SAML.IDP_TRUST_ANCHOR": "IDP Trust Anchor Certificate",
          "ADMIN.AUTHENTICATION.SAML.IDP_TRUST_ANCHOR.HELP": "A valid, Base64-encoded X.509 certificate, PEM formatted, that can be used to validate the certificate used by the IDP for signing responses. Can be either the IDP's certificate itself or one from it's chain of trust.",
          "ADMIN.AUTHENTICATION.SAML.LOGOUT_ENDPOINT": "Logout Endpoint",
          "ADMIN.AUTHENTICATION.SAML.LOGOUT_ENDPOINT.HELP": "The identity provider's logout endpoint URL.",
          "ADMIN.AUTHENTICATION.SAML.LOGOUT_METHOD": "Logout method",
          "ADMIN.AUTHENTICATION.SAML.LOGOUT_METHOD.HELP": "Determines the logout method the client should offer. The local one performs a logout from COYO, the global one ends the SAML session as well. Attention: global/federated logout does not work as expected in conjunction with an AD FS!",
          "ADMIN.AUTHENTICATION.SAML.LOGOUT_METHOD.": "",
          "ADMIN.AUTHENTICATION.SAML.LOGOUT_METHOD.LOCAL": "Local",
          "ADMIN.AUTHENTICATION.SAML.LOGOUT_METHOD.GLOBAL": "Global/Federated",
          "ADMIN.AUTHENTICATION.SAML.LOGOUT_METHOD.LOCAL_AND_GLOBAL": "Local and Global/Federated",
          "ADMIN.AUTHENTICATION.SAML.AUTHENTICATION_EXPIRY_IN_SECONDS": "Answer Validity",
          "ADMIN.AUTHENTICATION.SAML.AUTHENTICATION_EXPIRY_IN_SECONDS.HELP": "Time in seconds before an authentication response will be voided.",
          "ADMIN.AUTHENTICATION.SAML.SIGN_REQUEST": "Sign Requests",
          "ADMIN.AUTHENTICATION.SAML.SIGN_REQUEST.HELP": "Check to have the authentication requests signed. This will require a certificate and a private key.",
          "ADMIN.AUTHENTICATION.SAML.SIGNING_CERTIFICATE": "Certificate",
          "ADMIN.AUTHENTICATION.SAML.SIGNING_CERTIFICATE.HELP": "A valid, Base64-encoded X.509 certificate, PEM formatted.",
          "ADMIN.AUTHENTICATION.SAML.SIGNING_PRIVATE_KEY_PASSWORD": "Password",
          "ADMIN.AUTHENTICATION.SAML.SIGNING_PRIVATE_KEY_PASSWORD.HELP": "Optional password if the private key is password protected.",
          "ADMIN.AUTHENTICATION.SAML.SIGNING_PRIVATE_KEY_PASSWORD.HINT": "Only required for changes",
          "ADMIN.AUTHENTICATION.SAML.SIGNING_PRIVATE_KEY": "Private Key",
          "ADMIN.AUTHENTICATION.SAML.SIGNING_PRIVATE_KEY.HELP": "RSA/DSA private key, PKCS#1 or PKCS#8, PEM formatted.",
          "ADMIN.AUTHENTICATION.SAML.SIGNING_PRIVATE_KEY.HINT": "Only required for changes",
          "ADMIN.AUTHENTICATION.SAML.TABS.HEADINGS.GENERAL": "General",
          "ADMIN.AUTHENTICATION.SAML.TABS.HEADINGS.SIGN_REQUEST": "Request Signing",
          "ADMIN.AUTHENTICATION.SAML.TABS.HEADINGS.VALIDATE_RESPONSE": "Response Validation",
          "ADMIN.AUTHENTICATION.SAML.USER_DIRECTORY": "User Directory",
          "ADMIN.AUTHENTICATION.SAML.USER_DIRECTORY.HELP": "User directory holding the user metadata (authorization)",
          "ADMIN.AUTHENTICATION.SAML.DISABLE_TRUST_CHECK": "Disable certificate trust check",
          "ADMIN.AUTHENTICATION.SAML.DISABLE_TRUST_CHECK.HELP": "Disable trust check for signed responses from the identity provider. Useful for self-signed certificates in testing environments. Should never be used in production."
        });
        /* eslint-enable quotes */
      });
})(angular);
