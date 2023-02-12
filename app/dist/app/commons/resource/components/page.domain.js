(function (angular) {
  'use strict';

  // eslint-disable-next-line angular/factory-name
  angular
      .module('commons.resource')
      .factory('Page', PageFactory);

  /**
   * @ngdoc service
   * @name commons.resource.Page
   *
   * @description
   * A a page object wraps all information needed for paging through resources.
   *
   * @requires $http
   * @requires $q
   */
  function PageFactory($http, $q) {

    var Page = function (data, queryParams, config) {
      this._queryParams = queryParams;
      this._config = angular.extend({
        resultMapper: function (item) {
          return item;
        }
      }, config);

      this._initFromResponse(data);
    };

    angular.extend(Page.prototype, {

      /**
       * @ngdoc method
       * @name commons.resource.Page#_url
       * @methodOf commons.resource.Page
       * @private
       *
       * @description
       * Returns the url set in the resources configuration.
       *
       * @returns {string} the configured url
       */
      _url: function () {
        var url = this._config.url;

        if (_.isString(url)) {
          return url;
        }
        if (_.isFunction(url)) {
          return url();
        }
        throw new Error('config.url must be set as String or Function.');
      },

      /**
       * @ngdoc method
       * @name commons.resource.Page#_sortParams
       * @methodOf commons.resource.Page
       * @private
       *
       * @description
       * Returns the sort params of this page if set.
       *
       * @returns {string} the sort params of this page
       */
      _sortParams: function () {
        if (this.sorting && _.isArray(this.sorting)) {
          return _(this.sorting).map(function (sort) {
            return sort.property + ',' + (sort.ascending ? 'asc' : 'desc');
          });
        }
        return undefined;
      },

      /**
       * @ngdoc method
       * @name commons.resource.Page#_params
       * @methodOf commons.resource.Page
       * @private
       *
       * @description
       * Returns the query params of this page along with the page number and page size.
       *
       * @returns {string} the query params of this page
       */
      _params: function () {
        var queryParams = (this._queryParams || {});

        var params = {
          '_page': this.number,
          '_pageSize': this.size
        };

        angular.extend(queryParams, params);

        return queryParams;
      },

      /**
       * @ngdoc method
       * @name commons.resource.Page#_initFromResponse
       * @methodOf commons.resource.Page
       * @private
       *
       * @description
       * Initializes the page from a given response
       *
       * @param {object} data
       * The response data
       *
       * @param {boolean} concat
       * Defines whether the given data's content should be concatenated with the already existing content.
       */
      _initFromResponse: function (data, concat) {
        if (concat) {
          this.content = this.content.concat(_.map(data.content, this._config.resultMapper));
        } else {
          this.content = _.map(data.content, this._config.resultMapper);
        }
        this.aggregations = data.aggregations;
        this.totalElements = data.totalElements;
        this.totalPages = data.totalPages;
        this.size = data.size;
        this.number = data.number;
        this.numberOfElements = data.numberOfElements;
        this.first = data.first;
        this.last = data.last;
        this.sorting = data.sort;
        return this;
      },

      /**
       * @ngdoc method
       * @name commons.resource.Page#page
       * @methodOf commons.resource.Page
       *
       * @description
       * Fetches the page with the given number and either adds the new content to the already existing one or
       * overrides it.
       *
       * @param {Number} n
       * The number of the page to fetch.
       *
       * @param {boolean} concat
       * Defines whether the content of the given page should be concatenated with the already existing content.
       *
       * @returns {object} the fetched page
       */
      page: function (n, concat) {
        var queryParams = this._params();

        var params = {
          '_page': n
        };

        concat = concat && n === this.number + 1;

        angular.extend(queryParams, params);

        var page = this;
        page.loading = true;
        return $http.get(this._url(), {params: queryParams}).then(_.bind(function (response) {
          return this._initFromResponse(response.data, concat);
        }, this)).finally(function () {
          page.loading = false;
        });
      },

      /**
       * @ngdoc method
       * @name commons.resource.Page#next
       * @methodOf commons.resource.Page
       *
       * @description
       * Fetches the next page if not the last
       *
       * @returns {object} the fetched page
       */
      next: function () {
        if (this.content.length === 0 || this.last || this.loading) {
          return $q.reject();
        }
        return this.page(this.number + 1);
      },

      /**
       * @ngdoc method
       * @name commons.resource.Page#nextAppended
       * @methodOf commons.resource.Page
       *
       * @description
       * Fetches the next page if not the last and appends its content to the current page.
       *
       * @returns {object} the fetched content
       */
      nextAppended: function () {
        if (this.content.length === 0 || this.last || this.loading) {
          return $q.reject();
        }
        return this.page(this.number + 1, true);
      },

      /**
       * @ngdoc method
       * @name commons.resource.Page#prev
       * @methodOf commons.resource.Page
       *
       * @description
       * Fetches the previous page if not the first
       *
       * @returns {object} the fetched page
       */
      prev: function () {
        if (this.content.length === 0 || this.first || this.loading) {
          return $q.reject();
        }
        return this.page(this.number - 1);
      },

      /**
       * @ngdoc method
       * @name commons.resource.Page#sort
       * @methodOf commons.resource.Page
       *
       * @description
       * Fetches the current page sorted
       *
       * @returns {object} the fetched page
       */
      sort: function (sort) {
        var queryParams = this._params();

        var params = {
          '_orderBy': sort
        };

        angular.extend(queryParams, params);

        return $http.get(this._url(), {params: queryParams}).then(_.bind(function (response) {
          return this._initFromResponse(response.data);
        }, this));
      }
    });

    return Page;
  }

})(angular);
