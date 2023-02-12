(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name coyo.apps.forum
   *
   * @description
   * # Forum app module #
   * The forum app module contains the forum app objects.
   *
   * @requires coyo.apps.api.appRegistryProvider
   */
  angular
      .module('coyo.apps.forum', [
        'coyo.base',
        'coyo.apps.api',
        'commons.config',
        'commons.ui',
        'commons.i18n'
      ])
      .config(registerApp)
      .config(registerTarget)
      .config(configureSearch)
      .constant('forumAppConfig', {
        paging: {
          threads: {
            pageSize: 10
          },
          threadAnswers: {
            pageSize: 10
          }
        },
        endpoints: {
          thread: {
            preview: '/attachments/{{id}}'
          },
          threadAnswer: {
            preview: '/attachments/{{id}}'
          }
        },
        templates: {
          contextMenuList: 'app/apps/forum/templates/forum-thread-list-context-menu.html',
          contextMenuView: 'app/apps/forum/templates/forum-thread-view-context-menu.html',
          contextMenuAnswer: 'app/apps/forum/templates/forum-thread-answer-context-menu.html'
        }
      });

  function registerApp(appRegistryProvider) {
    appRegistryProvider.register({
      name: 'APP.FORUM.NAME',
      description: 'APP.FORUM.DESCRIPTION',
      key: 'forum',
      icon: 'zmdi-help',
      states: [
        {
          abstract: true,
          templateUrl: 'app/apps/forum/forum-frame.html',
          controller: angular.noop,
          controllerAs: '$ctrl'
        },
        {
          name: 'list',
          url: '',
          default: true,
          templateUrl: 'app/apps/forum/forum-thread-list.html',
          controller: 'ForumThreadListController',
          controllerAs: '$ctrl',
          resolve: {
            currentUser: /*@ngInject*/ function (authService) {
              return authService.getUser();
            }
          }
        },
        {
          name: 'list.view',
          url: '/view/:id',
          views: {
            '@$appRoot': {
              templateUrl: 'app/apps/forum/forum-thread-view.html',
              controller: 'ForumThreadViewController',
              controllerAs: '$ctrl'
            }
          },
          resolve: {
            thread: /*@ngInject*/ function (ForumThreadModel, app, $stateParams) {
              var context = {
                senderId: app.senderId,
                appId: app.id,
                id: $stateParams.id
              };
              return ForumThreadModel.getWithPermissions(context, {}, ['close', 'pin', 'delete']);
            }
          }
        },
        {
          name: 'list.create',
          url: '/create',
          views: {
            '@$appRoot': {
              templateUrl: 'app/apps/forum/forum-thread-create.html',
              controller: 'ForumThreadCreateController',
              controllerAs: '$ctrl'
            }
          },
          resolve: {
            thread: /*@ngInject*/ function (ForumThreadModel, app, currentUser) {
              return ForumThreadModel.fromApp(app, {authorId: currentUser.id});
            },
            sender: /*@ngInject*/ function (SenderModel, app) {
              return SenderModel.getWithPermissions(app.senderId, {}, ['manage']);
            }
          }
        }
      ]
    });
  }

  function registerTarget(targetServiceProvider) {
    targetServiceProvider.register('forum-thread', /*@ngInject*/ function (params, $state, appRegistry) {
      $state.go(appRegistry.getRootStateName(params.appKey, params.senderType) + '.list.view',
          {idOrSlug: params.senderId, appIdOrSlug: params.appId, id: params.id});
    });
    targetServiceProvider.register('forum-thread-answer', /*@ngInject*/ function (params, $state, appRegistry) {
      $state.go(appRegistry.getRootStateName(params.appKey, params.senderType) + '.list.view',
          {idOrSlug: params.senderId, appIdOrSlug: params.appId, id: params.threadId});
    });
  }

  function configureSearch(coyoConfig) {
    angular.extend(coyoConfig.entityTypes, {
      'forum-thread': {icon: 'help', color: '#999', label: 'ENTITY_TYPE.FORUM_THREAD'},
      'forum-thread-answer': {icon: 'help', color: '#999', label: 'ENTITY_TYPE.FORUM_THREAD_ANSWER'}
    });
  }

})(angular);
