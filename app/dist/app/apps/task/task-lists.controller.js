(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.task')
      .controller('TaskListsController', TaskListsController);

  function TaskListsController($rootScope, $scope, $state, $timeout, taskService, TaskListModel, modalService,
                               socketService, appRegistry, app, lists) {
    var vm = this;
    var root = appRegistry.getRootStateName(app.key, app.senderType);

    vm.app = app;
    vm.lists = lists;
    vm.formVisible = false;
    vm.treeOptions = _buildTreeOptions();

    vm.selectList = selectList;
    vm.showForm = showForm;
    vm.hideForm = hideForm;
    vm.createList = createList;
    vm.editList = editList;
    vm.$onInit = _onInit;
    vm.getActiveList = taskService.getActiveTaskList;

    // ====================

    function selectList() {
      return modalService.open({
        size: 'md',
        templateUrl: 'app/apps/task/task-lists.modal.html',
        controller: 'TaskListsModalController',
        resolve: {
          app: function () {
            return app;
          },
          root: function () {
            return root;
          },
          lists: function () {
            return lists;
          }
        }
      });
    }

    function showForm($event) {
      vm.formVisible = true;
      $timeout(function () {
        var target = angular.element($event.currentTarget);
        target.parent().find('input').select();
      });
    }

    function hideForm() {
      vm.formVisible = false;
      vm.listTitle = '';
    }

    function createList() {
      return TaskListModel.fromApp(app, {
        title: vm.listTitle
      }).save().then(function (result) {
        hideForm();
        vm.lists.push(result);
        $state.go('.list.details', {id: result.id}, {relative: root});
        return result;
      });
    }

    function editList(list, $event) {
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
        vm.lists.splice(_.findIndex(vm.lists, {id: list.id}), 1, list);
      });
    }

    // ====================

    function _buildTreeOptions() {
      return {
        dropped: function () {
          // persist new sort order
          TaskListModel.order(app, _.map(vm.lists, 'id'));
        },
        accept: function (sourceNodeScope, destNodesScope) {
          return sourceNodeScope.$modelValue.type === 'task' ||
              destNodesScope.isParent(sourceNodeScope);
        },
        beforeDrop: function (event) {
          return event.dest.nodesScope.isParent(event.source.nodeScope) && event.source.index !== event.dest.index;
        }
      };
    }

    function _onInit() {
      // register websocket events
      var topicList = '/topic/app.task.' + app.senderId + '.' + app.id + '.list.updated';
      var unsubscribeListFn = socketService.subscribe(topicList, _taskListUpdated);

      // register ESC callback
      var unsubscribeEscFn = $rootScope.$on('keyup:esc', hideForm);

      // unregister callbacks on $scope death
      $scope.$on('$destroy', unsubscribeListFn);
      $scope.$on('$destroy', unsubscribeEscFn);
    }

    function _taskListUpdated(message) {
      var taskList = new TaskListModel(message.content);
      var index = _.findIndex(lists, {'id': taskList.id});
      if (index !== -1) {
        lists[index] = angular.merge(lists[index], taskList);
        $scope.$apply();
      }
    }
  }
})(angular);
