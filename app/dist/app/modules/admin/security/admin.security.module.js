(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name coyo.admin.security
   *
   * @description
   * # Admin security module #
   */
  angular
      .module('coyo.admin.security', [
        'commons.config',
        'commons.ui'
      ])
      .config(registerStates);

  function registerStates($stateProvider) {
    $stateProvider.state('admin.security', {
      url: '/security',
      templateUrl: 'app/modules/admin/security/admin.security.html',
      redirect: 'admin.security.bruteForce',
      resolve: {
        settings: function (SettingsModel) {
          return SettingsModel.retrieve();
        }
      },
      data: {
        globalPermissions: 'MANAGE_SECURITY',
        pageTitle: 'ADMIN.SECURITY.BRUTE_FORCE'
      }
    }).state('admin.security.bruteForce', {
      url: '/brute-force',
      views: {
        '@admin.security': {
          templateUrl: 'app/modules/admin/security/views/brute-force/admin.brute-force.html',
          controller: 'AdminBruteForceSecurityController',
          controllerAs: '$ctrl'
        }
      },
      pageTitle: 'ADMIN.SECURITY.CATEGORY.BRUTE_FORCE'
    });
  }

})(angular);
