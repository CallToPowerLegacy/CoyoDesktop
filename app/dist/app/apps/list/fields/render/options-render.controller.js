(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.list.fields')
      .controller('OptionsFieldRenderController', OptionsFieldRenderController);

  function OptionsFieldRenderController($scope) {
    var vm = this;

    vm.$onInit = init;

    function init() {
      vm.options = [];
      if (_.isArray($scope.value)) {
        $scope.value.forEach(function (elem) {
          vm.options.push(elem);
        });
      } else {
        vm.options.push($scope.value);
      }
    }
  }

})(angular);
