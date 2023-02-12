(function (angular) {
  'use strict';

  angular
      .module('coyo.notifications')
      .factory('notificationsMainService', notificationsMainService);

  /**
   * @ngdoc service
   * @name coyo.notifications.notificationsMainService
   *
   * @description
   * Notifications service to retrieve notification information.
   *
   * @requires $http
   * @requires commons.config.coyoEndpoints
   */
  function notificationsMainService($http, coyoEndpoints, tabNotificationsService) {

    return {
      getNotifications: getNotifications,
      getStatus: getStatus,
      markAllSeen: markAllSeen,
      markClicked: markClicked,
      markAllClicked: markAllClicked
    };

    /**
     * @ngdoc method
     * @name coyo.notifications.notificationsMainService#getNotifications
     * @methodOf coyo.notifications.notificationsMainService
     *
     * @description
     * Retrieves notifications.
     *
     * @param {string} category The category
     * @param {string} page The page
     * @param {string} pageSize The page size
     *
     * @returns {promise} An http promise
     */
    function getNotifications(category, page, pageSize) {
      return $http.get(coyoEndpoints.notification.notifications.replace('{category}', category)
        + '&_page=' + page + '&_pageSize=' + pageSize + '&_orderBy=created,DESC').then(function (response) {
        return response.data;
      });
    }

    /**
     * @ngdoc method
     * @name coyo.notifications.notificationsMainService#getStatus
     * @methodOf coyo.notifications.notificationsMainService
     *
     * @description
     * Retrieves the notification status (e.g. unseen count) for current user.
     *
     * @returns {promise} An http promise
     */
    function getStatus() {
      return $http.get(coyoEndpoints.notification.status).then(function (response) {
        tabNotificationsService.setCounter('notifications-DISCUSSION', response.data.unseen.DISCUSSION);
        tabNotificationsService.setCounter('notifications-ACTIVITY', response.data.unseen.ACTIVITY);
        return response.data;
      });
    }

    /**
     * @ngdoc method
     * @name coyo.notifications.notificationsMainService#markAllSeen
     * @methodOf coyo.notifications.notificationsMainService
     *
     * @description
     * Marks all notifications of given category for current user as seen (sets count = 0).
     *
     * @param {string} category The category
     *
     * @returns {promise} An http promise
     */
    function markAllSeen(category) {
      return $http.put(coyoEndpoints.notification.markAllSeen.replace('{category}', category))
          .then(function (response) {
            tabNotificationsService.resetCounter('notifications-' + category);
            return response.data;
          });
    }

    /**
     * @ngdoc method
     * @name coyo.notifications.notificationsMainService#markClicked
     * @methodOf coyo.notifications.notificationsMainService
     *
     * @description
     * Marks the given notification for current user as clicked.
     *
     * @param {object} notification The notification
     *
     * @returns {promise} An http promise
     */
    function markClicked(notification) {
      return $http.put(coyoEndpoints.notification.update.replace('{id}', notification.id), {clicked: true})
          .then(function (response) {
            return response.data;
          });
    }

    /**
     * @ngdoc method
     * @name coyo.notifications.notificationsMainService#markAllClicked
     * @methodOf coyo.notifications.notificationsMainService
     *
     * @description
     * Marks all notifications of given category for current user as clicked (sets count = 0).
     *
     * @param {string} category The category
     *
     * @returns {promise} An http promise
     */
    function markAllClicked(category) {
      return $http
          .put(coyoEndpoints.notification.markAllClicked.replace('{category}', category))
          .then(function (response) {
            return response.data;
          });
    }
  }

})(angular);
