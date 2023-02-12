(function () {
  'use strict';

  angular
      .module('coyo.apps.task')
      .component('oyocEditTask', task())
      .controller('EditTaskController', EditTaskController);

  function task() {
    return {
      templateUrl: 'app/apps/task/components/edit-task.html',
      bindings: {
        'task': '=',
        'cancel': '&'
      },
      controller: 'EditTaskController'
    };
  }

  function EditTaskController($rootScope, $scope, UserModel, TaskListModel) {
    var vm = this;

    vm.$onInit = init;
    vm.save = save;

    function init() {
      vm.dateFormat = $rootScope.dateFormat.short
          .replace(new RegExp('D', 'g'), 'd')
          .replace(new RegExp('Y', 'g'), 'y');
      vm.model = angular.copy(vm.task);
      vm.model.dueDate = vm.model.dueDate ? new Date(vm.model.dueDate) : undefined;
      vm.assignee = vm.task.assignee ? [vm.task.assignee.id] : [];
      var unregisterFn = $scope.$watch(function () {
        return vm.assignee;
      }, _loadAssignee, true);
      var unregisterEscFn = $rootScope.$on('keydown:esc', function ($event, jQueryEvent) {
        if (!jQueryEvent.isDefaultPrevented()) {
          vm.cancel;
        }
      });
      $scope.$on('$destroy', unregisterFn);
      $scope.$on('$destroy', unregisterEscFn);

      TaskListModel.getByApp({id: vm.task.appId, senderId: vm.task.senderId}).then(function (result) {
        vm.lists = result;
        vm.newList = _.find(vm.lists, {id: vm.model.listId});
      });
    }

    function _loadAssignee(newValue) {
      if (newValue && !_.isEmpty(newValue)) {
        UserModel.query({userIds: newValue.join()}).then(function (result) {
          vm.model.assignee = result.length && result[0];
        });
      } else {
        delete vm.model.assignee;
      }
    }

    function save() {
      vm.model.newListId = vm.newList ? vm.newList.id : undefined;
      return vm.model.save().then(function (result) {
        var moved = result.listId !== vm.task.listId;
        vm.task = angular.merge(vm.task, result);
        vm.assignee = undefined;
        vm.cancel({moved: moved});
      });
    }
  }

})();
