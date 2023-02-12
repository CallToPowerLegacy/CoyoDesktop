(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.list')
      .factory('ListFieldModel', ListFieldModel);

  /**
   * @ngdoc service
   * @name coyo.apps.list.ListFieldModel
   *
   * @description
   * A model representing a field entity of a list.
   *
   * @requires coyo.apps.api.appResourceFactory
   * @requires $translate
   */
  function ListFieldModel(appResourceFactory, $translate) {
    var ListField = appResourceFactory({
      appKey: 'list',
      url: '/fields/{{id}}',
      name: 'listField'
    });

    // class members
    angular.extend(ListField, {

      /**
       * @ngdoc method
       * @name coyo.apps.list.ListFieldModel#fromConfig
       * @methodOf coyo.apps.list.ListFieldModel
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
        return new ListField({
          key: config.key,
          name: $translate.instant(config.title),
          settings: {}
        });
      },

      /**
       * @ngdoc method
       * @name coyo.apps.list.ListFieldModel#order
       * @methodOf coyo.apps.list.ListFieldModel
       *
       * @description
       * Orders a list of fields based on their (new) priority.
       *
       * @param {string} appId
       * The id of the app the fields are belonging to.
       *
       * @param {string} senderId
       * The id of the sender which is the parent of the app.
       *
       * @param {array} ids
       * The list of field ids representing the new order
       *
       * @returns {object} a promise which resolves to the list of fields in the new order.
       */
      order: function (appId, senderId, ids) {
        var context = {appId: appId, senderId: senderId};
        return ListField.$put(ListField.$url(context, 'action/order'), ids);
      }
    });

    return ListField;
  }

})(angular);
