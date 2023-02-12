(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.headline')
      .component('coyoHeadlineWidget', headlineWidgetDirective())
      .controller('HeadlineWidgetController', HeadlineWidgetController);

  /**
   * @ngdoc directive
   * @name coyo.widgets.headline:coyoHeadlineWidget
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Renders the widget to show a headline in four different sizes.
   *
   * @param {object} widget
   * The widget configuration
   */
  function headlineWidgetDirective() {
    return {
      templateUrl: 'app/widgets/headline/headline-widget.html',
      bindings: {
        widget: '<',
        editMode: '<'
      },
      controller: 'HeadlineWidgetController',
      controllerAs: '$ctrl'
    };
  }

  function HeadlineWidgetController(headlineWidgetSizeOptions) {
    var vm = this;
    vm.headlineKeyDown = headlineKeyDown;

    if (!_.get(vm.widget, 'settings._headline')) {
      _.set(vm.widget, 'settings._headline', headlineWidgetSizeOptions[1]);
    }

    function headlineKeyDown($event) {
      if ($event.keyCode === 13) {
        $event.preventDefault();
      }
    }
  }
})(angular);
