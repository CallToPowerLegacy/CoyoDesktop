(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.list.fields')
      .controller('FileFieldRenderController', OptionsFieldRenderController);

  function OptionsFieldRenderController(fileDetailsModalService) {
    var vm = this;
    var detailsOpen = false;

    vm.openDetails = openDetails;

    function openDetails(file) {
      if (detailsOpen) {
        return;
      }
      fileDetailsModalService.open(file.senderId, file.id).result.finally(function () {
        detailsOpen = false;
      });
    }
  }

})(angular);
