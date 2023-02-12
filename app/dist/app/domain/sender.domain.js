(function (angular) {
  'use strict';

  angular
      .module('coyo.domain')
      .factory('SenderModel', SenderModel);

  /**
   * @ngdoc service
   * @name coyo.domain.SenderModel
   *
   * @description
   * Domain model representation of sender endpoint.
   *
   * @requires restResourceFactory
   * @requires restSerializer
   * @requires coyoEndpoints
   */
  function SenderModel(restResourceFactory, $httpParamSerializer, coyoEndpoints, AppModel, $state, $stateParams, Page) {
    var SenderModel = restResourceFactory({
      url: coyoEndpoints.sender.senders
    });

    /**
     * @ngdoc function
     * @name coyo.domain.SenderModel#searchWithFilter
     * @methodOf coyo.domain.SenderModel
     *
     * @description
     * General sender elastic search with filter. Url defines pre search selection of senders for specific use cases.
     *
     * @param {object} url use case specific url that allows backend to pre filter results based on use case
     * @param {string} term search term
     * @param {object} pageable The paging information. If not set an offset of 0 and a page size of 20 will be used.
     * @param {object} [filters] search filters
     * @param {string} [searchFields] list of fields to search in
     * @param {object} [aggregations] search aggregations
     *
     * @returns {promise} An $http promise
     */
    function _searchWithFilter(url, term, pageable, filters, searchFields, aggregations) {
      var params = angular.extend({
        term: term ? term.toLowerCase() : undefined,
        filters: filters ? $httpParamSerializer(filters) : undefined,
        searchFields: searchFields ? searchFields.join(',') : undefined,
        aggregations: aggregations ? $httpParamSerializer(aggregations) : undefined
      }, pageable.getParams());
      return SenderModel.$get(url, params).then(function (response) {
        return new Page(response, params, {
          url: url,
          resultMapper: function (item) {
            return new SenderModel(item);
          }
        });
      });
    }

    // class members
    angular.extend(SenderModel, {

      /**
       * @ngdoc method
       * @name coyo.domain.SenderModel#getCurrentIdOrSlug
       * @methodOf coyo.domain.SenderModel
       *
       * @description
       * Get the ID or slug of the current sender (based on the current state)
       *
       * @returns {string} ID or slug
       */
      getCurrentIdOrSlug: function () {
        var senderParam = _.get($state.current, 'data.senderParam');
        return $stateParams[senderParam];
      },

      /**
       * @ngdoc function
       * @name coyo.domain.SenderModel#searchManagedSendersWithFilter
       * @methodOf coyo.domain.SenderModel
       *
       * @description
       * Sender elastic search with filter for all senders where the current user has managing rights.
       *
       * @param {string} term search term
       * @param {object=} pageable The paging information. If not set an offset of 0 and a page size of 20 will be used.
       * @param {object} filters search filters
       * @param {string[]?} searchFields list of fields to search in (default 'displayName')
       * @param {object} aggregations aggregations
       *
       * @returns {promise} An $http promise
       */
      searchManagedSendersWithFilter: function (term, pageable, filters, searchFields, aggregations) {
        var url = SenderModel.$url({}, 'search/managed');
        return _searchWithFilter(url, term, pageable, filters, searchFields, aggregations);
      },

      /**
       * @ngdoc function
       * @name coyo.domain.SenderModel#searchSharingRecipientsWithFilter
       * @methodOf coyo.domain.SenderModel
       *
       * @description
       * Sender elastic search with filter for all senders where the current user has sharing and posting permissions for.
       *
       * @param {string} term search term
       * @param {object=} pageable The paging information. If not set an offset of 0 and a page size of 20 will be used.
       * @param {object} filters search filters
       * @param {string[]?} searchFields list of fields to search in (default 'displayName')
       * @param {object} aggregations aggregations
       *
       * @returns {promise} An $http promise
       */
      searchSharingRecipientsWithFilter: function (term, pageable, filters, searchFields, aggregations) {
        var url = SenderModel.$url({}, 'search/sharing-recipients');
        return _searchWithFilter(url, term, pageable, filters, searchFields, aggregations);
      },

      /**
       * @ngdoc function
       * @name coyo.domain.SenderModel#searchSendersWithFilter
       * @methodOf coyo.domain.SenderModel
       *
       * @description
       * Sender elastic search with filter.
       *
       * @param {string} term search term
       * @param {object=} pageable The paging information. If not set an offset of 0 and a page size of 20 will be used.
       * @param {object} filters search filters
       * @param {string[]?} searchFields list of fields to search in (default 'displayName')
       * @param {object} aggregations aggregations
       *
       * @returns {promise} An $http promise
       */
      searchSendersWithFilter: function (term, pageable, filters, searchFields, aggregations) {
        var url = SenderModel.$url({}, 'search');
        return _searchWithFilter(url, term, pageable, filters, searchFields, aggregations);
      }
    });

    // instance members
    angular.extend(SenderModel.prototype, {

      /**
       * @ngdoc method
       * @name coyo.domain.SenderModel#getApps
       * @methodOf coyo.domain.SenderModel
       *
       * @description
       * Returns all apps of this sender.
       *
       * @returns {array} An array of all apps of this sender or an empty array if none could be found.
       */
      getApps: function () {
        return AppModel.queryWithPermissions({}, {senderId: this.id}, ['manage']);
      },

      /**
       * @ngdoc method
       * @name coyo.domain.SenderModel#getApp
       * @methodOf coyo.domain.SenderModel
       *
       * @description
       * Returns the app with the given id of this sender.
       *
       * @param {string} appIdOrSlug The ID or slug of the app to return.
       * @returns {object} The app model with the given id.
       */
      getApp: function (appIdOrSlug) {
        var params = SenderModel.applyPermissions(['*']);
        return new AppModel({
          senderId: this.id,
          id: appIdOrSlug
        }).get(null, params);
      },

      /**
       * @ngdoc method
       * @name coyo.domain.SenderModel#addApp
       * @methodOf coyo.domain.SenderModel
       *
       * @description
       * Adds an app to this sender.
       *
       * @param {string} key The key of the app to add.
       * @param {string} name The name of the app to add.
       * @returns {object} The newly created app model.
       */
      addApp: function (key, name) {
        return new AppModel({
          senderId: this.id,
          key: key,
          name: name
        }).create();
      },

      /**
       * @ngdoc method
       * @name coyo.domain.SenderModel#removeApp
       * @methodOf coyo.domain.SenderModel
       *
       * @description
       * Removes an app from this sender.
       *
       * @param {string} appIdOrSlug The ID or slug of the app to remove.
       * @param {object} options are added as request params.
       * @returns {object} The deleted app model.
       */
      removeApp: function (appIdOrSlug, options) {
        var url = AppModel.$url({senderId: this.id, id: appIdOrSlug});
        return AppModel.$delete(url, options);
      },

      /**
       * @ngdoc function
       * @name coyo.domain.SenderModel#updateNavigation
       * @methodOf coyo.domain.SenderModel
       *
       * @description
       * Updates the app navigation of this sender.
       *
       * @param {array} appNavigation The new app navigation.
       * @returns {array} The app navigation of this sender.
       */
      updateNavigation: function (appNavigation) {
        var url = AppModel.$url({senderId: this.id}, 'action/navigation');
        return AppModel.$put(url, appNavigation, {});
      }
    });

    return SenderModel;
  }

})(angular);
