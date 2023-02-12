(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.list.fields')
      .controller('CheckboxRenderController', CheckboxRenderController);

  function CheckboxRenderController($scope) {
    var vm = this;

    vm.$onInit = init;

    function init() {
      $scope.value = angular.isUndefined($scope.value) ? $scope.field.settings.preselect || false : $scope.value; //eslint-disable-line angular/controller-as
    }
  }

})(angular);
