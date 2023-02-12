(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name commons.auth
   *
   * @description
   * # Authentication module #
   * The authentication module contains authentication-related services and global angular interceptors.
   *
   * @requires $log
   * @requires eventSocket
   * @requires commons.auth.authService
   */
  angular
      .module('commons.auth', [
        'coyo.base',
        'commons.config',
        'commons.error',
        'commons.resource',
        'commons.sockets',
        'commons.browsernotifications',
        'commons.mobile',
        'coyo.domain'
      ])
      .constant('authConfig', {
        routes: {
          login: '/login',
          logout: '/logout',
          i18n: '/i18n'
        }
      })
      .run(registerEventListeners)
      .run(notifyApp);

  function registerEventListeners($rootScope, $log, authService, socketService, browserNotificationsService) {
    $log.debug('[commons.auth::run::registerEventListeners] Registering event listeners...');

    // subscribe to updates of the current user
    socketService.subscribe('/user/topic/updated', function (event) {
      $log.debug('[commons.auth::run] Received a user updated event:', event);
      authService.getUser(true);
    });

    // subscribe on login
    $rootScope.$on('authService:login:success', function () {
      _subscribeToPersonalTimeline($rootScope, $log, authService, socketService, browserNotificationsService);
    });

    // initially subscribe if already logged in
    _subscribeToPersonalTimeline($rootScope, $log, authService, socketService, browserNotificationsService);
  }

  function notifyApp(authService, mobileEventsService) {
    if (authService.isAuthenticated()) {
      mobileEventsService.propagate('authService:login:success');
    }
  }

  function _subscribeToPersonalTimeline($rootScope, $log, authService, socketService, browserNotificationsService) {
    // subscribe to updates of the user's personal timeline
    authService.getUser().then(function (currentUser) {
      if (currentUser.hasGlobalPermissions('ACCESS_PERSONAL_TIMELINE')) {
        var unsubscribeFn = socketService.subscribe('/topic/timeline.personal' + '.' + currentUser.id + '.item.created', function (event) {
          $log.debug('[commons.auth::run] Received a personal timeline \'item created\' event:', event);
          browserNotificationsService.notifyPost(event);
        });
        $rootScope.$on('authService:logout:success', unsubscribeFn);
        $rootScope.$on('authService:logout:failed', unsubscribeFn);
        $rootScope.$on('backendUrlService:url:updated', unsubscribeFn);
        $rootScope.$on('backendUrlService:url:cleared', unsubscribeFn);
      }
    });
  }

})(angular);
