(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.task')
      .controller('TaskDetailsController', TaskDetailsController);

  function TaskDetailsController($scope, TaskModel, socketService, app, list, modalService) {
    var vm = this;
    vm.app = app;
    vm.list = list;
    vm.doneFilter = {done: true};
    vm.undoneFilter = {done: false};
    vm.$onInit = onInit;
    vm.deleteAllDone = deleteAllDone;
    vm.hasDoneTasks = hasDoneTasks;
    vm.hasUndoneTasks = hasUnDoneTasks;

    function onInit() {
      vm.tasks = [];
      vm.loading = true;
      TaskModel.getByAppAndTaskList(app, list).then(function (result) {
        vm.tasks = result;
      }).finally(function () {
        vm.loading = false;
      });

      var unsubscribeUpserted = socketService
          .subscribe('/topic/app.task.' + app.senderId + '.' + app.id + '.entry.upserted', _taskUpserted);
      $scope.$on('$destroy', unsubscribeUpserted);

      var unsubscribeDeleted = socketService
          .subscribe('/topic/app.task.' + app.senderId + '.' + app.id + '.entry.deleted', _taskDeleted);
      $scope.$on('$destroy', unsubscribeDeleted);
    }

    function deleteAllDone() {
      if (!vm.loading) {
        vm.loading = true;
        modalService.confirm({
          text: 'APP.TASK.DELETE.DONE.CONFIRMATION.TEXT',
          title: 'APP.TASK.DELETE.DONE.CONFIRMATION.TITLE',
          close: {icon: 'delete', title: 'DELETE', style: 'btn-danger'},
          dismiss: {title: 'CANCEL'}
        }).result.then(function () {
          return vm.list.deleteDoneTasks();
        }).then(function () {
          vm.doneTasks = [];
        }).finally(function () {
          vm.loading = false;
        });
      }
    }

    function hasDoneTasks() {
      return _.some(vm.tasks, 'done');
    }

    function hasUnDoneTasks() {
      return _.some(vm.tasks, 'done');
    }

    function _taskUpserted(message) {
      var task = new TaskModel(message.content);
      if (task.listId !== list.id) {
        return;
      }
      var indexOfTask = _.findIndex(vm.tasks, {'id': task.id});
      if (indexOfTask !== -1) {
        vm.tasks[indexOfTask] = task;
      } else {
        vm.tasks.push(task);
      }
      vm.tasks = _.sortBy(vm.tasks, ['priority']);
      $scope.$apply();
    }

    function _taskDeleted(message) {
      var task = new TaskModel(message.content);
      if (task.listId !== list.id) {
        return;
      }
      var indexOfTask = _.findIndex(vm.tasks, {'id': task.id});
      if (indexOfTask !== -1) {
        vm.tasks.splice(indexOfTask, 1);
      }
      $scope.$apply();
    }
  }

})(angular);
