(function (angular) {
  'use strict';

  angular
      .module('coyo.domain')
      .factory('AppConfigurationModel', AppConfigurationModel);

  /**
   * @ngdoc service
   * @name coyo.domain.AppConfigurationModel
   *
   * @description
   * <p>Domain model representation of app configuration endpoint. Creates an AppConfiguration object with the
   * following properties.</p>
   *
   * <pre>
   *    {String} key;
   *    {object} enabledSenderTypes;
   * </pre>
   *
   * @requires restResourceFactory
   * @requires coyoEndpoints
   */
  function AppConfigurationModel(restResourceFactory, coyoEndpoints) {
    var AppConfiguration = restResourceFactory({
      url: coyoEndpoints.apps.configuration,
      idAttribute: 'key'
    });

    // class members
    angular.extend(AppConfiguration, {

      /**
       * @ngdoc function
       * @name coyo.domain.AppConfigurationModel#getActiveForSender
       * @methodOf coyo.domain.AppConfigurationModel
       *
       * @description
       * Returns the list of app configurations that are active for the given sender type.
       *
       * @returns {promise} An $http promise
       */
      getActiveConfigsForSenderType: function (senderType) {
        return this.$http({
          method: 'GET',
          url: this.$url(),
          params: {
            senderType: senderType
          }
        });
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

    angular.extend(AppConfiguration.prototype, {
      hasEnabledSender: function () {
        if (angular.isUndefined(this.enabledSenderTypes)) {
          return false;
        }

        var enabledSenderTypesValues = _.values(this.enabledSenderTypes, function (value) { return value; });
        return _.some(enabledSenderTypesValues, function (property) { return property === true; });
      }
    });

    return AppConfiguration;
  }

})(angular);
