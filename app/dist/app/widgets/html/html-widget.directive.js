(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.html')
      .directive('coyoHtmlWidget', coyoHtmlWidget);

  /**
   * @ngdoc directive
   * @name coyo.widgets.html:coyoHtmlWidget
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Renders the widget to display a rendered html.
   */
  function coyoHtmlWidget() {
    return {
      restrict: 'E',
      templateUrl: 'app/widgets/html/html-widget.html',
      scope: {
        widget: '<'
      }
    };
  }

})(angular);
