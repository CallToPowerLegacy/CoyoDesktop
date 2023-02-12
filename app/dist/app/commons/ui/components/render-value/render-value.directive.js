(function () {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoRenderValue', renderValue);

  /**
   * @ngdoc directive
   * @name commons.ui:ui
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Renders a given value of a field using a template specified by the passed config.
   *
   * @param {object} field
   * The field to render. the field is injected into the templates scope.
   *
   * @param {*} value
   * The value to render of the field. How the value is rendered is specified by the given template.
   *
   * @param {object} config
   * The config object specifying the template and optionally a controller to use for rendering a field with a given
   * type.
   *
   * @param {string} config.templateUrl
   * The url to the template to use for rendering the value.
   *
   * @param {string=} config.controller
   * Name of a controller to use along with the template. The field is automatically injected to the scope of this
   * controller. The controller is available as $ctrl within the template.
   *
   * @requires $compile
   *
   */
  function renderValue($compile) {
    return {
      restrict: 'E',
      scope: {
        field: '<',
        value: '<',
        config: '<'
      },
      link: function (scope, elem) {
        var html;
        if (!scope.config || !scope.config.templateUrl) {
          html = '<div>{{value}}</div>';
        } else {
          html = '<div ng-include="\'' + scope.config.templateUrl + '\'"';
          if (scope.config.controller) {
            html += 'ng-controller="' + scope.config.controller + ' as $ctrl"';
          }
          html += '></div>';
        }
        elem.append($compile(html)(scope));
      }
    };
  }

})();
