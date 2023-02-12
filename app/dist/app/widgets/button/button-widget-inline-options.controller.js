(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.button')
      .controller('ButtonWidgetInlineOptionsController', ButtonWidgetInlineOptionsController);

  function ButtonWidgetInlineOptionsController(model, buttonWidgetStyleOptions, utilService) {
    var vm = this;
    vm.model = model;
    vm.options = buttonWidgetStyleOptions;
    vm.menuToggleId = 'button-menu-' + utilService.uuid();
    vm.selectOption = selectOption;

    function selectOption(option) {
      model.settings._button = option;
    }
  }

})(angular);
