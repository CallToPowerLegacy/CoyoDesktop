(function (angular) {
  'use strict';

  angular
      .module('coyo.reports')
      .controller('ReportServiceModalController', ReportServiceModalController);

  function ReportServiceModalController($uibModalInstance) {
    var vm = this;

    vm.$onInit = onInit;
    vm.save = save;

    function save() {
      $uibModalInstance.close({message: vm.message, anonymous: vm.anonymous});
    }

    function onInit() {
      vm.message = '';
      vm.anonymous = false;
    }
  }

})(angular);
