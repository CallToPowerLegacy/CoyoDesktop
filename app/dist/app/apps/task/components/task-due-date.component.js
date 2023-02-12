(function () {
  'use strict';

  angular
      .module('coyo.apps.task')
      .component('oyocTaskDueDate', taskDueDate())
      .controller('TaskDueDateController', TaskDueDateController);

  function taskDueDate() {
    return {
      templateUrl: 'app/apps/task/components/task-due-date.html',
      bindings: {
        task: '<'
      },
      controller: 'TaskDueDateController'
    };
  }

  function TaskDueDateController() {
    var vm = this;

    vm.isDue = false;

    vm.$onInit = onInit;

    function onInit() {
      vm.isDue = vm.task.dueDate ? !vm.task.done && vm.task.dueDate - new Date().getTime() < 0 : false;
    }
  }

})();
