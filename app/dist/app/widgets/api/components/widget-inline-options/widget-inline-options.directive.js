(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.api')
      .directive('oyocWidgetInlineOptions', widgetInlineOptions);

  /**
   * @ngdoc directive
   * @name coyo.widgets.api.oyocWidgetInlineOptions:oyocWidgetInlineOptions
   * @element ANY
   * @restrict E
   * @scope
   *
   * @description
   * Directive to render additional widget options in the menu bar.
   * See coyo.widgets.api.widgetRegistry for details on how to configure.
   *
   * @param {object} model
   * The widget model
   *
   * @param {object} config
   * The widget config
   *
   * @requires $compile
   * @requires $templateRequest
   * @requires $controller
   */
  function widgetInlineOptions($compile, $templateRequest, $controller) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        model: '=',
        config: '=',
        widgetScope: '<'
      },
      link: function (scope, element) {
        var templateUrl = _.get(scope, 'config.inlineOptions.templateUrl');
        if (templateUrl) {
          var optionsScope = scope.$new(true);
          if (scope.config.inlineOptions.controller) {
            var controller = scope.config.inlineOptions.controller;
            if (scope.config.inlineOptions.controllerAs) {
              controller += ' as ' + scope.config.inlineOptions.controllerAs;
            }
            $controller(controller, {
              $scope: optionsScope,
              model: scope.model,
              config: scope.config,
              widgetScope: scope.widgetScope
            });
          }
          $templateRequest(templateUrl).then(function (template) {
            element.replaceWith($compile(template)(optionsScope));
          });
        } else {
          // empty element breaks css so remove from dom
          element.remove();
        }
      }
    };
  }

})(angular);
