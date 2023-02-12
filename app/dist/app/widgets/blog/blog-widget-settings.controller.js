(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.blog')
      .controller('BlogWidgetSettingsController', BlogWidgetSettingsController);

  function BlogWidgetSettingsController($scope) {
    var settings = $scope.model.settings;
    settings._articleCount = settings._articleCount || 5;
  }

})(angular);
