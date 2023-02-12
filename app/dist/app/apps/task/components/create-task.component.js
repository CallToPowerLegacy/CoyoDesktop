(function () {
  'use strict';

  angular
      .module('coyo.apps.task')
      .component('oyocCreateTask', createTask())
      .controller('CreateTaskController', CreateTaskController);

  function createTask() {
    return {
      templateUrl: 'app/apps/task/components/create-task.html',
      bindings: {
        app: '<',
        taskList: '<',
        tasks: '='
      },
      controller: 'CreateTaskController',
      controllerAs: '$ctrl'
    };
  }

  function CreateTaskController($rootScope, $q, $scope, UserModel, TaskModel) {
    var vm = this;

    vm.focusTaskTitle = false;

    vm.createTask = createTask;
    vm.titleChanged = titleChanged;
    vm.$onInit = onInit;

    function onInit() {
      vm.task = {};
      vm.dateFormat = $rootScope.dateFormat.short
          .replace(new RegExp('D', 'g'), 'd')
          .replace(new RegExp('Y', 'g'), 'y');

      var unregisterFn = $scope.$watch(function () {
        return vm.assignee;
      }, _loadAssignee, true);
      var unregisterEscFn = $rootScope.$on('keydown:esc', function ($event, jQueryEvent) {
        if (!jQueryEvent.isDefaultPrevented()) {
          vm.task = {};
          vm.showAdvanced = false;
          vm.assignee = undefined;
          $scope.$apply();
        }
      });
      $scope.$on('$destroy', unregisterFn);
      $scope.$on('$destroy', unregisterEscFn);
    }

    function _loadAssignee(newValue) {
      if (newValue && !_.isEmpty(newValue)) {
        UserModel.query({userIds: newValue.join()}).then(function (result) {
          vm.task.assignee = result.length && result[0];
        });
      } else {
        delete vm.task.assignee;
      }
    }

    function createTask(task) {
      vm.focusTaskTitle = false;
      var model = TaskModel.fromAppAndTaskList(vm.app, vm.taskList);
      angular.merge(model, task);
      return model.save().then(function () {
        vm.task = {};
        vm.showAdvanced = false;
        vm.focusTaskTitle = true;
        vm.assignee = undefined;
      });
    }

    function titleChanged(title) {
      vm.showAdvanced = !!title;
    }
  }

})();
