(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoFileDetails', fileDetails)
      .controller('FileDetailsController', FileDetailsController);

  /**
   * @ngdoc directive
   * @name  commons.sender.coyoFileDetails:coyoFileDetails
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Renders a table with file details
   *
   * @param {object} sender
   * The sender the file belongs to
   *
   * @param {object} file
   * The file to be displayed
   *
   * @requires coyo.domain.DocumentModel
   */
  function fileDetails() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/commons/ui/components/file-library/file-details/file-details.html',
      scope: {},
      bindToController: {
        sender: '<',
        file: '<'
      },
      controller: 'FileDetailsController',
      controllerAs: '$ctrl'
    };
  }

  function FileDetailsController(DocumentModel) {
    var vm = this;

    vm.saveDescription = saveDescription;
    vm.resetDescription = resetDescription;

    function saveDescription() {
      return DocumentModel.setDescription(vm.sender.id, vm.file.id, vm.file.description).then(function (document) {
        vm.isEditable = false;
        vm.file = document;
      });
    }

    function resetDescription() {
      vm.isEditable = false;
    }
  }

})(angular);
