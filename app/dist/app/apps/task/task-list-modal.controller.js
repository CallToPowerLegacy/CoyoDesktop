(function (angular) {
  'use strict';

  angular
      .module('commons.shares')
      .controller('TaskListModalController', TaskListModalController);

  function TaskListModalController(modalService, $state, $uibModalInstance, root, lists, list) {
    var vm = this;

    vm.list = list;

    vm.openColorpicker = openColorpicker;
    vm.deleteList = deleteList;

    // ====================

    function openColorpicker($event) {
      var target = angular.element($event.target);
      var input = target.parent().find('input');
      input.focus();
      input.click();
    }

    function deleteList($event) {
      $event.preventDefault();
      $event.stopImmediatePropagation();

      return modalService.confirm({
        title: 'APP.TASK.LIST.DELETE.MODAL.TITLE',
        text: 'APP.TASK.LIST.DELETE.MODAL.TEXT',
        close: {icon: 'delete', title: 'DELETE', style: 'btn-danger'},
        dismiss: {title: 'CANCEL'}
      }).result.then(function () {
        return list.delete();
      }).then(function () {
        _.remove(lists, {id: list.id});
        if (lists.length) {
          $state.go('.list.details', {id: lists[0].id}, {relative: root});
        } else {
          $state.go('.list', {}, {relative: root});
        }
        $uibModalInstance.dismiss();
      });
    }
  }

})(angular);
