(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.image')
      .controller('ImageWidgetInlineOptionsController', ImageWidgetInlineOptionsController);

  function ImageWidgetInlineOptionsController(model, imageWidgetSelectionService, widgetScope, $timeout) {
    var vm = this;

    vm.model = model;
    vm.selectImage = selectImage;

    function selectImage() {
      imageWidgetSelectionService.selectImage(vm.model).then(function () {
        $timeout(function () {
          widgetScope.$broadcast('widget:settingsChanged', vm.model);
        });
      });
    }
  }
})(angular);
