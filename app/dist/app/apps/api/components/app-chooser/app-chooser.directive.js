(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.api')
      .directive('oyocAppChooser', appChooser);

  /**
   * @ngdoc directive
   * @name coyo.apps.api.oyocAppChooser:oyocAppChooser
   * @restrict E
   * @scope
   *
   * @description
   * Displays a chooser for all aps that are enabled for the given sender type.
   *
   * @param {string} senderType
   * The type of the sender to display all enabled apps for.
   *
   * @requires appRegistry
   * @requires AppModel
   * @requires AppConfigurationModel
   * @requires authService
   */
  function appChooser(appRegistry, AppModel, AppConfigurationModel, authService) {
    return {
      restrict: 'E',
      require: 'ngModel',
      scope: {
        senderType: '@'
      },
      templateUrl: 'app/apps/api/components/app-chooser/app-chooser.html',
      link: function (scope, elem, attrs, ngModelCtrl) {
        scope.loading = true;
        scope.appConfigs = [];

        scope.selectConfig = function (config) {
          ngModelCtrl.$setViewValue(AppModel.fromConfig(config));
        };

        authService.getUser().then(function (user) {
          AppConfigurationModel.getActiveConfigsForSenderType(scope.senderType).then(function (result) {
            scope.appConfigs = _.filter(appRegistry.getAll(), function (config) {
              var appConfig = _.find(result, {key: config.key});
              return angular.isDefined(appConfig) && (!appConfig.moderatorsOnly || user.moderatorMode);
            });
          }).finally(function () {
            scope.loading = false;
          });
        });
      }
    };
  }

})(angular);
