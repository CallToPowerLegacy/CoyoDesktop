(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.headline')
      .controller('HeadlineWidgetInlineOptionsController', HeadlineWidgetInlineOptionsController);

  function HeadlineWidgetInlineOptionsController($timeout, model, headlineWidgetSizeOptions, utilService) {
    var vm = this;
    vm.model = model;
    vm.options = headlineWidgetSizeOptions;
    vm.menuToggleId = 'headline-menu-' + utilService.uuid();
    vm.selectOption = selectOption;

    function selectOption(option) {
      model.settings.changed = true;
      model.settings._headline = option;
      $timeout(function () {
        model.settings.changed = false;
      });
    }
  }
})(angular);
