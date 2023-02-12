(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.list.fields')
      .controller('FileFieldController', FileFieldController);

  function FileFieldController(SenderModel, $scope) {
    var vm = this;

    vm.$onInit = init;

    function init() {
      vm.fileLibraryOptions = {selectMode: $scope.config.settings.multiple ? 'multiple' : 'single'};

      SenderModel.getWithPermissions($scope.config.senderId, {}, ['manage', 'createFile']).then(function (sender) {
        vm.sender = sender;
      });

    }
  }

})(angular);
