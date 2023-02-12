(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.task')
      .factory('TaskModel', TaskModel);

  /**
   * @ngdoc service
   * @name coyo.domain.TaskModel
   *
   * @description
   * Provides the Coyo model for a task.
   *
   * @requires coyo.apps.api.appResourceFactory
   */
  function TaskModel(appResourceFactory) {
    var Task = appResourceFactory({
      appKey: 'task',
      url: '/lists/{{listId}}/tasks/{{id}}',
      name: 'task'
    });

    // class members
    angular.extend(Task, {

      fromAppAndTaskList: function (app, taskList) {
        var model = this.fromApp(app);
        model.listId = taskList.id;
        return model;
      },

      getByAppAndTaskList: function (app, taskList) {
        return this.query({}, {
          listId: taskList.id,
          senderId: app.senderId,
          appId: app.id
        });
      },

      /**
       * @ngdoc function
       * @name coyo.domain.TaskModel#order
       * @methodOf coyo.domain.TaskModel
       *
       * @description
       * Sorts the list of tasks based on the given order definition.
       *
       * @param {object} app The corresponding app.
       * @param {string[]} ids The list of task IDs.
       * @returns {promise} An $http promise
       */
      order: function (app, taskList, ids, done) {
        return this.$put(Task.$url({
          senderId: app.senderId,
          appId: app.id,
          listId: taskList.id
        }, 'action/order'), ids, {}, {done: done});
      }
    });

    // instance members
    angular.extend(Task.prototype, {
      type: 'task',
      markDone: function () {
        var url = this.$url('action/done', {
          listId: this.listId,
          senderId: this.senderId,
          appId: this.appId,
          id: this.id
        });
        return this.$put(url);
      },

      markUndone: function () {
        var url = this.$url('action/undone', {
          listId: this.listId,
          senderId: this.senderId,
          appId: this.appId,
          id: this.id
        });
        return this.$put(url);
      }
    });

    return Task;
  }

})(angular);
