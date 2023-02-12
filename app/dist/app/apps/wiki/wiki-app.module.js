(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name coyo.apps.wiki
   *
   * @description
   * # Wiki app module #
   * The wiki app module contains the wiki app objects.
   *
   * @requires coyo.apps.api.appRegistryProvider
   */
  angular
      .module('coyo.apps.wiki', [
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
      name: 'APP.WIKI.NAME',
      description: 'APP.WIKI.DESCRIPTION',
      key: 'wiki',
      icon: 'zmdi-library',
      states: [
        {
          abstract: true,
          templateUrl: 'app/apps/wiki/wiki-frame.html',
          controller: angular.noop,
          controllerAs: 'ctrl'
        },
        {
          name: 'main',
          url: '',
          default: true,
          controller: 'WikiMainController'
        },
        {
          name: 'list',
          url: '/list',
          templateUrl: 'app/apps/wiki/wiki-list.html',
          controller: 'WikiListController',
          controllerAs: 'ctrl',
          resolve: {
            currentUser: /*@ngInject*/ function (authService) {
              return authService.getUser();
            }
          }
        },
        {
          name: 'list.view',
          url: '/view/:id?revision',
          params: {editMode: null},
          views: {
            '@$appRoot': {
              templateUrl: 'app/apps/wiki/wiki-article-view.html',
              controller: 'WikiArticleViewController',
              controllerAs: 'ctrl'
            }
          },
          resolve: {
            currentUser: /*@ngInject*/ function (authService) {
              return authService.getUser();
            },
            editMode: /*@ngInject*/ function ($stateParams) {
              return $stateParams.editMode === true;
            },
            article: /*@ngInject*/ function (WikiArticleModel, app, $stateParams) {
              var context = {
                senderId: app.senderId,
                appId: app.id,
                id: $stateParams.id
              };
              var params = {origin: true};
              if ($stateParams.revision) {
                params.revision = $stateParams.revision;
              }
              return WikiArticleModel.getWithPermissions(context, params, ['edit', 'delete', 'comment']);
            },
            sender: /*@ngInject*/ function (SenderModel, app) {
              return SenderModel.getWithPermissions(app.senderId, {}, ['manage']);
            }
          }
        },
        {
          name: 'list.create',
          url: '/create/?parentId',
          views: {
            '@$appRoot': {
              templateUrl: 'app/apps/wiki/wiki-article-create.html',
              controller: 'WikiArticleCreateController',
              controllerAs: 'ctrl'
            }
          },
          resolve: {
            article: /*@ngInject*/ function (WikiArticleModel, app, currentUser, $stateParams) {
              return WikiArticleModel.fromApp(app, {authorId: currentUser.id, parentId: $stateParams.parentId});
            },
            sender: /*@ngInject*/ function (SenderModel, app) {
              return SenderModel.getWithPermissions(app.senderId, {}, ['manage']);
            }
          }
        }
      ],
      settings: {
        templateUrl: 'app/apps/wiki/wiki-settings.html',
        controller: 'WikiSettingsController',
        controllerAs: 'ctrl'
      }
    });
  }

  function registerTarget(targetServiceProvider) {
    targetServiceProvider.register('wiki-article', /*@ngInject*/ function (params, $state, appRegistry) {
      $state.go(appRegistry.getRootStateName(params.appKey, params.senderType) + '.list.view',
          {idOrSlug: params.senderId, appIdOrSlug: params.appId, id: params.id});
    });
  }

  function configureSearch(coyoConfig) {
    angular.extend(coyoConfig.entityTypes, {
      'wiki-article': {icon: 'library', color: '#999', label: 'ENTITY_TYPE.WIKI_ARTICLE'}
    });
  }

})(angular);
