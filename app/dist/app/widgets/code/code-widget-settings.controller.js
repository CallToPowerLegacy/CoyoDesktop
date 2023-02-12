(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.code')
      .controller('CodeWidgetSettingsController', CodeWidgetSettingsController);

  function CodeWidgetSettingsController($scope) {
    var vm = this;

    vm.$onInit = onInit;

    var nl = '\n';
    var t = '\t';
    var nlt = nl + t;
    var nltt = nl + t + t;

    function _createPlaceholderHtml() {
      var wrapperStart = '<div class="code-widget-wrapper">';
      var wrapperEnd = '</div>';
      var currUserIdLabel = '<span class="code-widget-current-user-id-label">Current user ID:</span>';
      var currUserId = '<span id="code-widget-current-user-id"></span>';

      return wrapperStart + nlt + currUserIdLabel + nlt + currUserId + nl + wrapperEnd;
    }

    function _getPlaceholderJs() {
      var wrapperStart = '$(function () {';
      var wrapperEnd = '});';
      var authService = 'var authService = angular.element(document.body).injector().get(\'authService\');';
      var getUserWrapperStart = 'authService.getUser().then(function (user) {';
      var getUserWrapperEnd = '});';
      var element = 'var element = angular.element(document.querySelector(\'#code-widget-current-user-id\'));';
      var text = 'element.text(user.id);';

      return wrapperStart + nlt + authService + nlt + getUserWrapperStart + nltt + element + nltt + text + nlt + getUserWrapperEnd + nl + wrapperEnd;
    }

    function getPlaceholderCss() {
      var wrapperStart = '#code-widget-current-user-id {';
      var wrapperEnd = '}';
      var content = 'background-color: #f5b6b6;';

      return wrapperStart + nlt + content + nl + wrapperEnd;
    }

    function onInit() {
      vm.model = $scope.model;
      vm.placeholderHtml = _createPlaceholderHtml();
      vm.placeholderJs = _getPlaceholderJs();
      vm.placeholderCss = getPlaceholderCss();
    }

  }

})(angular);
