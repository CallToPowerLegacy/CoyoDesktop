(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.task')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('en', {
          "APP.TASK.CREATE.BUTTON": "Create",
          "APP.TASK.FORM.ASSIGNEE.LABEL": "Assignee",
          "APP.TASK.FORM.TITLE.LABEL": "Task",
          "APP.TASK.FORM.TITLE.PLACEHOLDER": "Create task...",
          "APP.TASK.FORM.DESCRIPTION.LABEL": "Description",
          "APP.TASK.FORM.DUEDATE.LABEL": "Due at",
          "APP.TASK.FORM.TASKLIST.LABEL": "Tasklist",
          "APP.TASK.DESCRIPTION": "Manage tasks for your team, create task lists and add due dates.",
          "APP.TASK.DELETE": "Delete task",
          "APP.TASK.DELETE.CONFIRM": "Do you really want to delete this task?",
          "APP.TASK.DELETE.DONE": "Clear completed tasks",
          "APP.TASK.DELETE.DONE.CONFIRMATION.TITLE": "Remove completed tasks",
          "APP.TASK.DELETE.DONE.CONFIRMATION.TEXT": "Do you really want to delete all completed tasks?",
          "APP.TASK.DELETE.SUCCESS": "The task has been deleted.",
          "APP.TASK.LIST.ADD": "Add list",
          "APP.TASK.LIST.ADD.PLACEHOLDER": "List name",
          "APP.TASK.LIST.DELETE.MODAL.TEXT": "Do you really want to delete this list and all associated tasks?",
          "APP.TASK.LIST.DELETE.MODAL.TITLE": "Delete list",
          "APP.TASK.LIST.MODAL": "Task Lists",
          "APP.TASK.LIST.SETTINGS.MODAL": "List Settings",
          "APP.TASK.LIST.SETTINGS.TITLE": "Name",
          "APP.TASK.LIST.SETTINGS.COLOR": "Color",
          "APP.TASK.LISTS.EMPTY": "No lists found",
          "APP.TASK.MANAGE_LIST": "Manage task lists",
          "APP.TASK.MANAGE_LIST.ADMIN.NAME": "Admins",
          "APP.TASK.MANAGE_LIST.ADMIN.DESCRIPTION": "Only admins can create and manage task lists.",
          "APP.TASK.MANAGE_LIST.VIEWER.NAME": "Everyone",
          "APP.TASK.MANAGE_LIST.VIEWER.DESCRIPTION": "Everyone can create and manage task lists.",
          "APP.TASK.MANAGE_TASKS": "Manage tasks",
          "APP.TASK.MANAGE_TASKS.ADMIN.NAME": "Admins",
          "APP.TASK.MANAGE_TASKS.ADMIN.DESCRIPTION": "Only admins can create and manage tasks.",
          "APP.TASK.MANAGE_TASKS.VIEWER.NAME": "Everyone",
          "APP.TASK.MANAGE_TASKS.VIEWER.DESCRIPTION": "Everyone can create and manage tasks.",
          "APP.TASK.NAME": "Tasks",
          "APP.TASK.TASKS.ASSIGNEE": "Assignee",
          "APP.TASK.TASKS.CONTEXT_MENU.EDIT": "Edit",
          "APP.TASK.TASKS.CONTEXT_MENU.DELETE": "Delete",
          "APP.TASK.TASKS.DUE_DATE": "Due at",
          "APP.TASK.TASKS.EMPTY_LIST": "There are no tasks in this list, yet.",
          "APP.TASK.TASKS.STATUS": "Status",
          "APP.TASK.TASKS.TASK": "Task",
          "APP.TASK.TASKS.DONE": "Completed",
          "ENTITY_TYPE.TASK": "Task",
          "ENTITY_TYPE.TASKS": "Tasks",
          "NOTIFICATIONS.TASKS.USER.ASSIGNED": "*{s1}* has assigned the task *{s2}* to you in *{s3}*.",
          "NOTIFICATIONS.TASKS.USER.UNASSIGNED": "*{s1}* has unassigned you from the task *{s2}* in *{s3}*.",
          "NOTIFICATIONS.TASKS.DUE": "Your task *{s1}* in *{s2}* is due today."
        });
        /* eslint-enable quotes */
      });
})(angular);
