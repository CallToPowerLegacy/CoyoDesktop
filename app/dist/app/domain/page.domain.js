(function (angular) {
  'use strict';

  angular
      .module('coyo.domain')
      .factory('PageModel', PageModel);

  /**
   * @ngdoc service
   * @name coyo.domain.PageModel
   *
   * @description
   * Provides the Coyo page model.
   *
   * @requires $httpParamSerializer
   * @requires restResourceFactory
   * @requires commons.config.coyoEndpoints
   * @requires commons.resource.Page
   * @requires coyo.domain.UserModel
   */
  function PageModel($httpParamSerializer, restResourceFactory, coyoEndpoints, Page, UserModel) {
    var PageModel = restResourceFactory({
      url: coyoEndpoints.page.pages
    });

    // class members
    angular.extend(PageModel, {

      /**
       * @ngdoc function
       * @name coyo.domain.PageModel#searchWithFilter
       * @methodOf coyo.domain.PageModel
       *
       * @description
       * Page elastic search with filter.
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
        var url = PageModel.$url();
        var params = angular.extend({
          term: term ? term.toLowerCase() : undefined,
          filters: filters ? $httpParamSerializer(filters) : undefined,
          searchFields: searchFields ? searchFields.join(',') : undefined,
          aggregations: aggregations ? $httpParamSerializer(aggregations) : undefined
        }, pageable.getParams());
        return PageModel.$get(url, params).then(function (response) {
          return new Page(response, params, {
            url: url,
            resultMapper: function (item) {
              return new PageModel(item);
            }
          });
        });
      }
    });

    // instance members
    angular.extend(PageModel.prototype, {

      /**
       * @ngdoc function
       * @name coyo.domain.PageModel#getMembers
       * @methodOf coyo.domain.PageModel
       *
       * @description
       * Returns the IDs of the users and groups that are a member of the page.
       *
       * @returns {promise} An $http promise
       */
      getMembers: function () {
        return UserModel.$get(this.$url('members'));
      }
    });

    return PageModel;
  }

})(angular);
