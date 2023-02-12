(function (angular) {
  'use strict';

  angular
      .module('coyo.domain')
      .factory('SettingsModel', SettingsModel);

  /**
   * @ngdoc service
   * @name coyo.domain.SettingsModel
   *
   * @description
   * Provides the Coyo general settings.
   *
   * @requires restResourceFactory
   * @requires $rootScope
   * @requires $q
   * @requires commons.config.coyoEndpoints
   * @requires commons.auth.authService
   * @requires commons.resource.backendUrlService
   */
  function SettingsModel(restResourceFactory, $rootScope, $q, coyoEndpoints, authService, backendUrlService) {
    var SettingsModel = restResourceFactory({
      url: coyoEndpoints.settings
    });

    // caches the settings
    var promise = null;

    function clear() {
      promise = null;
    }

    function retrieveSettingsForUser() {
      return retrieveSettings();
    }

    function retrievePublicSettings() {
      return retrieveSettings('public');
    }

    function retrieveSettings(urlParamPublic) {
      return SettingsModel.query({}, {
        public: urlParamPublic
      }).catch(function (error) {
        clear();
        return $q.reject(error);
      });
    }

    // clear cached settings on login
    $rootScope.$on('backendUrlService:url:updated', clear);
    $rootScope.$on('backendUrlService:url:cleared', clear);
    $rootScope.$on('authService:login:success', clear);
    $rootScope.$on('authService:logout:success', clear);
    $rootScope.$on('authService:logout:failed', clear);

    // class members
    angular.extend(SettingsModel, {

      /**
       * @ngdoc function
       * @name coyo.domain.SettingsModel#retrieve
       * @methodOf coyo.domain.SettingsModel
       *
       * @description
       * Retrieves and caches the general settings from the backend. If the current user is not authenticated, only
       * public settings will be retrieved. Upon login, the cached settings are cleared.
       *
       * @params {boolean} forceRefresh Invalidates the settings cache.
       *
       * @returns {promise} An $http promise
       */
      retrieve: function (forceRefresh) {
        if (!backendUrlService.isSet()) {
          return $q.reject('No backend URL set.');
        }

        if (!promise || forceRefresh) {
          promise = authService.isAuthenticated() ? retrieveSettingsForUser() : retrievePublicSettings();
        }
        return promise;
      },

      /**
       * @ngdoc function
       * @name coyo.domain.SettingsModel#retrieveByKey
       * @methodOf coyo.domain.SettingsModel
       *
       * @description
       * Retrieves and caches a single settings value from the backend.
       *
       * @params {string} key The settings key.
       * @params {boolean} forceRefresh Invalidates the settings cache.
       *
       * @returns {promise} An $http promise
       */
      retrieveByKey: function (key, forceRefresh) {
        return SettingsModel.retrieve(forceRefresh).then(function (settings) {
          return _.get(settings, key, null);
        });
      }
    });

    return SettingsModel;
  }

})(angular);
