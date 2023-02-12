(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name coyo.admin
   *
   * @description
   * # Admin module #
   * The admin module contains
   * * the user management module.
   * * the app management and widget management module.
   */
  angular
      .module('coyo.admin', [
        'commons.layout',
        'coyo.base',
        'coyo.admin.userManagement',
        'coyo.admin.settings',
        'coyo.admin.apps-widgets',
        'coyo.admin.landingPages',
        'coyo.admin.themes',
        'coyo.admin.multiLanguage',
        'coyo.admin.jobs',
        'coyo.admin.userDirectories',
        'coyo.admin.authenticationProviders',
        'coyo.admin.terms',
        'coyo.admin.apiClients',
        'coyo.admin.security',
        'coyo.admin.launchpad',
        'coyo.admin.statistics'
      ])
      .constant('adminStates', [
        {
          globalPermission: 'MANAGE_USERS_GROUPS_ROLES',
          state: 'admin.user-management'
        },
        {
          globalPermission: 'MANAGE_SETTINGS',
          state: 'admin.settings'
        },
        {
          globalPermission: 'MANAGE_SECURITY',
          state: 'admin.security'
        },
        {
          globalPermission: 'MANAGE_APPS_WIDGETS',
          state: 'admin.apps-widgets'
        },
        {
          globalPermission: 'MANAGE_LANDING_PAGES',
          state: 'admin.landing-pages.list'
        },
        {
          globalPermission: 'MANAGE_THEMES',
          state: 'admin.themes.list'
        },
        {
          globalPermission: 'MANAGE_LANGUAGES',
          state: 'admin.translations'
        },
        {
          globalPermission: 'MANAGE_USER_DIRECTORIES',
          state: 'admin.user-directories.list'
        },
        {
          globalPermission: 'MANAGE_AUTHENTICATION_PROVIDER_CONFIGS',
          state: 'admin.authentication-provider.list'
        },
        {
          globalPermission: 'MANAGE_API_CLIENTS',
          state: 'admin.api-clients.list'
        },
        {
          globalPermission: 'MANAGE_TERMS',
          state: 'admin.terms'
        },
        {
          globalPermission: 'MANAGE_JOBS',
          state: 'admin.jobs.list'
        },
        {
          globalPermission: 'MANAGE_LAUNCHPAD',
          state: 'admin.launchpad.list'
        },
        {
          globalPermission: 'MANAGE_STATISTICS',
          state: 'admin.statistics'
        }
      ])
      .config(configureState);

  function configureState($stateProvider, adminStates) {
    $stateProvider.state('admin', {
      url: '/admin',
      templateUrl: 'app/layout.admin.html',
      data: {
        authenticate: true
      },

      /**
       * Dynamically calculate the admin state to redirect to based on global permissions.
       */
      redirect: /*@ngInject*/ function redirect(authService) {
        return authService.getUser().then(function (currentUser) {
          var redirectState = _.find(adminStates, function (adminState) {
            return currentUser.hasGlobalPermissions(adminState.globalPermission);
          });
          return _.get(redirectState, 'state');
        });
      }
    });
  }

})(angular);
