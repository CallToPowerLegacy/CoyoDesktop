(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.hashtag')
      .controller('HashtagWidgetSettingsController', HashtagWidgetSettingsController);

  function HashtagWidgetSettingsController($scope) {
    if (angular.isUndefined($scope.model.settings.period)) {
      $scope.model.settings.period = 'ONE_MONTH';
    }
  }

})(angular);
