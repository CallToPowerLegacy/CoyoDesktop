(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.iframe')
      .component('coyoIframeWidget', iframeWidget())
      .controller('IframeWidgetController', IframeWidgetController);

  /**
   * @ngdoc directive
   * @name coyo.widgets.iframe:coyoIframeWidget
   * @restrict 'E'
   *
   * @description
   * Renders a iframe widget.
   *
   * @param {object} widget
   * The widget configuration
   */
  function iframeWidget() {
    return {
      templateUrl: 'app/widgets/iframe/iframe-widget.html',
      scope: {},
      bindings: {
        widget: '=',
        editMode: '<'
      },
      controller: 'IframeWidgetController',
      controllerAs: '$ctrl'
    };
  }

  function IframeWidgetController($scope, $element, $compile) {
    var vm = this;

    $scope.$watch(function () {
      return vm.widget.settings.scrolling;
    }, function () {
      vm.scrolling = vm.widget.settings.scrolling ? 'yes' : 'no';
      $compile($element.contents())($scope);
    });
  }
})(angular);
