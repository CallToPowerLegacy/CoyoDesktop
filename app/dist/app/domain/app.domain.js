(function (angular) {
  'use strict';

  angular
      .module('coyo.domain')
      .factory('AppModel', AppModel);

  /**
   * @ngdoc service
   * @name coyo.domain.AppModel
   *
   * @description
   * <p>Domain model representation of app endpoint. Creates an App object with the
   * following properties.</p>
   *
   * <pre>
   *  {string} key;
   *  {string} name;
   *  {string} senderId;
   *  {boolean} active;
   *  {object} settings;
   * </pre>
   *
   * @requires restResourceFactory
   * @requires coyoEndpoints
   */
  function AppModel($rootScope, $translate, restResourceFactory, coyoEndpoints) {
    var App = restResourceFactory({
      url: coyoEndpoints.sender.apps.list
    });

    // class members
    angular.extend(App, {
      fromConfig: function (config) {
        return new App({
          key: config.key,
          name: $translate.instant(config.name),
          active: true,
          settings: {}
        });
      }
    });

    /*
     * Create events for different model actions, so that developers can react on an apps lifecycle. Therefore the
     * default methods for creating, updating and removing are decorated and called after the event was send.
     */
    var _create = App.prototype.create;
    var _update = App.prototype.update;
    var _remove = App.prototype.remove;
    function _onBefore(callback) {
      var eventNames = Array.prototype.slice.call(arguments, 1);
      return function () {
        angular.forEach(eventNames, function (eventName) {
          $rootScope.$emit('app:onBefore' + eventName);
        });
        return callback.apply(this, arguments);
      };
    }

    // instance members
    angular.extend(App.prototype, {
      create: _onBefore(_create, 'Create', 'Save'),
      update: _onBefore(_update, 'Update', 'Save'),
      remove: _onBefore(_remove, 'Remove'),

      /**
       * @ngdoc function
       * @name coyo.domain.AppModel#updateExistingTranslations
       * @methodOf coyo.domain.AppModel
       *
       * @description
       * Updates the translated content settings.
       *
       * @param {Array} languages The array of languages for which translated content exists.
       *
       * @returns {promise} An $http promise
       */
      updateExistingTranslations: function (languages) {
        if (_.isEmpty(languages)) {
          _.unset(this, 'settings._translatedContent');
        } else {
          _.set(this, 'settings._translatedContent', languages);
        }
        return this.update();
      },

      /**
       * @ngdoc function
       * @name coyo.domain.AppModel#getTranslatedContent
       * @methodOf coyo.domain.AppModel
       *
       * @description
       * Gets the languages for which translated content exists.
       *
       * @returns {Array} The array of languages for which translated content exists.
       */
      getTranslatedContent: function () {
        if (_.has(this, 'settings._translatedContent')) {
          return _.get(this, 'settings._translatedContent');
        } else {
          return [];
        }
      }
    });

    return App;
  }

})(angular);
