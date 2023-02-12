(function () {
  'use strict';

  /**
   * @ngdoc service
   * @name coyo.apps.task.TaskService
   *
   * @description
   * Service that is responsible for storing the currently active task list.
   */
  angular.module('coyo.apps.task')
      .factory('taskService', TaskService);

  function TaskService() {

    var taskList = undefined;

    return {
      /**
       * @ngdoc overview
       * @name coyo.apps.task.TaskService#setActiveTaskList
       *
       * @description
       * Sets the currently active task list
       *
       * @requires list the task list
       */
      setActiveTaskList: setActiveTaskList,

      /**
       * @ngdoc overview
       * @name coyo.apps.task.TaskService#getActiveTaskList
       *
       * @description
       * Gets the currently active task list
       *
       **/
      getActiveTaskList: getActiveTaskList
    };

    function setActiveTaskList(list) {
      taskList = list;
    }

    function getActiveTaskList() {
      return taskList;
    }
  }
})();
