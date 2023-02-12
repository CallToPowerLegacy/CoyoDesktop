(function (angular) {
  'use strict';

  // eslint-disable-next-line angular/factory-name
  angular
      .module('commons.resource')
      .factory('Pageable', PageableFactory);

  /**
   * @ngdoc service
   * @name commons.resource.Pageable
   *
   * @description
   * Wraps a pageable request
   */
  function PageableFactory() {

    var Pageable = function (page, pageSize, sort, offset) {
      this.page = page || 0;
      this.pageSize = pageSize || 20;
      this.sort = sort || null;
      this.offset = offset || null;
    };

    angular.extend(Pageable.prototype, {

      /**
       * @ngdoc method
       * @name commons.resource.Pageable#getPageSize
       * @methodOf commons.resource.Pageable
       * @instance
       *
       * @description
       * Returns the page size of this request
       *
       * @returns {Number} the page size of this request
       */
      getPageSize: function () {
        return this.pageSize;
      },

      /**
       * @ngdoc method
       * @name commons.resource.Pageable#getPage
       * @methodOf commons.resource.Pageable
       * @instance
       *
       * @description
       * Returns the current page number of this request
       *
       * @returns {Number} the page number of this request
       */
      getPage: function () {
        return this.page;
      },

      /**
       * @ngdoc method
       * @name commons.resource.Pageable#getSort
       * @methodOf commons.resource.Pageable
       * @instance
       *
       * @description
       * Returns the sorting (if set) of this request
       *
       * @returns {string} the set sorting of this request
       */
      getSort: function () {
        return this.sort;
      },

      /**
       * @ngdoc method
       * @name commons.resource.Pageable#getOffset
       * @methodOf commons.resource.Pageable
       * @instance
       *
       * @description
       * Returns the offset of this request
       *
       * @returns {Number} the offset of this request
       */
      getOffset: function () {
        return this.offset;
      },

      /**
       * @ngdoc method
       * @name commons.resource.Pageable#getParams
       * @methodOf commons.resource.Pageable
       * @instance
       *
       * @description
       * Returns all params like '_page', '_pageSize', '_order' and '_offset' as query params with an underscore as
       * prefix. In this form the can be directly added as query params when building an url.
       *
       * @returns {object} all set query params.
       */
      getParams: function () {
        var params = {
          '_page': this.getPage(),
          '_pageSize': this.getPageSize()
        };

        if (this.getSort()) {
          params._orderBy = this.getSort();
        }

        if (this.getOffset()) {
          params._offset = this.getOffset();
        }

        return params;
      }
    });

    return Pageable;
  }

})(angular);
