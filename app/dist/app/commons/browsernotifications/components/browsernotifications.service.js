(function (angular) {
  'use strict';

  angular
      .module('commons.browsernotifications')
      .factory('browserNotificationsService', browserNotificationsService);

  /**
   * @ngdoc service
   * @name commons.browsernotifications.browserNotificationsService
   *
   * @description
   * Provides methods for accessing information and utility methods around browser notifications.
   *
   * @requires $window
   * @requires $q
   * @requires $translate
   * @requires $timeout
   * @requires commons.auth.authService
   * @requires commons.target.targetService
   * @requires commons.resource.backendUrlService
   * @requires commons.markdown.markdownService
   * @requires coyo.domain.UserNotificationSettingModel
   * @requires coyo.domain.TimelineItemModel
   */
  function browserNotificationsService($rootScope, $localStorage, $window, $q, $translate, $timeout,
                                       authService, targetService, backendUrlService, markdownService,
                                       UserNotificationSettingModel, TimelineItemModel) {

    return {
      available: available,
      active: active,
      permissionGranted: permissionGranted,
      permissionRequestNeeded: permissionRequestNeeded,
      requestPermission: requestPermission,
      notifyEvent: notifyEvent,
      notifyPost: notifyPost,
      notifyMessage: notifyMessage
    };

    /**
     * @ngdoc method
     * @name commons.browsernotifications.browserNotificationsService#available
     * @methodOf commons.browsernotifications.browserNotificationsService
     *
     * @description
     * Checks whether browser notifications are supported by the user's browser
     *
     * @return {boolean} True if browser notifications are supported by the user's browser, false else
     */
    function available() {
      return 'Notification' in $window;
    }

    /**
     * @ngdoc method
     * @name commons.browsernotifications.browserNotificationsService#active
     * @methodOf commons.browsernotifications.browserNotificationsService
     *
     * @description
     * Checks whether browser notifications are activated in the account settings.
     *
     * @param {boolean} checkActive Boolean flag whether to check if browser notifications are active as well
     * @param {boolean} checkDiscussion Boolean flag whether to check if browser notifications for discussions are
     *                  active as well
     * @param {boolean} checkActivity Boolean flag whether to check if browser notifications for activities are active
     *                  as well
     * @param {boolean} checkPost Boolean flag whether to check if browser notifications for posts are active as well
     * @param {boolean} checkMessage Boolean flag whether to check if browser notifications for msgs are active as well
     * @return {object} A promise containing the answer (true or false)
     */
    function active(checkActive, checkDiscussion, checkActivity, checkPost, checkMessage) {
      var checkObj = {
        channel: 'BROWSER'
      };

      if (checkActive) {
        _.set(checkObj, 'active', true);
      }
      if (checkDiscussion) {
        _.set(checkObj, 'properties.notifications.discussion', true);
      }
      if (checkActivity) {
        _.set(checkObj, 'properties.notifications.activity', true);
      }
      if (checkPost) {
        _.set(checkObj, 'properties.notifications.post', true);
      }
      if (checkMessage) {
        _.set(checkObj, 'properties.notifications.message', true);
      }

      return _getNotificationSettings().then(function (notificationSettings) {
        return _.filter(notificationSettings, checkObj).length > 0;
      });
    }

    /**
     * @ngdoc method
     * @name commons.browsernotifications.browserNotificationsService#permissionGranted
     * @methodOf commons.browsernotifications.browserNotificationsService
     *
     * @description
     * Checks whether the user has granted/denied permissions for browser notifications
     *
     * @return {boolean} True if the user has granted/denied permissions for browser notifications, false else
     */
    function permissionGranted() {
      return available() && $window.Notification.permission === 'granted';
    }

    /**
     * @ngdoc method
     * @name commons.browsernotifications.browserNotificationsService#permissionRequestNeeded
     * @methodOf commons.browsernotifications.browserNotificationsService
     *
     * @description
     * Checks whether a browser notifications permission request is needed. The answer depends on two facts:
     *   - Have permissions already been granted?
     *   - If not, did the user define in his account notifications that he wants browser notifications?
     *
     * @return {object} A promise containing the answer (true or false)
     */
    function permissionRequestNeeded() {
      if (permissionGranted()) {
        return $q.resolve(false);
      }

      // only check whether browser notifications are generally active here
      return active(true, false, false, false, false);
    }

    /**
     * @ngdoc method
     * @name commons.browsernotifications.browserNotificationsService#requestPermission
     * @methodOf commons.browsernotifications.browserNotificationsService
     *
     * @description
     * Requests for browser notifications permissions
     *
     * @return {object} Promise, resolving to an object containing the notification request result ("result") and
     *                  the information whether permission has been requested or has been granted already ("requested")
     */
    function requestPermission() {
      if (permissionGranted() || !$window.Notification) {
        return $q.resolve({result: 'granted', requested: false});
      }

      return $window.Notification.requestPermission().then(function (result) {
        return {result: result, requested: true};
      });
    }

    /**
     * @ngdoc method
     * @name commons.browsernotifications.browserNotificationsService#requestPermission
     * @methodOf commons.browsernotifications.browserNotificationsService
     *
     * @description
     * Notifies the user via browser notification about a new event if account settings contain browser notifications
     * and browser notifications permissions have been granted.
     */
    function notifyEvent(event) {
      var notification = _.getNullUndefined(event, 'content.notification', {});
      var category = _.getNullUndefined(notification, 'category', '');
      var isDiscussion = category.toLowerCase() === 'discussion';
      var isActivity = category.toLowerCase() === 'activity';
      _doIfActive(isDiscussion, isActivity, false, false, function () {
        $translate(notification.messageKey, notification.messageArguments).then(function (body) {
          var newI18n = 'NEW';
          var categoryI18n = 'NOTIFICATIONS.CATEGORY.' + notification.category;
          $translate([newI18n, categoryI18n]).then(function (translations) {
            var eventTitle = translations[newI18n] + ' ' + translations[categoryI18n];
            var eventBody = _buildEventBody(body, notification);
            var eventIcon = _getIconUrl(notification.author);
            var eventCallback = function () {
              if (notification.target) {
                targetService.go(notification.target);
              }
              this.close();
            };
            _sendNotification(eventTitle, eventBody, eventIcon, eventCallback);
          });
        });
      });
    }

    /**
     * @ngdoc method
     * @name commons.browsernotifications.browserNotificationsService#notifyPost
     * @methodOf commons.browsernotifications.browserNotificationsService
     *
     * @description
     * Notifies the user via browser notification about a new post if account settings contain browser notifications
     * and browser notifications permissions have been granted.
     */
    function notifyPost(event) {
      authService.getUser().then(function (currentUser) {
        TimelineItemModel.get(event.content.id).then(function (item) {
          if (currentUser.id !== _.get(item, 'author.id')) {
            _doIfActive(false, false, true, false, function () {
              var newPostI18n = 'BROWSER.NOTIFICATION.POST.NEW.LABEL';
              var byI18n = 'BY';
              $translate([newPostI18n, byI18n]).then(function (translations) {
                var authorDisplayName = _.get(item, 'author.displayName');
                var postTitle = translations[newPostI18n] + ' ' + translations[byI18n] + ' ' + authorDisplayName;
                var postBody = markdownService.strip(_.getNullUndefined(item, 'data.message', ''));
                var messageIcon = _getIconUrl(item.author);
                var messageCallback = function () {
                  if (item.target) {
                    targetService.go(item.target);
                  }
                  this.close();
                };
                _sendNotification(postTitle, postBody, messageIcon, messageCallback);
              });
            });
          }
        });
      });
    }

    /**
     * @ngdoc method
     * @name commons.browsernotifications.browserNotificationsService#notifyMessage
     * @methodOf commons.browsernotifications.browserNotificationsService
     *
     * @description
     * Notifies the user via browser notification about a new message if account settings contain browser notifications
     * and browser notifications permissions have been granted.
     */
    function notifyMessage(event, channel) {
      authService.getUser().then(function (currentUser) {
        var message = _.getNullUndefined(event, 'content', {});
        if (message.author && currentUser.id !== message.author.id) {
          _doIfActive(false, false, false, true, function () {
            $translate('IN').then(function (translation) {
              var multi = _.getNullUndefined(channel, 'type', 'single').toLowerCase() === 'group';
              var groupInfo = multi ? ' ' + translation + ' \'' + channel.name + '\'' : '';
              var messageTitle = message.author.displayName + groupInfo;
              var messageBody = markdownService.strip(_.getNullUndefined(message, 'data.message', ''));
              var messageIcon = _getIconUrl(message.author);
              var messageCallback = function () {
                if (message.channelId) {
                  targetService.go({
                    name: 'message-channel',
                    params: {
                      id: message.channelId
                    }
                  });
                }
                this.close();
              };
              _sendNotification(messageTitle, messageBody, messageIcon, messageCallback);
            });
          });
        }
      });
    }

    /******************************************************************/

    function _doIfActive(checkDiscussion, checkActivity, checkPost, checkMessage, callback) {
      if (permissionGranted()) {
        active(true, checkDiscussion, checkActivity, checkPost, checkMessage).then(function (isActive) {
          if (isActive) {
            callback();
          }
        });
      }
    }

    function _sendNotification(title, body, icon, callback) {
      if ($rootScope.tabId === $localStorage.activeTabId) {
        var params = {
          body: body
        };
        if (icon) {
          params.icon = icon;
        }
        var n = new $window.Notification(title, params);
        n.onclick = callback;

        // "Firefox and Safari close notifications automatically after a few moments (around four seconds).
        // This may also happen at the operating system level. Some browsers don't however, such as Chrome."
        // Source: https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API/Using_the_Notifications_API
        $timeout(n.close.bind(n), 6500);
      }
    }

    function _getNotificationSettings() {
      return authService.getUser().then(function (currentUser) {
        return UserNotificationSettingModel.query({}, {userId: currentUser.id});
      });
    }

    function _buildEventBody(body, notification) {
      var excerpt = _.getNullUndefined(notification, 'excerpt', '');
      var hasExcerpt = excerpt.length > 0;
      var eventBody = body ? markdownService.strip(body) : '';
      if (hasExcerpt && _.endsWith(eventBody, '.')) {
        eventBody = eventBody.substring(0, eventBody.length - 1);
      }
      return eventBody + (notification.excerpt ? (':\n' + markdownService.strip(excerpt) + '') : '');
    }

    function _getIconUrl(user) {
      if (!user) {
        return null;
      }
      var avatarUrl = _.get(user, 'imageUrls.avatar');
      if (!avatarUrl) {
        return null;
      }
      // Websockets send /api urls -> replace it with /web
      if (_.startsWith(avatarUrl, '/api')) {
        avatarUrl = avatarUrl.replace('/api', '/web');
      }

      return backendUrlService.getUrl() + avatarUrl;
    }

  }

})(angular);
