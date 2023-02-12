(function (angular) {
  'use strict';

  angular
      .module('coyo.admin.userDirectories.api')
      .provider('userDirectoryTypeRegistry', userDirectoryTypeRegistry);

  /**
   * @ngdoc service
   * @name coyo.admin.userDirectories.api.userDirectoryTypeRegistryProvider
   *
   * @description
   * This provider is used to register user directory types to the system. This makes them available and manageable in
   * the admin configuration (see `User Directories` tab). To register a new user directory type call
   * `userDirectoryTypeRegistryProvider#register` at config phase.
   */

  /**
   * @ngdoc service
   * @name coyo.admin.userDirectories.api.userDirectoryTypeRegistry
   *
   * @description
   * A service to retrieve registered user directory types and their configurations.
   */
  function userDirectoryTypeRegistry() {
    var userDirectoryTypes = {};

    return {
      $get: function () {

        return {

          /**
           * @ngdoc method
           * @name coyo.admin.userDirectories.api.userDirectoryTypeRegistry#getAll
           * @methodOf coyo.admin.userDirectories.api.userDirectoryTypeRegistry
           *
           * @description
           * Returns all user directory types that have been registered during config phase via
           * {@link coyo.admin.userDirectories.api.userDirectoryTypeRegistryProvider userDirectoryTypeRegistryProvider}.
           *
           * @returns {array} Array of all registered user directory types.
           */
          getAll: function () {
            return _.map(userDirectoryTypes, _extract);
          },

          /**
           * @ngdoc method
           * @name coyo.admin.userDirectories.api.userDirectoryTypeRegistry#get
           * @methodOf coyo.admin.userDirectories.api.userDirectoryTypeRegistry
           *
           * @description
           * Returns a user directory type by key.
           *
           * @param {string} key The user directory type key. Must not be empty or undefined.
           * @returns {object} The corresponding user directory type.
           */
          get: function (key) {
            return _extract(userDirectoryTypes[key]);
          }
        };
      },

      /**
       * @ngdoc method
       * @name coyo.admin.userDirectories.api.userDirectoryTypeRegistry#register
       * @methodOf coyo.admin.userDirectories.api.userDirectoryTypeRegistry
       *
       * @description
       * This method is used to register a user directory type to the type registry at config phase. Every type is
       * defined by it's config and can then be retrieved using the service at runtime.
       *
       * @param {object} userDirectoryTypeConfig
       * The directory type's configuration to register to the provider.
       *
       * @param {string} userDirectoryTypeConfig.key
       * A distinct key for the directory type. This key must be unique and must not be null. Use a plain
       * lowercase string without special characters and whitespaces. This key is used to register / identify the
       * directory type. It must be the same key that is used in the backend implementation of the user directory type's
       * service.
       *
       * @param {string} userDirectoryTypeConfig.name
       * The name of this directory type. This can be a proper name or an i18n key. The name will be visible to the
       * administrator and is used in UI context. It must not be null nor empty.
       *
       * @param {string} userDirectoryTypeConfig.description
       * The textual description of this directory type. This can be a proper description or an i18n key.
       *
       * @param {string} userDirectoryTypeConfig.directive
       * The name of a directive rendering the settings form of this directory type. The name must be provided in snake
       * case (e.g. `my-directive`). The directive itself is a common angular directive which must be known to the
       * injector.
       */
      register: function (userDirectoryTypeConfig) {
        _assert(userDirectoryTypeConfig.key, 'Config property "key" is required', userDirectoryTypeConfig);
        _assert(userDirectoryTypeConfig.name, 'Config property "name" is required', userDirectoryTypeConfig);
        _assert(userDirectoryTypeConfig.description, 'Config property "description" is required', userDirectoryTypeConfig);
        _assert(userDirectoryTypeConfig.directive, 'Config property "directive" is required', userDirectoryTypeConfig);
        _assert(!userDirectoryTypes[userDirectoryTypeConfig.key], 'Config property "key" must be unique', userDirectoryTypeConfig);

        userDirectoryTypes[userDirectoryTypeConfig.key] = userDirectoryTypeConfig;
      }
    };

    function _assert(condition, message, config) {
      if (!condition) {
        if (config) {
          console.error('[userDirectoryTypeRegistry] Invalid config', config); //eslint-disable-line
        }
        console.log('[userDirectoryTypeRegistry] ' + message); //eslint-disable-line
        throw new Error('[userDirectoryTypeRegistry] ' + message);
      }
    }

    function _extract(config) {
      return config ? _.pick(config, ['key', 'name', 'description', 'directive']) : null;
    }
  }

})(angular);
