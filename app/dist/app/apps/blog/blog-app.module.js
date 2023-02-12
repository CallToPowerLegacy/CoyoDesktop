(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name coyo.apps.blog
   *
   * @description
   * # Blog app module #
   * The blog app module contains the Blog app objects.
   *
   * @requires coyo.apps.api.appRegistryProvider
   */
  angular
      .module('coyo.apps.blog', [
        'coyo.base',
        'coyo.apps.api',
        'commons.config',
        'commons.ui',
        'commons.i18n'
      ])
      .config(registerApp)
      .config(registerTarget)
      .config(configureSearch)
      .constant('blogAppConfig', {
        paging: {
          pageSize: 10
        }
      });

  function registerApp(appRegistryProvider) {
    appRegistryProvider.register({
      name: 'APP.BLOG.NAME',
      description: 'APP.BLOG.DESCRIPTION',
      key: 'blog',
      icon: 'zmdi-collection-text',
      states: [
        {
          abstract: true,
          templateUrl: 'app/apps/blog/blog-frame.html',
          controller: 'BlogFrameController',
          controllerAs: 'ctrl'
        },
        {
          name: 'list',
          url: '',
          default: true,
          templateUrl: 'app/apps/blog/blog-list.html',
          controller: 'BlogListController',
          controllerAs: 'ctrl',
          resolve: {
            user: /*@ngInject*/ function (authService) {
              return authService.getUser();
            }
          }
        },
        {
          name: 'list.view',
          url: '/view/:id',
          views: {
            '@$appRoot': {
              templateUrl: 'app/apps/blog/blog-article-view.html',
              controller: 'BlogArticleViewController',
              controllerAs: 'ctrl'
            }
          },
          resolve: {
            article: /*@ngInject*/ function (BlogArticleModel, app, $stateParams) {
              var context = {
                senderId: app.senderId,
                appId: app.id,
                id: $stateParams.id
              };
              return BlogArticleModel.getWithPermissions(context, {}, ['edit', 'delete', 'like', 'comment', 'share']);
            },
            articleContext: /*@ngInject*/ function (article) {
              return article.getContext({
                _orderBy: 'publishDate,created,desc'
              });
            },
            currentUser: /*@ngInject*/ function (authService) {
              return authService.getUser();
            }
          }
        },
        {
          name: 'list.create',
          url: '/create',
          views: {
            '@$appRoot': {
              templateUrl: 'app/apps/blog/blog-article-edit.html',
              controller: 'BlogArticleEditController',
              controllerAs: 'ctrl'
            }
          },
          resolve: {
            article: /*@ngInject*/ function (BlogArticleModel, app, user) {
              return BlogArticleModel.fromApp(app, {authorId: user.id, publishAsAuthor: true});
            },
            sender: /*@ngInject*/ function (SenderModel, app) {
              return SenderModel.getWithPermissions(app.senderId, {}, ['manage', 'createFile']);
            }
          }
        },
        {
          name: 'list.edit',
          url: '/edit/:id',
          views: {
            '@$appRoot': {
              templateUrl: 'app/apps/blog/blog-article-edit.html',
              controller: 'BlogArticleEditController',
              controllerAs: 'ctrl'
            }
          },
          resolve: {
            article: /*@ngInject*/ function (BlogArticleModel, app, $stateParams) {
              var context = {
                senderId: app.senderId,
                appId: app.id,
                id: $stateParams.id
              };
              return BlogArticleModel.getWithPermissions(context, {origin: true}, ['edit', 'delete']);
            },
            sender: /*@ngInject*/ function (SenderModel, app) {
              return SenderModel.getWithPermissions(app.senderId, {}, ['manage', 'createFile']);
            }
          }
        }
      ],
      settings: {
        templateUrl: 'app/apps/blog/blog-settings.html',
        controller: 'BlogSettingsController',
        controllerAs: 'ctrl'
      }
    });
  }

  function registerTarget(targetServiceProvider) {
    targetServiceProvider.register('blog-article', /*@ngInject*/ function (params, $state, appRegistry) {
      $state.go(appRegistry.getRootStateName(params.appKey, params.senderType) + '.list.view',
          {idOrSlug: params.senderId, appIdOrSlug: params.appId, id: params.id});
    });
  }

  function configureSearch(coyoConfig) {
    angular.extend(coyoConfig.entityTypes, {
      'blog-article': {icon: 'collection-text', color: '#999', label: 'ENTITY_TYPE.BLOG_ARTICLE'}
    });
  }

})(angular);
