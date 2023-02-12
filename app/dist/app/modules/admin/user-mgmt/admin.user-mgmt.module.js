(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name coyo.admin.userManagement
   *
   * @description
   * # Admin user management module #
   * The admin user management module provides views and components to manage user, roles and groups.
   */
  angular
      .module('coyo.admin.userManagement', [
        'coyo.base',
        'commons.auth',
        'coyo.domain'
      ])
      .config(ModuleConfig)
      .constant('adminUserConfig', {
        templates: {
          home: 'app/modules/admin/user-mgmt/admin.user-mgmt.html',
          userList: 'app/modules/admin/user-mgmt/views/user-list/admin.user-list.html',
          userDetails: 'app/modules/admin/user-mgmt/views/user-details/admin.user-details.main.html',
          groupList: 'app/modules/admin/user-mgmt/views/group-list/admin.group-list.html',
          groupDetails: 'app/modules/admin/user-mgmt/views/group-details/admin.group-details.main.html',
          roleList: 'app/modules/admin/user-mgmt/views/role-list/admin.role-list.html',
          roleDetails: 'app/modules/admin/user-mgmt/views/role-details/admin.role-details.main.html'
        }
      });

  /**
   * Module configuration
   */
  function ModuleConfig($stateProvider, adminUserConfig) {
    $stateProvider.state('admin.user-management', {
      url: '/user-management',
      templateUrl: adminUserConfig.templates.home,
      redirect: 'admin.user-management.user',
      data: {
        globalPermissions: 'MANAGE_USERS_GROUPS_ROLES',
        pageTitle: 'ADMIN.MENU.USER_MGMT'
      }
    }).state('admin.user-management.user', {
      url: '/users',
      views: {
        '@admin.user-management': {
          templateUrl: adminUserConfig.templates.userList,
          controller: 'AdminUserListController',
          controllerAs: 'vm'
        }
      },
      resolve: {
        settings: function (SettingsModel) {
          return SettingsModel.retrieve();
        }
      }
    }).state('admin.user-management.user.edit', {
      url: '/edit/{id}',
      views: {
        '@admin.user-management': {
          templateUrl: adminUserConfig.templates.userDetails,
          controller: 'AdminUserDetailsController',
          controllerAs: '$ctrl'
        }
      },
      resolve: {
        user: function (UserModel, $stateParams) {
          return UserModel.query({with: 'adminFields'}, {id: $stateParams.id});
        }
      }
    }).state('admin.user-management.user.create', {
      url: '/create',
      views: {
        '@admin.user-management': {
          templateUrl: adminUserConfig.templates.userDetails,
          controller: 'AdminUserDetailsController',
          controllerAs: '$ctrl'
        }
      },
      resolve: {
        user: function (UserModel) {
          return new UserModel();
        }
      }
    }).state('admin.user-management.roles', {
      url: '/roles',
      views: {
        '@admin.user-management': {
          templateUrl: adminUserConfig.templates.roleList,
          controller: 'AdminRoleListController',
          controllerAs: 'vm'
        }
      }
    }).state('admin.user-management.roles.edit', {
      url: '/edit/{id}',
      views: {
        '@admin.user-management': {
          templateUrl: adminUserConfig.templates.roleDetails,
          controller: 'AdminRoleDetailsController',
          controllerAs: 'vm'
        }
      },
      resolve: {
        role: function (RoleModel, $stateParams) {
          return RoleModel.get($stateParams.id);
        },
        permissionConfiguration: function (RoleModel) {
          return RoleModel.permissionConfiguration();
        }
      }
    }).state('admin.user-management.roles.create', {
      url: '/create',
      views: {
        '@admin.user-management': {
          templateUrl: adminUserConfig.templates.roleDetails,
          controller: 'AdminRoleDetailsController',
          controllerAs: 'vm'
        }
      },
      resolve: {
        role: function (RoleModel) {
          return new RoleModel({permissions: []});
        },
        users: function () {
          return [];
        },
        permissionConfiguration: function (RoleModel) {
          return RoleModel.permissionConfiguration();
        }
      }
    }).state('admin.user-management.groups', {
      url: '/groups',
      views: {
        '@admin.user-management': {
          templateUrl: adminUserConfig.templates.groupList,
          controller: 'AdminGroupListController',
          controllerAs: 'vm'
        }
      }
    }).state('admin.user-management.groups.edit', {
      url: '/edit/{id}',
      views: {
        '@admin.user-management': {
          templateUrl: adminUserConfig.templates.groupDetails,
          controller: 'AdminGroupDetailsController',
          controllerAs: 'vm'
        }
      },
      resolve: {
        group: function (GroupModel, $stateParams) {
          return GroupModel.get($stateParams.id);
        }
      }
    }).state('admin.user-management.groups.create', {
      url: '/create',
      views: {
        '@admin.user-management': {
          templateUrl: adminUserConfig.templates.groupDetails,
          controller: 'AdminGroupDetailsController',
          controllerAs: 'vm'
        }
      },
      resolve: {
        group: function (GroupModel) {
          return new GroupModel({permissions: []});
        },
        users: function () {
          return [];
        }
      }
    });
  }

})(angular);
