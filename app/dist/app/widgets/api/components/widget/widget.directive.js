(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.api')
      .directive('coyoWidget', widget)
      .controller('WidgetController', WidgetController);

  /**
   * @ngdoc directive
   * @name coyo.widgets.api.coyoWidget:coyoWidget
   * @element ANY
   * @restrict E
   * @scope
   *
   * @description
   * Renders the directive of a widget. The widget itself is injected into the directive and will be available in the
   * scope as `widget`. The directive must be specified within the `widgetConfig`.
   *
   * @param {object} widgetModel
   * The widget itself. This object is injected into the widget's directive.
   *
   * @param {object} widgetConfig
   * The widget's config e.g. specifying the directive to use.
   *
   * @param {Boolean} editMode
   * The widgets slot current state, true for edit, false for show.
   *
   * @param {object} showWidget
   * The parameter to toggle the display of the widget.
   */
  function widget() {
    return {
      restrict: 'E',
      scope: {},
      bindToController: {
        widgetModel: '<',
        widgetConfig: '<',
        editMode: '<',
        showWidget: '=',
        options: '<'
      },
      controller: 'WidgetController',
      controllerAs: '$ctrl'
    };
  }

  function WidgetController($scope, $compile, $element) {
    var vm = this;

    var template = '<' + vm.widgetConfig.directive + ' options="$ctrl.options" widget="$ctrl.widgetModel" show-widget="$ctrl.showWidget" edit-mode="$ctrl.editMode">';
    var element = $compile(template)($scope);
    $element.append(element);
  }

})(angular);
