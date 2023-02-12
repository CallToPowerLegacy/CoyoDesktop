(function (angular) {
  'use strict';

  angular
      .module('coyo.domain')
      .factory('UserDirectoryModel', UserDirectoryModel);

  /**
   * @ngdoc service
   * @name coyo.domain.UserDirectoryModel
   *
   * @description
   * Provides the Coyo user directory model.
   *
   * @requires $http
   * @requires restResourceFactory
   * @requires commons.config.coyoEndpoints
   */
  function UserDirectoryModel($http, $q, restResourceFactory, coyoEndpoints) {
    var UserDirectory = restResourceFactory({
      url: coyoEndpoints.userDirectory.directories
    });

    // class members
    angular.extend(UserDirectory, {

      /**
       * @ngdoc function
       * @name coyo.domain.UserDirectoryModel#getTypes
       * @methodOf coyo.domain.UserDirectoryModel
       *
       * @description
       * Returns a list of all user directory types.
       *
       * @returns {promise} An $http promise
       */
      getTypes: function () {
        return $http.get(coyoEndpoints.userDirectory.types).then(function (response) {
          return response.data;
        });
      },

      /**
       * @ngdoc function
       * @name coyo.domain.UserDirectoryModel#checkConnection
       * @methodOf coyo.domain.UserDirectoryModel
       *
       * @description
       * Checks if a connection can be established to a user directory of the given type with the given settings.
       *
       * @param {string} type the user directory type.
       * @param {object} settings the connection settings.
       *
       * @returns {promise} An $http promise
       */
      checkConnection: function (type, settings) {
        return $http.put(coyoEndpoints.userDirectory.types + '/' + type + '/connection-check', settings, {
          autoHandleErrors: false
        }).catch(function (error) {
          return $q.reject(_.get(error, 'data.context.connectionError'));
        });
      }
    });

    // instance members
    angular.extend(UserDirectory.prototype, {

      /**
       * @ngdoc function
       * @name coyo.domain.UserDirectoryModel#activate
       * @methodOf coyo.domain.UserDirectoryModel
       *
       * @description
       * Activates the user directory.
       *
       * @returns {promise} An $http promise
       */
      activate: function () {
        return this.$put(this.$url('activate'));
      },

      /**
       * @ngdoc function
       * @name coyo.domain.UserDirectoryModel#deactivate
       * @methodOf coyo.domain.UserDirectoryModel
       *
       * @description
       * Deactivates the user directory.
       *
       * @returns {promise} An $http promise
       */
      deactivate: function () {
        return this.$put(this.$url('deactivate'));
      },

      /**
       * @ngdoc function
       * @name coyo.domain.UserDirectoryModel#sync
       * @methodOf coyo.domain.UserDirectoryModel
       *
       * @description
       * Start a synchronization job for the given user directory.
       *
       * @returns {promise} An $http promise
       */
      sync: function () {
        return this.$put(this.$url('sync'));
      },

      /**
       * @ngdoc function
       * @name coyo.domain.UserDirectoryModel#checkConnection
       * @methodOf coyo.domain.UserDirectoryModel
       *
       * @description
       * Checks if a connection can be established to a user directory of the given type with the given settings.
       * @param {object} settings the connection settings.
       *
       * @returns {promise} An $http promise
       */
      checkConnection: function (settings) {
        return $http.put(this.$url('connection-check'), settings, {
          autoHandleErrors: false
        }).catch(function (error) {
          return $q.reject(_.get(error, 'data.context.connectionError'));
        });
      }
    });

    return UserDirectory;
  }

})(angular);
