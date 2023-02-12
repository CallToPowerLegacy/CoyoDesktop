(function (angular) {
  'use strict';

  angular
      .module('coyo.domain')
      .factory('CapabilitiesModel', CapabilitiesModel);

  /**
   * @ngdoc service
   * @name coyo.domain.CapabilitiesModel
   *
   * @description
   * Provides the Coyo capabilities.
   *
   * @requires commons.resource.restResourceFactory
   * @requires commons.config.coyoEndpoints
   */
  function CapabilitiesModel(restResourceFactory, coyoEndpoints) {
    var CapabilitiesModel = restResourceFactory({
      url: coyoEndpoints.capabilities
    });

    var promise = null;

    // class members
    angular.extend(CapabilitiesModel, {

      /**
       * @ngdoc function
       * @name coyo.domain.CapabilitiesModel#getAll
       * @methodOf coyo.domain.CapabilitiesModel
       *
       * @description
       * Retrieves and caches the capabilities from the backend.
       *
       * @params {boolean} forceRefresh Invalidates the settings cache
       *
       * @returns {promise} An $http promise
       */
      getAll: function (forceRefresh) {
        if (!promise || forceRefresh) {
          promise = CapabilitiesModel.$get(this.$url()).catch(function () {
            promise = null;
          });
        }

        return promise;
      },

      /**
       * @ngdoc function
       * @name coyo.domain.CapabilitiesModel#get
       * @methodOf coyo.domain.CapabilitiesModel
       *
       * @description
       * Retrieves and caches a single capability value from the backend.
       *
       * @params {string} name The capability key
       * @params {boolean} forceRefresh Invalidates the settings cache
       *
       * @returns {promise} An $http promise
       */
      get: function (name, forceRefresh) {
        return CapabilitiesModel.getAll(forceRefresh).then(function (capabilities) {
          return capabilities[name];
        });
      },

      /**
       * @ngdoc function
       * @name coyo.domain.CapabilitiesModel#pdfAvailable
       * @methodOf coyo.domain.CapabilitiesModel
       *
       * @description
       * Checks whether a pdf preview is available for the selected contentType.
       *
       * @params {string} contentType The mimeType of the file who looking for a pdf preview
       *
       * @returns {boolean} returns true or false
       */
      pdfAvailable: function (contentType) {
        return CapabilitiesModel.get('preview').then(function (contentTypes) {
          var arrayOfTypes = _.find(contentTypes, contentType);
          if (arrayOfTypes) {
            if (_.find(arrayOfTypes[contentType], {'details': 'application/pdf'}) ||
                contentType === 'application/pdf') {
              return true;
            }
          }
          return false;
        }).catch(function () {
          return false;
        });
      },

      /**
       * @ngdoc function
       * @name coyo.domain.CapabilitiesModel#imgAvailable
       * @methodOf coyo.domain.CapabilitiesModel
       *
       * @description
       * Checks whether a preview image is available for the selected contentType.
       *
       * @params {string} contentType The mimeType of the file who looking for a preview image
       *
       * @returns {boolean} returns true or false
       */
      imgAvailable: function (contentType) {
        return CapabilitiesModel.get('preview').then(function (contentTypes) {
          var arrayOfTypes = _.find(contentTypes, contentType);
          if (arrayOfTypes) {
            if (_.find(arrayOfTypes[contentType], {'details': 'image/jpeg'}) ||
                _.find(arrayOfTypes[contentType], {'details': 'image/png'})) {
              return true;
            }
          }
          return false;
        }).catch(function () {
          return false;
        });
      },

      /**
       * @ngdoc function
       * @name coyo.domain.CapabilitiesModel#previewImageFormat
       * @methodOf coyo.domain.CapabilitiesModel
       *
       * @description
       * Return a list of available image preview content types.
       *
       * @params {string} contentType The mimeType of the file who looking for a preview image
       *
       * @returns {array} list of available image preview content types
       */
      previewImageFormat: function (contentType) {
        return CapabilitiesModel.get('preview').then(function (contentTypes) {
          var arrayOfTypes = _.find(contentTypes, contentType);
          if (arrayOfTypes) {
            var format =
                _.find(arrayOfTypes[contentType], {'details': 'image/png'}) ||
                _.find(arrayOfTypes[contentType], {'details': 'image/jpeg'});

            return format.details;
          }
          return false;
        }).catch(function () {
          return false;
        });
      },

      /**
       * @ngdoc function
       * @name coyo.domain.CapabilitiesModel#authProviderCapabilities
       * @methodOf coyo.domain.CapabilitiesModel
       *
       * @description
       * Return a object with the capabilities for the given authentication provider type or an empty object.
       *
       * @params {string} type The authentication provider type
       *
       * @returns {object} The capabilities or an empty object
       */
      authProviderCapabilities: function (type) {
        return CapabilitiesModel.get('authProviders').then(function (authProviders) {
          return _.find(authProviders, function (provider) {
            return provider.name === type;
          }) || {};
        }).catch(function () {
          return {};
        });
      }
    });

    return CapabilitiesModel;
  }

})(angular);
