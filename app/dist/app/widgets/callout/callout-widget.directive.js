(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.callout')
      .directive('coyoCalloutWidget', calloutWidget)
      .controller('CalloutWidgetController', CalloutWidgetController);
  /**
   * @ngdoc directive
   * @name coyo.widgets.callout.coyoCalloutWidget:coyoCalloutWidget
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Renders the widget to display a callout box.
   */
  function calloutWidget() {
    return {
      restrict: 'E',
      templateUrl: 'app/widgets/callout/callout-widget.html',
      scope: {},
      bindToController: {
        widget: '<',
        editMode: '<'
      },
      controller: 'CalloutWidgetController',
      controllerAs: '$ctrl'
    };
  }

  function CalloutWidgetController(calloutWidgetStyleOptions) {
    var vm = this;

    if (!vm.widget.settings._callout) {
      vm.widget.settings._callout = calloutWidgetStyleOptions[0];
    }
  }
})(angular);
