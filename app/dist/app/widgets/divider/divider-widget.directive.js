(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.divider')
      .directive('coyoDividerWidget', coyoDividerWidget);

  /**
   * @ngdoc directive
   * @name coyo.widgets.divider:coyoDividerWidget
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Renders the widget to display a simple divider.
   */
  function coyoDividerWidget() {
    return {
      restrict: 'E',
      templateUrl: 'app/widgets/divider/divider-widget.html',
      scope: {
        widget: '<'
      }
    };
  }

})(angular);
