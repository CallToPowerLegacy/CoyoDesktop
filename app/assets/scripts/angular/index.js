/**
 * COYO Desktop
 * 
 * (c) Copyright 2017 Denis Meyer. All rights reserved.
 */
'use strict';

(function () {
  let electron = require('electron');
  let ipcRenderer = electron.ipcRenderer;

  let logger = require('./logger');
  let constants = require('./constants');

  function bootstrap () {
    logger.logDebug('index', 'bootstrap');

    angular.element(document).ready(() => {
      logger.logWarning('index', 'angular::document.ready', 'registering coyo.desktop module');
      try {
        angular.bootstrap(document.body, ['coyo.desktop']);
      } catch (e) {
        logger.logDebug('index', 'angular::document.ready', 'Already bootstrapped.');
      }
    });

    angular.module('coyo.desktop', ['coyo.app', 'commons.resource']);

    angular.module('coyo.desktop')
        .run(initialize)
        .run(initializeWithTimeout)
        .decorator('$controller', controllerServiceDecorator)
        .decorator('authService', authServiceDecorator)
        .decorator('tourService', tourServiceDecorator)
        .decorator('versionCheckService', versionCheckServiceDecorator)
        .decorator('tabNotificationsService', tabNotificationsServiceDecorator)
        .decorator('browserNotificationsService', browserNotificationsServiceDecorator);

    function initialize($rootScope, $timeout, $state, $http, $window, coyoConfig, backendUrlService, authService,
                        sidebarService, userService) {
      logger.logDebug('index', 'coyo.desktop::initialize');

      // go to 'main' because there is no state mapped to "/index.html"
      $state.go('main');

      function retrieveCoyoVersion(callbackSuccess, callbackError) {
        logger.logDebug('index', 'retrieveCoyoVersion');

        const backendUrl = backendUrlService.getUrl();
        if (backendUrl) {
          $http({
            method: 'GET',
            url: backendUrl + '/manage/info'
          }).then(callbackSuccess, callbackError);
        } else {
          if (callbackError) {
            callbackError();
          }
        }
      }

      function setPresenceStatus(user) {
        if (user) {
          logger.logDebug('setPresenceStatus');
          userService.getPresenceStatus(user, function (status) {
            logger.logDebug('setPresenceStatus', 'Got the current presence status', status);
            if (status && !status.label) {
              status.label = constants.getPresenceStatus();
              user.updatePresenceStatus(status).then(function () {
                logger.logDebug('setPresenceStatus', 'Updated the presence status');
              });
            }
          });
        }
      }

      if (authService.isAuthenticated()) {
        logger.logDebug('index', 'coyo.desktop::initialize', 'is authenticated');

        authService.getUser().then(currentUser => {
          retrieveCoyoVersion((response) => {
            logger.logDebug('index', 'coyo.desktop::initialize', 'isAuthenticated::success');

            ipcRenderer.send('isAuthenticated', coyoConfig, {
              backendUrl: backendUrlService.getUrl(),
              version: _.get(response, 'data.version', undefined),
              user: currentUser
            });
            setPresenceStatus(currentUser);
          }, () => {
            logger.logDebug('index', 'coyo.desktop::initialize', 'isAuthenticated::failed');

            ipcRenderer.send('isAuthenticated', coyoConfig, {
              backendUrl: backendUrlService.getUrl(),
              version: undefined,
              user: currentUser
            });
          });
        });
      } else {
        logger.logDebug('index', 'coyo.desktop::initialize', 'is not authenticated');

        retrieveCoyoVersion((response) => {
          logger.logDebug('index', 'coyo.desktop::initialize', 'isNotAuthenticated::success');

          ipcRenderer.send('isNotAuthenticated', coyoConfig, {
            backendUrl: backendUrlService.getUrl(),
            version: _.get(response, 'data.version', undefined)
          });
        }, () => {
          logger.logDebug('index', 'coyo.desktop::initialize', 'isNotAuthenticated::failed');

          ipcRenderer.send('isNotAuthenticated', coyoConfig, {
            backendUrl: backendUrlService.getUrl(),
            version: undefined
          });
        });
      }

      $rootScope.$on('authService:login:success', () => {
        logger.logDebug('index', 'coyo.desktop::$rootScope:on', 'login:success');

        authService.getUser().then(currentUser => {
          setPresenceStatus(currentUser);
          retrieveCoyoVersion((response) => {
            logger.logDebug('index', 'retrieveCoyoVersion::success');

            ipcRenderer.send('login:success', coyoConfig, {
              backendUrl: backendUrlService.getUrl(),
              version: _.get(response, 'data.version', undefined),
              user: currentUser
            });
          }, () => {
            logger.logDebug('index', 'retrieveCoyoVersion::failed');

            ipcRenderer.send('login:success', coyoConfig, {
              backendUrl: backendUrlService.getUrl(),
              version: undefined,
              user: currentUser
            });
          });
        });
      });

      ipcRenderer.on('open:instance', (e, altUrl) => {
        logger.logDebug('index', 'open:instance');

        let url = backendUrlService.getUrl();
        logger.logDebug('index', 'open:instance', {url: url, altUrl: altUrl});
        if (url || altUrl) {
          electron.shell.openExternal(url ? url : altUrl);
          ipcRenderer.send('opened:external');
        }
      });

      ipcRenderer.on('notification:raise', (e, name, label, icon, sounds, type) => {
        logger.logDebug('index', 'notification:raise');

        let params = {
          body: label ? label : '',
          silent: !sounds
        };
        if (icon) {
          params.icon = icon;
        }
        let notification = new $window.Notification(name ? name : 'COYO', params);

        notification.onclick = () => {
          logger.logDebug('index', 'notification:onclick', type);

          switch (type) {
            case 'notification':
              logger.logDebug('index', 'notification:onclick::notification');

              $rootScope.$emit('show:notifications:ui');
              break;
            case 'post':
              logger.logDebug('index', 'notification:onclick::post');

              $timeout(() => {
                $state.go('front.login'); // $state.go('main'); // TODO: 'main' not working...
              });
              break;
            case 'message':
              logger.logDebug('index', 'notification:onclick::message');

              $timeout(() => {
                sidebarService.open('messaging');
              });
              break;
            default:
              logger.logDebug('index', 'notification:onclick::default');
              break;
          }

          ipcRenderer.send('notification:clicked', type);
        };

        // "Firefox and Safari close notifications automatically after a few moments (around four seconds).
        // This may also happen at the operating system level. Some browsers don't however, such as Chrome."
        // Source: https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API/Using_the_Notifications_API
        $timeout(notification.close.bind(notification), 6500);
      });

      ipcRenderer.on('logout', () => {
        logger.logDebug('index', 'logout');

        $timeout(() => {
          authService.logout();
        });
      });
    }

    function initializeWithTimeout(socketService, notificationsMainService, authService, $timeout,
                                   TimelineItemModel, $rootScope, MessageModel, $interval) {
      $timeout(() => {
        logger.logDebug('index', 'coyo.desktop::initializeWithTimeout');

        let subscriptionCallbacks = [];

        let destroy = () => {
          logger.logDebug('index', 'coyo.desktop::initializeWithTimeout::destroy');

          _.forEach(subscriptionCallbacks, function (callback) {
            logger.logDebug('index', 'coyo.desktop::destroy', callback);

            callback();
          });
          subscriptionCallbacks = [];
        };

        let subscribeTo = (route, func) => {
          logger.logDebug('index', 'coyo.desktop::initializeWithTimeout::subscribeTo', route);

          subscriptionCallbacks.push(socketService.subscribe(route, func));
        };

        let sendNotificationsStatusUpdate = (initial) => {
          logger.logDebug('index', 'coyo.desktop::initializeWithTimeout::sendStatusUpdate', initial);

          authService.getUser().then(currentUser => {
            notificationsMainService.getStatus(currentUser).then(result => {
              logger.logDebug('index', 'coyo.desktop::initializeWithTimeout::sendStatusUpdate::status', result);

              ipcRenderer.send('notifications:statusUpdate', result, !!initial);
            });
          });
        };

        let sendPostsStatusUpdate = (initial) => {
          logger.logDebug('index', 'coyo.desktop::initializeWithTimeout::sendPostsStatusUpdate', initial);

          authService.getUser().then(currentUser => {
            TimelineItemModel.get('new/count', {type: 'personal'}).then(function (count) {
              logger.logDebug('index', 'coyo.desktop::initializeWithTimeout::sendPostsStatusUpdate::new/count', count);

              ipcRenderer.send('posts:statusUpdate', count, !!initial);
            });
          });
        };

        let sendMessagesStatusUpdate = (initial) => {
          logger.logDebug('index', 'coyo.desktop::initializeWithTimeout::sendMessagesStatusUpdate', initial);

          authService.getUser().then(currentUser => {
            MessageModel.getUnreadCount(currentUser.id).then(function (count) {
              logger.logDebug('index', 'coyo.desktop::initializeWithTimeout::sendMessagesStatusUpdate::unreadCount', count);

              ipcRenderer.send('messages:statusUpdate', count.data, !!initial);
            });
          });
        };

        let initNotifications = () => {
          logger.logDebug('index', 'coyo.desktop::initializeWithTimeout::initNotifications');

          subscribeTo('/user/topic/notification', (val) => {
            logger.logDebug('index', 'coyo.desktop::initializeWithTimeout::initMessages', 'notification');
            sendNotificationsStatusUpdate(false);
          });

          sendNotificationsStatusUpdate(true);
        };

        let initPosts = () => {
          logger.logDebug('index', 'coyo.desktop::initializeWithTimeout::initPosts');

          authService.getUser().then(currentUser => {
            subscribeTo('/topic/timeline.personal.' + currentUser.id + '.item.created', (createdItem) => {
              logger.logDebug('index', 'coyo.desktop::initializeWithTimeout::initMessages', 'timeline.personal.' + currentUser.id + '.item.created');

              let contentId = _.get(createdItem, 'content.id', null);
              if (contentId) {
                subscribeTo('/topic/timeline.item.' + contentId, (val) => {
                  sendPostsStatusUpdate(false);
                });
              }

              sendPostsStatusUpdate(false);
            });

            sendPostsStatusUpdate(true);

            subscriptionCallbacks.push($rootScope.$on('currentUser:updated', (event, updatedUser, oldUser) => {
              if (oldUser && updatedUser.lastTimelineRefresh !== oldUser.lastTimelineRefresh) {
                sendPostsStatusUpdate(false);
              }
            }));

            const cancelPostInterval = $interval(() => {
              sendPostsStatusUpdate(false);
            }, constants.getIntervals().refresh.posts);

            subscriptionCallbacks.push(() => $interval.cancel(cancelPostInterval));
          });
        };

        let initMessages = () => {
          logger.logDebug('index', 'coyo.desktop::initializeWithTimeout::initMessages');

          subscribeTo('/user/topic/messaging', () => {
            logger.logDebug('index', 'coyo.desktop::initializeWithTimeout::initMessages', 'messaging');

            sendMessagesStatusUpdate(false);
          });

          sendMessagesStatusUpdate(true);

          const cancelMessageInterval = $interval(() => {
            sendMessagesStatusUpdate(false);
          }, constants.getIntervals().refresh.messages);

          subscriptionCallbacks.push(() => $interval.cancel(cancelMessageInterval));
        };

        let initialize = () => {
          logger.logDebug('index', 'coyo.desktop::initializeWithTimeout::initialize');

          $timeout(() => {
            destroy();

            if (authService.isAuthenticated()) {
              logger.logDebug('index', 'coyo.desktop::initializeWithTimeout::initialize', 'is authenticated');

              initNotifications();
              initPosts();
              initMessages();
            }
          });
        };

        let onLoginSuccess = () => {
          logger.logDebug('index', 'coyo.desktop::initializeWithTimeout::authService:login:success');

          initialize();
        };

        let onLogoutSuccess = () => {
          logger.logDebug('index', 'coyo.desktop::initializeWithTimeout::authService:logout:success');

          initialize();
        };

        let onLogoutFailed = () => {
          logger.logDebug('index', 'coyo.desktop::initializeWithTimeout::authService:logout:failed');

          ipcRenderer.send('logout:failed');
          initialize();
        };

        let registerEvents = () => {
          logger.logDebug('index', 'coyo.desktop::initializeWithTimeout::registerEvents');

          $rootScope.$on('authService:login:success', onLoginSuccess);
          $rootScope.$on('authService:logout:success', onLogoutSuccess);
          $rootScope.$on('authService:logout:failed', onLogoutFailed);
        };

        (function init() {
          logger.logDebug('index', 'coyo.desktop::initializeWithTimeout::init');

          initialize();
          registerEvents();
        })();
      });
    }

    function controllerServiceDecorator($delegate, $timeout, $rootScope) {
      logger.logDebug('index', 'coyo.desktop::controllerServiceDecorator');

      return function (name, args) {
        let ctrl = $delegate.apply($delegate, arguments);
        switch (name) {
          case 'NotificationsDialogController':
            decorateNotificationsDialogController(args, $timeout, $rootScope);
            break;
        }

        return ctrl;
      };
    }

    function decorateNotificationsDialogController(args, $timeout, $rootScope) {
      logger.logDebug('index', 'coyo.desktop::decorateNotificationsDialogController(\'NotificationsDialogController\')');

      let $scope = args.$scope;

      $rootScope.$on('show:notifications:ui', () => {
        logger.logDebug('index', 'coyo.desktop::$rootScope:on', 'show:notifications:ui');

        $scope.$ctrl.show = true;
        $scope.$ctrl.reload();
        $scope.$ctrl.switchCategory($scope.$ctrl.categories[0]);
      });

      $rootScope.$on('hide:notifications:ui', () => {
        logger.logDebug('index', 'coyo.desktop::$rootScope:on', 'hide:notifications:ui');

        $scope.$ctrl.show = false;
      });
    }

    function authServiceDecorator($delegate) {
      logger.logDebug('index', 'coyo.desktop::authServiceDecorator');

      const logout = $delegate.logout;
      $delegate.logout = () => {
        ipcRenderer.send('logout:success');

        if (logout) {
          logout();
        }
      };

      return $delegate;
    }

    // Deactivates the tour
    function tourServiceDecorator($delegate) {
      logger.logDebug('index', 'coyo.desktop::tourServiceDecorator');

      $delegate.init = () => {};
      $delegate.restart = () => {};
      $delegate.isEnabled = () => {
        return {
          then: () => {
            return false;
          }
        };
      };
      $delegate.markVisited = () => {};
      $delegate.registerStep = () => {};
      $delegate.unregisterStep = () => {};
      $delegate.isStepRegistered = () => {
        return true;
      };
      $delegate.getTopics = () => {
        return [];
      };

      return $delegate;
    }

    // Deactivates the version check
    function versionCheckServiceDecorator($delegate, $q) {
      logger.logDebug('index', 'coyo.desktop::versionCheckServiceDecorator');

      $delegate.check = (url) => {
        logger.logDebug('index', 'coyo.desktop::versionCheckServiceDecorator', 'Returning true for URL "' + url + '"');
        return $q.resolve(1);
      };

      return $delegate;
    }

    // Deactivates the tab notifications
    function tabNotificationsServiceDecorator($delegate) {
      logger.logDebug('index', 'coyo.desktop::tabNotificationsServiceDecorator');

      $delegate.setCounter = () => {};
      $delegate.resetCounter = () => {};

      return $delegate;
    }

    function browserNotificationsServiceDecorator($delegate, $q) {
      logger.logDebug('index', 'coyo.desktop::browserNotificationsServiceDecorator');

      $delegate.available = () => {
        return false;
      };
      $delegate.active = (checkActive, checkDiscussion, checkActivity, checkPost, checkMessage) => {
        return $q.resolve(false);
      };
      $delegate.permissionGranted = () => {
        return false;
      };
      $delegate.permissionRequestNeeded = () => {
        return $q.resolve(false);
      };
      $delegate.requestPermission = () => {
        return $q.resolve({
          result: '',
          requested: false
        });
      };
      $delegate.notifyEvent = (event) => {};
      $delegate.notifyPost = (event) => {};
      $delegate.notifyMessage = (event) => {};

      return $delegate;
    }
  }

  (function init() {
    logger.logDebug('index', 'init');

    bootstrap();
  })();
})();
