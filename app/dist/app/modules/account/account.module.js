(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name coyo.account
   *
   * @description
   * # Account module #
   * The account module contains
   * * custom account modals as a service,
   * * the account settings and
   * * the account notification settings.
   */
  angular
      .module('coyo.account', [
        'coyo.base',
        'coyo.profile',
        'commons.auth',
        'commons.browsernotifications',
        'commons.ui',
        'ngTagsInput'
      ])
      .config(ModuleConfig)
      .constant('accountConfig', {
        templates: {
          main: 'app/modules/account/views/main/account.main.html',
          notifications: 'app/modules/account/views/notifications/account.notifications.html'
        }
      });

  /**
   * Module configuration
   */
  function ModuleConfig($stateProvider, accountConfig) {
    $stateProvider.state('main.account', {
      url: '/account',
      templateUrl: accountConfig.templates.main,
      controller: 'AccountMainController',
      controllerAs: 'vm',
      resolve: {
        currentUser: function (authService) {
          return authService.getUser();
        },
        pushDevices: function (currentUser, pushDevicesService) {
          return pushDevicesService.getPushDevices(currentUser);
        },
        passwordPattern: function (SettingsModel) {
          return SettingsModel.retrieveByKey('passwordPattern');
        }
      },
      data: {
        globalPermissions: 'MANAGE_ACCOUNT_SETTINGS,ACCESS_OWN_USER_PROFILE',
        globalPermissionsRequireAll: true,
        pageTitle: 'MODULE.ACCOUNT.HEADER'
      }
    }).state('main.account-email-activation', {
      url: '/account/email-activation/:token',
      resolve: {
        currentUser: function (authService) {
          return authService.getUser();
        }
      },
      onEnter: function (currentUser, userService, $stateParams, coyoNotification, $timeout, $state) {
        if ($stateParams.token) {
          userService.activateEmail(currentUser, $stateParams.token).then(function () {
            coyoNotification.success('MODULE.ACCOUNT.MODALS.CHANGE_EMAIL_ADDRESS.MESSAGES.SUCCESS');
          }).finally(function () {
            $state.go('main.account');
          });
        }
      },
      data: {
        globalPermissions: 'MANAGE_ACCOUNT_SETTINGS'
      }
    }).state('main.account-notifications', {
      url: '/account/notifications',
      templateUrl: accountConfig.templates.notifications,
      controller: 'AccountNotificationsController',
      controllerAs: '$ctrl',
      resolve: {
        currentUser: function (authService) {
          return authService.getUser();
        },
        notificationSettings: function (currentUser, UserNotificationSettingModel) {
          return UserNotificationSettingModel.query({}, {userId: currentUser.id});
        }
      },
      data: {
        globalPermissions: 'MANAGE_NOTIFICATION_SETTINGS',
        pageTitle: 'MODULE.ACCOUNT.NOTIFICATION_SETTINGS.HEADER'
      }
    });
  }

})(angular);
