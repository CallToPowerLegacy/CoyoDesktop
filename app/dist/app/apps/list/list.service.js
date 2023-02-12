(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.list')
      .factory('listService', listService);

  /**
   * @ngdoc service
   * @name coyo.apps.list.listService
   *
   * @description
   * Service for common functions of the list that must be shared between different controllers
   */
  function listService(ListEntryModel) {

    return {
      createEntry: createEntry,
      initEntries: initEntries,
      initEntry: initEntry,
      getFieldValue: getFieldValue
    };

    /**
     * @ngdoc method
     * @name coyo.apps.list.listService#createEntry
     * @methodOf coyo.apps.list.listService
     *
     * @description
     * Create entry model with missing field values
     *
     * @returns {object}
     * List entry model
     */
    function createEntry() {
      return new ListEntryModel({
        values: []
      });
    }

    /**
     * @ngdoc method
     * @name coyo.apps.list.listService#initEntries
     * @methodOf coyo.apps.list.listService
     *
     * @description
     * Initializes a list of entries with missing field values
     *
     * @param {array} entries
     * List entries array
     *
     * @param {array} fields
     * List fields array
     *
     * @returns {array}
     * Array of initialized entries
     */
    function initEntries(entries, fields) {
      return entries.map(function (entry) {
        return initEntry(entry, fields);
      });
    }

    /**
     * @ngdoc method
     * @name coyo.apps.list.listService#initEntry
     * @methodOf coyo.apps.list.listService
     *
     * @description
     * Initializes an entry with missing field values
     *
     * @param {object} entry
     * List entry
     *
     * @param {array} fields
     * List fields array
     *
     * @returns {object}
     * Initialized entry
     */
    function initEntry(entry, fields) {
      if (_.isEmpty(entry)) {
        entry = createEntry();
      }

      // init field values
      fields.forEach(function (field) {
        var fieldValue = getFieldValue(entry, field.id);
        if (!fieldValue) {
          fieldValue = initFieldValue(field);
          entry.values.push(fieldValue);
        }
      });
      return entry;
    }

    /**
     * @ngdoc method
     * @name coyo.apps.list.listService#initFieldValue
     * @methodOf coyo.apps.list.listService
     *
     * @description
     * Initializes a field value with the fieldId
     *
     * @param {object} field
     * List field
     *
     * @returns {object}
     * Initialized field value
     */
    function initFieldValue(field) {
      return {
        fieldId: field.id,
        value: undefined
      };
    }

    /**
     * @ngdoc method
     * @name coyo.apps.list.listService#getFieldValue
     * @methodOf coyo.apps.list.listService
     *
     * @description
     * Returns a field value for the fieldId from the given entry
     *
     * @param {object} entry
     * List entry
     *
     * @param {string} fieldId
     * Field id
     *
     * @returns {object}
     * Field value
     */
    function getFieldValue(entry, fieldId) {
      return _.find(entry.values, {fieldId: fieldId});
    }

  }
})(angular);
