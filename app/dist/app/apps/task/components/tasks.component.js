(function () {
  'use strict';

  angular
      .module('coyo.apps.task')
      .component('oyocTasksList', tasksList())
      .controller('TasksListController', TasksListController);

  function tasksList() {
    return {
      templateUrl: 'app/apps/task/components/tasks.html',
      controller: 'TasksListController',
      controllerAs: '$ctrl',
      bindings: {
        tasks: '=',
        taskFilter: '<',
        app: '<',
        taskList: '<'
      }
    };
  }

  function TasksListController($timeout, modalService, coyoNotification, $scope, TaskModel) {
    var vm = this;
    vm.$onInit = onInit;

    vm.toggleTask = toggleTask;
    vm.editTask = editTask;
    vm.treeOptions = _buildTreeOptions();
    vm.deleteTask = deleteTask;

    function toggleTask(task) {
      return task.done
        ? task.markDone()
        : task.markUndone();
    }

    function editTask(task) {
      // use timeout so context menu backdrop will close after clicking on "edit"
      $timeout(function () {
        vm.editedTaskId = _.get(task, 'id');
      });
    }

    function deleteTask(task) {
      return modalService.confirm({
        title: 'APP.TASK.DELETE',
        text: 'APP.TASK.DELETE.CONFIRM',
        close: {icon: 'delete', title: 'DELETE', style: 'btn-danger'},
        dismiss: {title: 'CANCEL'}
      }).result.then(function () {
        return task.delete();
      }).then(function () {
        var index = _.findIndex(vm.tasks, {id: task.id});
        if (index > -1) {
          coyoNotification.success('APP.TASK.DELETE.SUCCESS');
          vm.tasks.splice(index, 1);
        }
      });
    }

    function _buildTreeOptions() {
      return {
        dropped: function (event) {
          if (event.source.index !== event.dest.index) {
            _saveOrder();
          }
        },
        accept: function (sourceNodeScope, destNodesScope, destIndex) {
          return destNodesScope.isParent(sourceNodeScope) ||
              _isTaskDroppedOnTasklist(sourceNodeScope, destNodesScope, destIndex);
        },
        beforeDrop: function (event) {
          var index = event.dest.index > 0 ? event.dest.index - 1 : 0;
          if (_isTaskDroppedOnTasklist(event.source.nodeScope, event.dest.nodesScope, index)) {
            _droppedOnTaskList(event.dest.nodesScope.$modelValue[index].id, event.source.nodeScope.$modelValue,
                event.source.index);
            return false;
          } else if (event.dest.nodesScope.isParent(event.source.nodeScope)) {
            return true;
          } else {
            return false;
          }
        },
        dragMove: function (event) {
          if (!event.dest.nodesScope.isParent(event.source.nodeScope) &&
              angular.isDefined(event.elements.placeholder[0])) {
            event.elements.placeholder[0].hidden = true;
          }
        }
      };
    }

    function _saveOrder() {
      var ids = _.map(vm.shownTasks, 'id');
      TaskModel.order(vm.app, vm.taskList, ids, vm.taskFilter.done).then(angular.noop);
    }

    function _droppedOnTaskList(listId, model, sourceIndex) {
      if (listId !== model.listId) {
        model.newListId = listId;
        _.remove(vm.tasks, {id: model.id});
        model.update().then(angular.noop, function () {
          vm.tasks.splice(sourceIndex, 0, model);
        });
      }
    }

    function _isTaskDroppedOnTasklist(sourceNodeScope, destNodesScope, destIndex) {
      return destNodesScope.$modelValue[destIndex] &&
          destNodesScope.$modelValue[destIndex].type === 'task-list' &&
          sourceNodeScope.$modelValue.type === 'task';
    }

    function onInit() {
      var unregisterFn = $scope.$watch(function () {
        return vm.tasks;
      }, _filterTasks, true);
      $scope.$on('$destroy', unregisterFn);

      vm.dragEnabled = vm.app._permissions.manageTask;
    }

    function _filterTasks() {
      vm.shownTasks = _.filter(vm.tasks, vm.taskFilter);
    }
  }
})();
