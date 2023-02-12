(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.button')
      .directive('coyoButtonWidget', buttonWidgetDirective)
      .controller('ButtonWidgetController', ButtonWidgetController);

  /**
   * @ngdoc directive
   * @name coyo.widgets.button:coyoButtonWidget
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Renders the widget to show a button with user input as text / url aswell as a set of options for styling.
   *
   * @param {object} widget
   * The widget configuration
   *
   * @param {boolean} editMode
   * State of the edit mode
   */
  function buttonWidgetDirective() {
    return {
      restrict: 'E',
      templateUrl: 'app/widgets/button/button-widget.html',
      scope: {},
      bindToController: {
        widget: '<',
        editMode: '<'
      },
      controller: 'ButtonWidgetController',
      controllerAs: '$ctrl'
    };
  }

  function ButtonWidgetController() {
    var vm = this;
    vm.onButtonClicked = onButtonClicked;
    vm.getLinkTarget = getLinkTarget;

    function onButtonClicked($event) {
      if (vm.editMode) {
        $event.preventDefault();
      }
    }

    function getLinkTarget(settings) {
      return _(settings).get('_linkTarget', '_blank');
    }
  }

})(angular);
