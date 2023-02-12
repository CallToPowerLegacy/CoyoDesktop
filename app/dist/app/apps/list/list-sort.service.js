(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.list')
      .factory('listSortService', listSortService);

  /**
   * @ngdoc service
   * @name coyo.apps.list.listSortService
   *
   * @description
   * Service for sorting functions of the list that must be shared between different controllers
   */
  function listSortService(fieldTypeRegistry, $localStorage) {

    var sortConfig = {
      query: 'created',
      dir: 'DESC'
    };

    return {
      updateSortConfig: updateSortConfig,
      getSortConfig: getSortConfig,
      storeSortConfig: storeSortConfig,
      createSortQuery: createSortQuery,
      initSortConfig: initSortConfig
    };


    /**
     * @ngdoc method
     * @name coyo.apps.list.listSortService#updateSortConfig
     * @methodOf coyo.apps.list.listSortService
     *
     * @description
     * Updates the sort config by the given field defining the field to sort by and the sorting direction
     *
     * @param {object} field
     * List Field
     *
     * @returns {object}
     * Sort config
     */
    function updateSortConfig(field) {
      // set sort column
      var fieldType = fieldTypeRegistry.get(field.key);
      var sortDirection = sortConfig.dir;
      var sortedField = sortConfig.field;
      var sortQuery = 'values.' + field.id;
      sortQuery += (fieldType.sortOn) ? '.' + fieldType.sortOn : '';

      // set sort direction
      if (sortedField && sortedField.id === field.id && sortDirection === 'ASC') {
        sortDirection = 'DESC';
      } else if (!sortedField || sortedField.id !== field.id) {
        sortedField = field;
        sortDirection = 'ASC';
      } else {
        sortQuery = 'created';
        sortedField = undefined;
        sortDirection = 'DESC';
      }

      // update sort config
      sortConfig = {
        field: sortedField,
        query: sortQuery,
        dir: sortDirection
      };

      return sortConfig;
    }

    /**
     * @ngdoc method
     * @name coyo.apps.list.listSortService#initSortConfig
     * @methodOf coyo.apps.list.listSortService
     *
     * @description
     * Initializes the sort config. Retrieves config from local storage if it exists. Otherwise it takes the first one from the given field list
     *
     * @param {array} fields
     * List field array
     *
     * @param {string} appId
     * App id
     */
    function initSortConfig(fields, appId) {
      var field = fields[0],
          storedSortConfig = $localStorage['listApp-' + appId + '-sortConfig'];
      if (angular.isUndefined(storedSortConfig) || _.findIndex(fields, function (field) {
        return angular.isDefined(storedSortConfig.field) && field.id === storedSortConfig.field.id;
      }) === -1) {
        updateSortConfig(field);
      } else {
        sortConfig = storedSortConfig;
      }
    }

    /**
     * @ngdoc method
     * @name coyo.apps.list.listSortService#storeSortConfig
     * @methodOf coyo.apps.list.listSortService
     *
     * @description
     * Stores sort config in local storage
     *
     * @param {string} appId
     * App id
     */
    function storeSortConfig(appId) {
      $localStorage['listApp-' + appId + '-sortConfig'] = sortConfig;
    }

    /**
     * @ngdoc method
     * @name coyo.apps.list.listSortService#getSortConfig
     * @methodOf coyo.apps.list.listSortService
     *
     * @description
     * Returns the sort config
     *
     * @returns {Object} Sort config
     */
    function getSortConfig() {
      return sortConfig;
    }

    /**
     * @ngdoc method
     * @name coyo.apps.list.listSortService#createSortQuery
     * @methodOf coyo.apps.list.listSortService
     *
     * @description
     * Creates sort query from sort config
     *
     * @returns {String} Sort query
     */
    function createSortQuery() {
      return sortConfig.query + ',' + sortConfig.dir;
    }

  }
})(angular);
