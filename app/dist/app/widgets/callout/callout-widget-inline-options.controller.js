(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.callout')
      .controller('CalloutWidgetInlineOptionsController', CalloutWidgetInlineOptionsController);

  function CalloutWidgetInlineOptionsController(model, utilService, calloutWidgetStyleOptions) {
    var vm = this;
    vm.model = model;
    vm.options = calloutWidgetStyleOptions;
    vm.menuToggleId = 'callout-menu-' + utilService.uuid();
    vm.selectOption = selectOption;

    function selectOption(option) {
      model.settings._callout = option;
    }
  }
})(angular);
