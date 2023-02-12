(function (angular) {
  'use strict';

  angular
      .module('coyo.domain')
      .factory('UserModel', UserModel);

  /**
   * @ngdoc service
   * @name coyo.domain.UserModel
   *
   * @description
   * Provides the Coyo user model.
   *
   * @requires $q
   * @requires $http
   * @requires $httpParamSerializer
   * @requires restResourceFactory
   * @requires commons.config.coyoEndpoints
   * @requires commons.resource.Page
   */
  function UserModel($q, $http, $httpParamSerializer, restResourceFactory, coyoEndpoints, Page) {
    var UserModel = restResourceFactory({
      url: coyoEndpoints.user.users
    });

    // class members
    angular.extend(UserModel, {

      /**
       * @ngdoc function
       * @name coyo.domain.UserModel#searchWithAdminFields
       * @methodOf coyo.domain.UserModel
       *
       * @description
       * User elastic search with fields needed for admin (incl non-active users).
       *
       * @returns {promise} An $http promise
       */
      searchWithAdminFields: function (params) {
        params.with = 'adminFields';
        var url = UserModel.$url();
        return UserModel.$get(url, params).then(function (data) {
          return new Page(data, params, {
            url: url,
            resultMapper: function (item) {
              return new UserModel(item);
            }
          });
        });
      },


      /**
       * @ngdoc function
       * @name coyo.domain.UserModel#searchBlocked
       * @methodOf coyo.domain.UserModel
       *
       * @description
       * User elastic search blocked users.
       *
       * @returns {promise} An $http promise
       */
      searchBlocked: function (params) {
        params.blocked = 'true';
        var url = UserModel.$url();
        return UserModel.$get(url, params).then(function (data) {
          return new Page(data, params, {
            url: url,
            resultMapper: function (item) {
              return new UserModel(item);
            }
          });
        });
      },

      /**
       * @ngdoc function
       * @name coyo.domain.UserModel#searchWithFilter
       * @methodOf coyo.domain.UserModel
       *
       * @description
       * User elastic search with filter.
       *
       * @param {string} term search term
       * @param {object} pageable The paging information. If not set an offset of 0 and a page size of 20 will be used.
       * @param {object} [filters] search filters
       * @param {string} [searchFields] list of fields to search in
       * @param {object} [aggregations] search aggregations
       *
       * @returns {promise} An $http promise
       */
      searchWithFilter: function (term, pageable, filters, searchFields, aggregations) {
        var url = UserModel.$url();
        var params = angular.extend({
          term: term ? term.toLowerCase() : undefined,
          filters: filters ? $httpParamSerializer(filters) : undefined,
          searchFields: searchFields ? searchFields.join(',') : undefined,
          aggregations: aggregations ? $httpParamSerializer(aggregations) : undefined
        }, pageable.getParams());
        return UserModel.$get(url, params).then(function (response) {
          return new Page(response, params, {
            url: url,
            resultMapper: function (item) {
              return new UserModel(item);
            }
          });
        });
      }
    });

    // instance members
    angular.extend(UserModel.prototype, {

      /**
       * @ngdoc function
       * @name coyo.domain.UserModel#recover
       * @methodOf coyo.domain.UserModel
       *
       * @description
       * Recovers the user.
       *
       * @returns {promise} An $http promise
       */
      recover: function () {
        return this.$put(this.$url('recover'));
      },

      /**
       * @ngdoc function
       * @name coyo.domain.UserModel#deactivate
       * @methodOf coyo.domain.UserModel
       *
       * @description
       * Deactivates the user.
       *
       * @returns {promise} An $http promise
       */
      deactivate: function () {
        return this.$put(this.$url('deactivate'));
      },

      /**
       * @ngdoc function
       * @name coyo.domain.UserModel#activate
       * @methodOf coyo.domain.UserModel
       *
       * @description
       * Activates the user.
       *
       * @returns {promise} An $http promise
       */
      activate: function () {
        return this.$put(this.$url('activate'));
      },

      /**
       * @ngdoc function
       * @name coyo.domain.UserModel#update
       * @methodOf coyo.domain.UserModel
       *
       * @description
       * Updates the user.
       *
       * @returns {promise} An $http promise
       */
      update: function () {
        return this.$put(this.$url(), {
          firstname: this.firstname,
          lastname: this.lastname,
          email: this.email,
          active: this.active
        });
      },

      /**
       * @ngdoc function
       * @name coyo.domain.UserModel#create
       * @methodOf coyo.domain.UserModel
       *
       * @description
       * Creates the user.
       *
       * @returns {promise} An $http promise
       */
      create: function () {
        return this.$post(this.$url(), {
          firstname: this.firstname,
          lastname: this.lastname,
          email: this.email,
          active: this.active
        });
      },

      /**
       * @ngdoc function
       * @name coyo.domain.UserModel#updatePresenceStatus
       * @methodOf coyo.domain.UserModel
       *
       * @description
       * Update the user's presence status
       *
       * @returns {promise} An $http promise
       */
      updatePresenceStatus: function (status) {
        return $http({
          method: 'PUT',
          url: this.$url('presence-status'),
          data: status
        });
      },

      /**
       * @ngdoc method
       * @name coyo.domain.UserModel#toggleModeratorMode
       * @methodOf coyo.domain.UserModel
       *
       * @description
       * Toggles the moderator mode if the user has the global permission to enter moderator mode.
       *
       * @param {boolean} moderatorMode
       * Enable moderator mode by passing 'true' or disable it by passing 'false'
       *
       * @returns {object} A promise which returns the new value of the moderator mode (true or false).
       */
      setModeratorMode: function (moderatorMode) {
        var method = (moderatorMode) ? 'PUT' : 'DELETE';
        return $http({
          method: method,
          url: this.$url('moderatorMode')
        });
      },

      /**
       * @ngdoc method
       * @name coyo.domain.UserModel#setTourData
       * @methodOf coyo.domain.UserModel
       *
       * @description
       * Sets the tour data for the given user. The tour data contains which tour steps the user has seen so far.
       *
       * @param {object} tourData
       * The tour data to persist for the given user.
       *
       * @returns {object} A promise which returns the new value of the superadmin mode (true or false).
       */
      setTourData: function (tourData) {
        return $http({
          method: 'PUT',
          url: this.$url('tour'),
          data: tourData
        });
      },

      /**
       * @ngdoc method
       * @name coyo.domain.UserModel#hasGlobalPermissions
       * @methodOf coyo.domain.UserModel
       *
       * @description
       * Checks if the user has at least one of the provided global permissions.
       *
       * @param {string|string[]} permissionNames array or comma-separated list of permission names
       * @param {boolean?} requireAll flag if set then all provided permissions must be set, otherwise a single one will be enough
       *
       * @returns {boolean} true if user has any of the provided permissions, false else
       */
      hasGlobalPermissions: function (permissionNames, requireAll) {
        var permissionNameList = angular.isArray(permissionNames) ? permissionNames : permissionNames.split(',');
        var matchedPermissions = _.intersection(_.get(this, 'globalPermissions', []), permissionNameList);
        if (requireAll) {
          return matchedPermissions.length === permissionNameList.length;
        } else {
          return matchedPermissions.length > 0;
        }
      },

      /**
       * @ngdoc function
       * @name coyo.domain.UserModel#unblock
       * @methodOf coyo.domain.UserModel
       *
       * @description
       * Unblocks the user.
       *
       * @returns {promise} An $http promise
       */
      unblock: function () {
        return this.$put(this.$url('unblock'));
      },

      /**
       * @ngdoc method
       * @name coyo.domain.UserModel#getManaged
       * @methodOf coyo.domain.UserModel
       *
       * @description
       * Returns all users this user is the superior of (and are therefore managed by this user).
       *
       * @param {object} pageable
       * This method supports paging and therefore needs a pageable object.
       *
       * @returns {promise} a promise resolving in a page of managed users
       */
      getManaged: function (pageable) {
        return UserModel.$get(this.$url('managed'), pageable.getParams());
      },

      /**
       * @ngdoc method
       * @name coyo.domain.UserModel#addPushDevice
       * @methodOf coyo.domain.UserModel
       *
       * @description
       * Adds a new push device to the given user.
       *
       * @param {object} pageable
       * This method supports paging and therefore needs a pageable object.
       *
       * @returns {promise} a promise resolving in a page of managed users
       */
      addPushDevice: function (deviceData) {
        return UserModel.$post(this.$url('pushdevices'), deviceData);
      },

      /**
       * @ngdoc method
       * @name coyo.domain.UserModel#getBestSuitableLanguage
       * @methodOf coyo.domain.UserModel
       *
       * @description
       * Resolves the language that suited to the user as its best.
       *
       * @param {array} languages
       * The languages in which should be looked for the best suited language.
       * @param {string} settingsPromise
       * A promise to retrieve the settings for the default language of the system.
       *
       * @returns {string} The best suitable language or 'NONE' if no suitable language was found.
       */
      getBestSuitableLanguage: function (languages, settingsPromise) {
        if (_.includes(languages, this.language)) {
          return $q.resolve(this.language);
        }
        var deferred = $q.defer();
        settingsPromise().then(function (settings) {
          deferred.resolve(_.includes(languages, settings.defaultLanguage) ? settings.defaultLanguage : 'NONE');
        });
        return deferred.promise;
      }

    });

    return UserModel;
  }

})(angular);
