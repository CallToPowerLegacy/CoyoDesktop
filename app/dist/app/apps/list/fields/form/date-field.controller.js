(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.list.fields')
      .controller('DateFieldController', DateFieldController);

  function DateFieldController($timeout, $scope) {
    var vm = this;

    vm.$onInit = init;

    function init() {
      $timeout(function () {
        var value = $scope.$parent.model.value;
        if (value) {
          $scope.$parent.model.value = new Date(value);
        }
      });
    }
  }

})(angular);
