(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.task')
      .controller('TaskListsModalController', TaskListsModalController);

  function TaskListsModalController($state, $timeout, TaskListModel, taskService, modalService, app, root, lists) {
    var vm = this;

    vm.app = app;
    vm.root = root;
    vm.lists = lists;
    vm.formVisible = false;
    vm.treeOptions = _buildTreeOptions();

    vm.showForm = showForm;
    vm.hideForm = hideForm;
    vm.createList = createList;
    vm.openSettings = openSettings;
    vm.isTaskListActive = isTaskListActive;

    // ====================

    function showForm($event) {
      vm.formVisible = true;
      $timeout(function () {
        var target = angular.element($event.currentTarget);
        target.parent().find('input').select();
      });
    }

    function hideForm() {
      vm.formVisible = false;
    }

    function createList() {
      return TaskListModel.fromApp(app, {
        title: vm.listTitle
      }).save().then(function (result) {
        vm.formVisible = false;
        vm.lists.push(result);
        $state.go('.list.details', {id: result.id}, {relative: root});
        return result;
      });
    }

    function openSettings(list, $event) {
      $event.preventDefault();
      $event.stopImmediatePropagation();

      return modalService.open({
        size: 'md',
        templateUrl: 'app/apps/task/task-list.modal.html',
        controller: 'TaskListModalController',
        resolve: {
          root: function () {
            return root;
          },
          lists: function () {
            return lists;
          },
          list: function () {
            return angular.copy(list);
          }
        }
      }).result.then(function (list) {
        return list.save();
      }).then(function (list) {
        if (_.get(taskService.getActiveTaskList(), 'id') === list.id) {
          taskService.setActiveTaskList(list);
        }
        vm.formVisible = false;
        vm.lists.splice(_.findIndex(vm.lists, {id: list.id}), 1, list);
      });
    }

    function isTaskListActive(list) {
      return _.get(taskService.getActiveTaskList(), 'id') === list.id;
    }

    // ====================

    function _buildTreeOptions() {
      return {
        dropped: function (event) {
          // persist new sort order
          if (event.source.index !== event.dest.index) {
            TaskListModel.order(app, _.map(vm.lists, 'id'));
          }
        }
      };
    }
  }

})(angular);
