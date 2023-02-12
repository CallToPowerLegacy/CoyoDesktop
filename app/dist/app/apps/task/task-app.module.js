(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name coyo.apps.task
   *
   * @description
   * # Task app module #
   * The task app module contains the Task app objects.
   *
   * @requires coyo.apps.api.appRegistryProvider
   */
  angular
      .module('coyo.apps.task', [
        'coyo.base',
        'coyo.apps.api',
        'commons.config',
        'commons.ui',
        'commons.i18n'
      ])
      .config(registerApp)
      .config(registerTarget)
      .config(configureSearch);

  function registerApp(appRegistryProvider) {
    appRegistryProvider.register({
      name: 'APP.TASK.NAME',
      description: 'APP.TASK.DESCRIPTION',
      key: 'task',
      icon: 'zmdi-assignment-check',
      states: [{
        abstract: true,
        template: '<ui-view></ui-view>'
      }, {
        name: 'list',
        url: '',
        default: true,
        templateUrl: 'app/apps/task/task-lists.html',
        controller: 'TaskListsController',
        controllerAs: '$ctrl',
        resolve: {
          lists: /*@ngInject*/ function (TaskListModel, app) {
            return TaskListModel.getByApp(app);
          }
        },
        redirectTo: function (transition) {
          var resolvePromise = transition.injector().getAsync('lists');
          return resolvePromise.then(function (lists) {
            if (lists.length && !_.endsWith(transition.to().name, '.details')) {
              var extendedParams = _.clone(transition.params());
              _.set(extendedParams, 'id', lists[0].id);
              return {state: transition.to().name + '.details', params: extendedParams};
            }
            return null;
          }, function () { return null; });
        }
      }, {
        name: 'list.details',
        url: '/:id',
        templateUrl: 'app/apps/task/task-details.html',
        controller: 'TaskDetailsController',
        controllerAs: '$ctrl',
        resolve: {
          list: /*@ngInject*/ function ($stateParams, $q, lists) {
            var list = _.find(lists, {id: $stateParams.id});
            return list ? $q.resolve(list) : $q.reject({status: 404});
          }
        },
        onEnter: /*@ngInject*/ function (taskService, list) {
          taskService.setActiveTaskList(list);
        }
      }],
      settings: {
        templateUrl: 'app/apps/task/task-settings.html',
        controller: 'TaskSettingsController'
      }
    });
  }

  function registerTarget(targetServiceProvider) {
    targetServiceProvider.register('task-list', /*@ngInject*/ function (params, $state, appRegistry) {
      var root = appRegistry.getRootStateName(params.appKey, params.senderType);
      $state.go(root + '.list.details', {
        idOrSlug: params.senderId,
        appIdOrSlug: params.appId,
        id: params.id});
    });
  }

  function configureSearch(coyoConfig) {
    angular.extend(coyoConfig.entityTypes, {
      'task': {icon: 'assignment-check', label: 'ENTITY_TYPE.TASK', plural: 'ENTITY_TYPE.TASKS'}
    });
  }

})(angular);
