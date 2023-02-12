(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.task')
      .factory('TaskListModel', TaskListModel);

  /**
   * @ngdoc service
   * @name coyo.domain.TaskListModel
   *
   * @description
   * Provides the Coyo model for a task list.
   *
   * @requires coyo.apps.api.appResourceFactory
   */
  function TaskListModel(appResourceFactory) {
    var TaskList = appResourceFactory({
      appKey: 'task',
      url: '/lists/{{id}}',
      name: 'taskList'
    });

    // class members
    angular.extend(TaskList, {

      /**
       * @ngdoc function
       * @name coyo.domain.TaskListModel#getByApp
       * @methodOf coyo.domain.TaskListModel
       *
       * @description
       * Retrieves a list of task lists by their app.
       *
       * @param {object} app The corresponding app.
       * @returns {promise} An $http promise
       */
      getByApp: function (app) {
        return TaskList.query({}, {
          senderId: app.senderId,
          appId: app.id
        });
      },

      /**
       * @ngdoc function
       * @name coyo.domain.TaskListModel#order
       * @methodOf coyo.domain.TaskListModel
       *
       * @description
       * Sorts the list of task lists based on the given order definition.
       *
       * @param {object} app The corresponding app.
       * @param {string[]} ids The list of task list IDs.
       * @returns {promise} An $http promise
       */
      order: function (app, ids) {
        return TaskList.$put(TaskList.$url({
          senderId: app.senderId,
          appId: app.id
        }, 'action/order'), ids);
      }
    });

    // instance members
    angular.extend(TaskList.prototype, {
      type: 'task-list',

      /**
       * @ngdoc function
       * @name coyo.domain.TaskListModel#deleteDoneTasks
       * @methodOf coyo.domain.TaskListModel
       *
       * @description
       * Deletes all done tasks of this list.
       *
       * @returns {promise} An $http promise
       */
      deleteDoneTasks: function () {
        var url = this.$url('tasks');
        return this.$delete(url);
      }
    });

    return TaskList;
  }

})(angular);
