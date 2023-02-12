(function (angular) {
  'use strict';

  angular
      .module('coyo.admin.authenticationProviders.api')
      .provider('authenticationProviderTypeRegistry', authenticationProviderTypeRegistry);

  /**
   * @ngdoc service
   * @name coyo.admin.authenticationProviders.api.authenticationProviderTypeRegistry
   *
   * @description
   * This provider is used to register authentication provider types to the system. This makes them available and
   * manageable in the admin configuration (see `Authentication` tab). To register a new authentication provider type
   * call `authenticationProviderTypeRegistryProvider#register` at config phase.
   */

  /**
   * @ngdoc service
   * @name coyo.admin.authenticationProviders.api.authenticationProviderTypeRegistry
   *
   * @description
   * A service to retrieve registered authentication provider types and their configurations.
   */
  function authenticationProviderTypeRegistry() {
    var authenticationProviderTypes = {};

    return {
      $get: function () {

        return {

          /**
           * @ngdoc method
           * @name coyo.admin.authenticationProviders.api.authenticationProviderTypeRegistry#getAll
           * @methodOf coyo.admin.authenticationProviders.api.authenticationProviderTypeRegistry
           *
           * @description
           * Returns all authentication provider types that have been registered during config phase via
           * {@link coyo.admin.authenticationProviders.api.authenticationProviderTypeRegistryProvider authenticationProviderTypeRegistryProvider}.
           *
           * @returns {array} Array of all registered authentication provider types.
           */
          getAll: function () {
            return _.map(authenticationProviderTypes, _extract);
          },

          /**
           * @ngdoc method
           * @name coyo.admin.authenticationProviders.api.authenticationProviderTypeRegistry#get
           * @methodOf coyo.admin.authenticationProviders.api.authenticationProviderTypeRegistry
           *
           * @description
           * Returns a authentication provider type by key.
           *
           * @param {string} key The authentication provider type key. Must not be empty or undefined.
           * @returns {object} The corresponding authentication provider type.
           */
          get: function (key) {
            return _extract(authenticationProviderTypes[key]);
          }
        };
      },

      /**
       * @ngdoc method
       * @name coyo.admin.authenticationProviders.api.authenticationProviderTypeRegistry#register
       * @methodOf coyo.admin.authenticationProviders.api.authenticationProviderTypeRegistry
       *
       * @description
       * This method is used to register a authentication provider type to the type registry at config phase. Every type
       * is defined by its config and can then be retrieved using the service at runtime.
       *
       * @param {object} authenticationProviderTypeConfig
       * The provider type's configuration to register to the provider.
       *
       * @param {string} authenticationProviderTypeConfig.key
       * A distinct key for the provider type. This key must be unique and must not be null. Use a plain lowercase
       * string without special characters and whitespaces. This key is used to register / identify the provider type.
       * It must be the same key that is used in the backend implementation of the authentication provider type's
       * service.
       *
       * @param {string} authenticationProviderTypeConfig.name
       * The name of this provider type. This can be a proper name or an i18n key. The name will be visible to the
       * administrator and is used in UI context. It must not be null nor empty.
       *
       * @param {string} authenticationProviderTypeConfig.description
       * The textual description of this provider type. This can be a proper description or an i18n key.
       *
       * @param {string} authenticationProviderTypeConfig.directive
       * The name of a directive rendering the settings form of this provider type. The name must be provided in snake
       * case (e.g. `my-directive`). The directive itself is a common angular directive which must be known to the
       * injector.
       *
       * @param {boolean} authenticationProviderTypeConfig.editSlug
       * If true then the alias / slug can be changed when editing an existing authentication provider.
       */
      register: function (authenticationProviderTypeConfig) {
        _assert(authenticationProviderTypeConfig.key, 'Config property "key" is required', authenticationProviderTypeConfig);
        _assert(authenticationProviderTypeConfig.name, 'Config property "name" is required', authenticationProviderTypeConfig);
        _assert(authenticationProviderTypeConfig.description, 'Config property "description" is required', authenticationProviderTypeConfig);
        _assert(authenticationProviderTypeConfig.directive, 'Config property "directive" is required', authenticationProviderTypeConfig);
        _assert(!authenticationProviderTypes[authenticationProviderTypeConfig.key], 'Config property "key" must be unique', authenticationProviderTypeConfig);

        authenticationProviderTypes[authenticationProviderTypeConfig.key] = authenticationProviderTypeConfig;
      }
    };

    function _assert(condition, message, config) {
      if (!condition) {
        if (config) {
          console.error('[authenticationProviderTypeRegistry] Invalid config', config); //eslint-disable-line
        }
        console.log('[authenticationProviderTypeRegistry] ' + message); //eslint-disable-line
        throw new Error('[authenticationProviderTypeRegistry] ' + message);
      }
    }

    function _extract(config) {
      return config ? _.pick(config, ['key', 'name', 'description', 'directive', 'editSlug']) : null;
    }
  }

})(angular);
