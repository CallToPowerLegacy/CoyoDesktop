(function (angular) {
  'use strict';

  angular
      .module('coyo.domain')
      .factory('WidgetConfigurationModel', WidgetConfigurationModel);

  /**
   * @ngdoc service
   * @name coyo.domain.WidgetConfigurationModel
   *
   * @description
   * Domain model representation of widget configuration endpoint.
   *
   * @requires restResourceFactory
   * @requires restSerializer
   * @requires coyoEndpoints
   */
  function WidgetConfigurationModel(restResourceFactory, coyoEndpoints) {
    var WidgetConfiguration = restResourceFactory({
      url: coyoEndpoints.widgetConfigurations,
      idAttribute: 'key'
    });

    // class members
    angular.extend(WidgetConfiguration, {
      enable: function (key) {
        return this.$put(this.$url({
          key: key
        }, 'activate'));
      },
      disable: function (key) {
        return this.$put(this.$url({
          key: key
        }, 'deactivate'));
      },
      restrict: function (key) {
        return this.$put(this.$url({
          key: key
        }, 'restrict'));
      },
      derestrict: function (key) {
        return this.$put(this.$url({
          key: key
        }, 'derestrict'));
      }
    });

    return WidgetConfiguration;
  }

})(angular);
