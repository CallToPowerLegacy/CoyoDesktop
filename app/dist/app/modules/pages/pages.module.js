(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name coyo.pages
   *
   * @description
   * # Pages module #
   * The pages module renders the pages view and provides various page-related components such as
   * * the page avatar,
   * * the page follow button and
   * * the page name validator.
   */
  angular
      .module('coyo.pages', [
        'coyo.base',
        'coyo.senders',
        'commons.auth'
      ])
      .config(ModuleConfig)
      .constant('pagesConfig', {
        templates: {
          list: 'app/modules/pages/views/pages.list.html',
          show: 'app/modules/pages/views/pages.show.html',
          create: 'app/modules/pages/views/pages.create.html',
          settings: 'app/modules/pages/views/pages.settings.html'
        },
        paging: {
          pageSize: 10
        }
      });

  /**
   * Module configuration
   */
  function ModuleConfig($stateProvider, sendersConfig, pagesConfig) {
    $stateProvider.state('main.page', {
      url: '/pages?:term&:categories[]',
      templateUrl: pagesConfig.templates.list,
      controller: 'PagesListController',
      controllerAs: 'ctrl',
      resolve: {
        currentUser: function (authService) {
          return authService.getUser();
        },
        categories: function (PageCategoryModel) {
          return PageCategoryModel.get('all');
        }
      },
      data: {
        guide: 'pages',
        globalPermissions: 'ACCESS_PAGES',
        pageTitle: 'MODULE.PAGES.PAGE_TITLE'
      }
    }).state('main.page.create', {
      url: '/create',
      views: {
        '@main': {
          templateUrl: pagesConfig.templates.create,
          controller: 'PagesCreateController',
          controllerAs: '$ctrl'
        }
      },
      resolve: {
        settings: function (SettingsModel) {
          return SettingsModel.retrieve();
        }
      },
      data: {
        globalPermissions: 'CREATE_PAGE'
      }
    }).state('main.page.show', {
      url: '/:idOrSlug',
      views: {
        '@main': {
          templateUrl: pagesConfig.templates.show,
          controller: 'PageController',
          controllerAs: '$ctrl'
        }
      },
      data: {
        senderParam: 'idOrSlug',
        pageTitle: false
      },
      resolve: {
        page: function (PageModel, $stateParams, $state, $q) {
          return PageModel.getWithPermissions({id: $stateParams.idOrSlug}, {},
              ['manage', 'delete', 'manageApps', 'manageSlots', 'createFile']).catch(function () {
            $state.go('main.page');
            return $q.reject();
          });
        },
        apps: function (SenderModel, page) {
          var senderModel = new SenderModel({id: page.id});
          return senderModel.getApps();
        },
        senderId: function (page) {
          return page.id;
        }
      },
      onEnter: function (page, titleService) {
        titleService.set(page.displayName, false);
      }
    }).state('main.page.show.settings', {
      url: '/settings',
      views: {
        '@main': {
          templateUrl: pagesConfig.templates.settings,
          controller: 'PageSettingsController',
          controllerAs: '$ctrl'
        }
      },
      resolve: {
        page: function (PageModel, $stateParams, $state) {
          return PageModel.getWithPermissions({id: $stateParams.idOrSlug}, {origin: true}, ['manage', 'delete', 'manageApps', 'manageSlots', 'createFile']).catch(function () {
            $state.go('main.page');
          });
        },
        members: function (page) {
          return page.getMembers();
        }
      }
    }).state('main.page.show.files', {
      url: '/files',
      templateUrl: sendersConfig.templates.files,
      controller: 'SenderFilesController',
      controllerAs: '$ctrl',
      resolve: {
        sender: function (page) {
          return page;
        }
      }
    });
  }

})(angular);
