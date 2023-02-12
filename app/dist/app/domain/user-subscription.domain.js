(function (angular) {
  'use strict';

  angular
      .module('coyo.domain')
      .factory('UserSubscriptionModel', UserSubscriptionModel);

  /**
   * @ngdoc service
   * @name coyo.domain.UserSubscriptionModel
   *
   * @description
   * Provides the Coyo subscription model.
   *
   * @requires restResourceFactory
   * @requires restSerializer
   * @requires commons.config.coyoEndpoints
   */
  function UserSubscriptionModel(restResourceFactory, coyoEndpoints, SenderModel, Page, $httpParamSerializer) {
    var UserSubscription = restResourceFactory({
      url: coyoEndpoints.user.subscriptions
    });

    // class members
    angular.extend(UserSubscription, {

      /**
       * @ngdoc function
       * @name coyo.domain.UserSubscriptionModel#searchWithFilter
       * @methodOf coyo.domain.UserSubscriptionModel
       *
       * @description
       * Subscribed sender elastic search with filter.
       *
       * @param {string} userId the user ID
       * @param {string} term search term
       * @param {object} pageable The paging information. If not set an offset of 0 and a page size of 20 will be used.
       * @param {object} [filters] search filters
       * @param {string} [searchFields] list of fields to search in
       * @param {object} [aggregations] search aggregations
       *
       * @returns {promise} An $http promise
       */
      searchWithFilter: function (userId, term, pageable, filters, searchFields, aggregations) {
        var url = UserSubscription.$url({userId: userId}, 'senders');
        var params = angular.extend({
          term: term ? term.toLowerCase() : undefined,
          filters: filters ? $httpParamSerializer(filters) : undefined,
          searchFields: searchFields ? searchFields.join(',') : undefined,
          aggregations: aggregations ? $httpParamSerializer(aggregations) : undefined
        }, pageable.getParams());
        return UserSubscription.$get(url, params).then(function (response) {
          return new Page(response, params, {
            url: url,
            resultMapper: function (item) {
              return new SenderModel(item);
            }
          });
        });
      }
    });

    return UserSubscription;
  }

})(angular);
