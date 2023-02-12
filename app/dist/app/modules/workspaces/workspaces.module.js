(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name coyo.workspaces
   *
   * @description
   * Workspaces module
   *
   * @requires $stateProvider
   */
  angular
      .module('coyo.workspaces', [
        'coyo.base',
        'coyo.senders',
        'commons.auth',
        'commons.target'
      ])
      .config(ModuleConfig)
      .config(registerTarget)
      .constant('workspacesConfig', {
        templates: {
          list: 'app/modules/workspaces/views/workspaces.list.html',
          create: 'app/modules/workspaces/views/workspaces.create.html',
          show: 'app/modules/workspaces/views/workspaces.show.html',
          settings: 'app/modules/workspaces/views/workspaces.settings.html',
          members: {
            tabs: 'app/modules/workspaces/views/workspaces.show.members.html',
            list: 'app/modules/workspaces/views/workspaces.show.members.list.html',
            invited: 'app/modules/workspaces/views/workspaces.show.members.invited.html',
            requested: 'app/modules/workspaces/views/workspaces.show.members.requested.html'
          }
        },
        list: {
          paging: {
            pageSize: 20
          }
        },
        members: {
          paging: {
            pageSize: 10
          }
        }
      });

  /**
   * Module configuration
   */
  function ModuleConfig($stateProvider, sendersConfig, workspacesConfig) {
    $stateProvider.state('main.workspace', {
      url: '/workspaces?:term&:categories[]&:status',
      templateUrl: workspacesConfig.templates.list,
      controller: 'WorkspacesListController',
      controllerAs: '$ctrl',
      resolve: {
        currentUser: function (authService) {
          return authService.getUser();
        },
        categories: function (WorkspaceCategoryModel) {
          return WorkspaceCategoryModel.get('all');
        }
      },
      data: {
        guide: 'workspaces',
        globalPermissions: 'ACCESS_WORKSPACES',
        pageTitle: 'MODULE.WORKSPACES.PAGE_TITLE'
      }
    }).state('main.workspace.create', {
      url: '/create',
      views: {
        '@main': {
          templateUrl: workspacesConfig.templates.create,
          controller: 'WorkspacesCreateController',
          controllerAs: '$ctrl'
        }
      },
      resolve: {
        settings: function (SettingsModel) {
          return SettingsModel.retrieve();
        }
      }
    }).state('main.workspace.show', {
      url: '/{idOrSlug}',
      views: {
        '@main': {
          templateUrl: workspacesConfig.templates.show,
          controller: 'WorkspacesShowController',
          controllerAs: '$ctrl'
        }
      },
      data: {
        senderParam: 'idOrSlug',
        pageTitle: false
      },
      resolve: {
        workspace: function (WorkspaceModel, $stateParams) {
          return WorkspaceModel.getWithPermissions({id: $stateParams.idOrSlug}, {},
              ['manage', 'delete', 'manageApps', 'manageSlots', 'canSubscribe', 'createFile']);
        },
        senderId: function (workspace) {
          return workspace.id;
        },
        apps: function (SenderModel, workspace) {
          return new SenderModel({id: workspace.id}).getApps();
        }
      },
      onEnter: function (workspace, titleService) {
        titleService.set(workspace.displayName, false);
      }
    }).state('main.workspace.show.settings', {
      url: '/settings',
      views: {
        '@main': {
          templateUrl: workspacesConfig.templates.settings,
          controller: 'WorkspaceSettingsController',
          controllerAs: '$ctrl'
        }
      }
    }).state('main.workspace.show.members', {
      url: '/members',
      templateUrl: workspacesConfig.templates.members.tabs,
      controller: 'WorkspaceMembersController',
      controllerAs: '$ctrl',
      redirect: 'main.workspace.show.members.list'
    }).state('main.workspace.show.members.list', {
      url: '/list',
      views: {
        '@main.workspace.show.members': {
          templateUrl: workspacesConfig.templates.members.list,
          controller: 'WorkspaceMemberListController',
          controllerAs: '$ctrl'
        }
      }
    }).state('main.workspace.show.members.invited', {
      url: '/invited',
      views: {
        '@main.workspace.show.members': {
          templateUrl: workspacesConfig.templates.members.invited,
          controller: 'WorkspaceMemberInvitedController',
          controllerAs: '$ctrl'
        }
      }
    }).state('main.workspace.show.members.requested', {
      url: '/requested',
      views: {
        '@main.workspace.show.members': {
          templateUrl: workspacesConfig.templates.members.requested,
          controller: 'WorkspaceMemberRequestedController',
          controllerAs: '$ctrl'
        }
      }
    }).state('main.workspace.show.files', {
      url: '/files',
      templateUrl: sendersConfig.templates.files,
      controller: 'SenderFilesController',
      controllerAs: '$ctrl',
      resolve: {
        sender: function (workspace) {
          return workspace;
        }
      }
    });
  }

  function registerTarget(targetServiceProvider) {
    /* register workspace overview */
    targetServiceProvider.register('workspace-list', /*@ngInject*/ function (params, $state) {
      $state.go('main.workspace');
    });

    /* register workspace detail view */
    targetServiceProvider.register('workspace', /*@ngInject*/ function (params, $state) {
      $state.go('main.workspace.show', {idOrSlug: params.slug || params.id}, {reload: true});
    });

    /* register workspace requested view */
    targetServiceProvider.register('workspace-requested', /*@ngInject*/ function (params, $state) {
      $state.go('main.workspace.show.members.requested', {idOrSlug: params.slug || params.id});
    });
  }

})(angular);
