(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name coyo.admin.settings
   *
   * @description
   * # Admin settings module #
   */
  angular
      .module('coyo.admin.settings', [
        'commons.config'
      ])
      .config(registerStates);

  function registerStates($stateProvider) {
    $stateProvider.state('admin.settings', {
      url: '/settings',
      templateUrl: 'app/modules/admin/settings/admin.settings.html',
      redirect: 'admin.settings.general',
      resolve: {
        settings: function (SettingsModel) {
          return SettingsModel.retrieve();
        }
      },
      data: {
        globalPermissions: 'MANAGE_SETTINGS',
        pageTitle: 'ADMIN.SETTINGS.GENERAL'
      }
    }).state('admin.settings.general', {
      url: '/general',
      views: {
        '@admin.settings': {
          templateUrl: 'app/modules/admin/settings/views/general/admin.general-settings.html',
          controller: 'AdminGeneralSettingsController',
          controllerAs: '$ctrl'
        }
      },
      pageTitle: 'ADMIN.SETTINGS.CATEGORY.GENERAL'
    }).state('admin.settings.registration', {
      url: '/registration',
      views: {
        '@admin.settings': {
          templateUrl: 'app/modules/admin/settings/views/registration/admin.registration-settings.html',
          controller: 'AdminRegistrationSettingsController',
          controllerAs: '$ctrl'
        }
      },
      pageTitle: 'ADMIN.SETTINGS.CATEGORY.REGISTRATION'
    }).state('admin.settings.notification', {
      url: '/notification',
      views: {
        '@admin.settings': {
          templateUrl: 'app/modules/admin/settings/views/notification/admin.notification-settings.html',
          controller: 'AdminNotificationSettingsController',
          controllerAs: '$ctrl'
        }
      }
    }).state('admin.settings.messaging', {
      url: '/messaging',
      views: {
        '@admin.settings': {
          templateUrl: 'app/modules/admin/settings/views/messaging/admin.messaging-settings.html',
          controller: 'AdminMessagingSettingsController',
          controllerAs: '$ctrl'
        }
      }
    }).state('admin.settings.maintenance', {
      url: '/maintenance',
      views: {
        '@admin.settings': {
          templateUrl: 'app/modules/admin/settings/views/maintenance/admin.maintenance-settings.html',
          controller: 'AdminMaintenanceSettingsController',
          controllerAs: '$ctrl'
        }
      }
    });
  }

})(angular);
