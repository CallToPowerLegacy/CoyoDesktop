(function (angular) {
  'use strict';

  angular
      .module('coyo.domain')
      .factory('LanguagesModel', LanguagesModel);

  /**
   * @ngdoc service
   * @name coyo.domain.LanguagesModel
   *
   * @description
   * Provides the Coyo language model.
   *
   * @requires restResourceFactory
   * @requires coyoEndpoints
   * @requires backendUrlService
   * @requires $q
   */
  function LanguagesModel(restResourceFactory, coyoEndpoints, backendUrlService, $q) {
    var LanguagesModel = restResourceFactory({
      url: coyoEndpoints.languages
    });
    var allLanguagesRequest;

    // class members
    angular.extend(LanguagesModel, {

      /**
       * @ngdoc function
       * @name coyo.domain.LanguagesModel#retrieve
       * @methodOf coyo.domain.LanguagesModel
       *
       * @description
       * Retrieves the list of all active languages from the backend.
       *
       * @returns {promise} An $http promise
       */
      retrieve: function () {
        return LanguagesModel.query();
      },

      /**
       * @ngdoc function
       * @name coyo.domain.LanguagesModel#getAll
       * @methodOf coyo.domain.LanguagesModel
       *
       * @description
       * Retrieves the list of languages from the backend.
       *
       * @returns {promise} An $http promise
       */
      getAll: function () {
        if (!allLanguagesRequest) {
          allLanguagesRequest = LanguagesModel.query({includeInactive: true});
        }
        return allLanguagesRequest;
      },

      /**
       * @ngdoc function
       * @name coyo.domain.LanguagesModel#getTranslations
       * @methodOf coyo.domain.LanguagesModel
       *
       * @description
       * Retrieves the translation table for the given language.
       *
       * @params {string} language The language.
       *
       * @returns {promise} An $http promise
       */
      getTranslations: function (language) {
        if (!backendUrlService.isSet()) {
          return $q.reject('No backend URL set.');
        }
        return LanguagesModel.get('public/' + language.toUpperCase() + '/translations');
      },

      /**
       * @ngdoc function
       * @name coyo.domain.LanguagesModel#getBackendTranslations
       * @methodOf coyo.domain.LanguagesModel
       *
       * @description
       * Fetches all the message keys managed by the backend.
       *
       * @params {string} language The language.
       *
       * @returns {promise} An $http promise
       */
      getBackendTranslations: function (language) {
        return LanguagesModel.get('public/' + language.toUpperCase() + '/messages');
      },

      /**
       * @ngdoc function
       * @name coyo.domain.LanguagesModel#createTranslation
       * @methodOf coyo.domain.LanguagesModel
       *
       * @description
       * Creates a key for the given language.
       *
       * @params {string} language The language.
       * @params {string} id The key.
       * @params {string} value The value for the key.
       *
       * @returns {promise} An $http promise
       */
      createTranslation: function (language, key, value) {
        return LanguagesModel.$post(LanguagesModel.$url(language.toUpperCase() + '/translations/' + key),
            {'value': value});
      },

      /**
       * @ngdoc function
       * @name coyo.domain.LanguagesModel#updateTranslation
       * @methodOf coyo.domain.LanguagesModel
       *
       * @description
       * Updates the key with the given ID for the given language.
       *
       * @params {string} language The language.
       * @params {string} id The ID of the key.
       * @params {string} value The new value for the key.
       *
       * @returns {promise} An $http promise
       */
      updateTranslation: function (language, key, value) {
        return LanguagesModel.$put(LanguagesModel.$url(language.toUpperCase() + '/translations/' + key),
            {'value': value});
      },

      /**
       * @ngdoc function
       * @name coyo.domain.LanguagesModel#deleteTranslation
       * @methodOf coyo.domain.LanguagesModel
       *
       * @description
       * Deletes the key with the given ID for the given language.
       *
       * @params {string} language The language.
       * @params {string} id The ID of the key.
       *
       * @returns {promise} An $http promise
       */
      deleteTranslation: function (language, key) {
        return LanguagesModel.$delete(LanguagesModel.$url(language.toUpperCase() + '/translations/' + key));
      },

      /**
       * @ngdoc function
       * @name coyo.domain.LanguagesModel#deleteTranslations
       * @methodOf coyo.domain.LanguagesModel
       *
       * @description
       * Deletes all keys for the given language.
       *
       * @params {string} language The language.
       *
       * @returns {promise} An $http promise
       */
      deleteTranslations: function (language) {
        return LanguagesModel.$delete(LanguagesModel.$url(language.toUpperCase() + '/translations'));
      }
    });

    // instance members
    angular.extend(LanguagesModel.prototype, {
      /**
       * @ngdoc function
       * @name coyo.domain.LanguagesModel#toggleActive
       * @methodOf coyo.domain.LanguagesModel
       *
       * @description
       * Toggles the active state.
       *
       * @returns {promise} An $http promise
       */
      toggleActive: function () {
        return LanguagesModel.$put(this.$url() + '/' + this.language, {active: !this.active});
      }
    });

    return LanguagesModel;
  }

})(angular);
