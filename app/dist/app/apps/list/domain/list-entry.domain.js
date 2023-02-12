(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.list')
      .factory('ListEntryModel', ListEntryModel);

  /**
   * @ngdoc service
   * @name coyo.apps.list.ListEntryModel
   *
   * @description
   * A model representing a field entity of a list.
   *
   * @requires coyo.apps.api.appResourceFactory
   * @requires $translate
   */
  function ListEntryModel(appResourceFactory, $translate) {
    var ListEntry = appResourceFactory({
      appKey: 'list',
      url: '/entries/{{id}}',
      name: 'listField'
    });

    // class members
    angular.extend(ListEntry, {

      /**
       * @ngdoc method
       * @name coyo.apps.list.ListEntryModel#fromConfig
       * @methodOf coyo.apps.list.ListEntryModel
       *
       * @description
       * Creates and returns a new entity based on it's configuration
       *
       * @param {object} config
       * The configuration (field type) of a list field, which is used to create a new one.
       *
       * @returns {object} a newly created list field entity (which is not yet persisted).
       */
      fromConfig: function (config) {
        return new ListEntry({
          key: config.key,
          name: $translate.instant(config.title),
          settings: {}
        });
      },

      updateValue: function (context, fieldValue) {
        var url = this.$url(context, '/value');
        return this.$put(url, fieldValue);
      }
    });

    return ListEntry;
  }

})(angular);
