(function (angular) {
  'use strict';

  angular
      .module('commons.browsernotifications')
      .factory('tabNotificationsService', tabNotificationsService);

  /**
   * @ngdoc service
   * @name commons.browsernotifications.tabNotificationsService
   *
   * @description
   * Provides methods for notifications in the current browser tab, for example sounds.
   *
   * @requires anTinycon
   * @requires ngAudio
   * @requires $timeout
   * @requires commons.auth.authService
   * @requires coyo.domain.UserNotificationSettingModel
   * @requires $rootScope
   * @requires $localStorage
   */
  function tabNotificationsService(anTinycon, ngAudio, $timeout, authService,
                                   UserNotificationSettingModel, $rootScope, $localStorage) {
    var counter = {};
    var sound;

    return {
      setCounter: setCounter,
      resetCounter: resetCounter
    };

    /**
     * @ngdoc method
     * @name commons.browsernotifications.tabNotificationsService#setCounter
     * @methodOf commons.browsernotifications.tabNotificationsService
     *
     * @description
     * Sets the counter for the given category and updates the tab title. Plays a sound notification if activated and necessary.
     *
     */
    function setCounter(category, number) {
      if (angular.isDefined(counter[category]) && number !== 0 && number !== counter[category]) {
        _playSound();
      }
      counter[category] = number;
      _setCounter();
    }

    /**
     * @ngdoc method
     * @name commons.browsernotifications.tabNotificationsService#resetCounter
     * @methodOf commons.browsernotifications.tabNotificationsService
     *
     * @description
     * Resets the counter of the given category to zero and updates the tab title.
     *
     */
    function resetCounter(category) {
      counter[category] = 0;
      _setCounter();
    }

    function _setCounter() {
      $timeout(function () {
        anTinycon.setBubble(_.sum(_.values(counter)));
      }, 0);
    }

    function _playSound() {
      if (angular.isDefined(sound) && sound.canPlay) {
        if ($rootScope.tabId === $localStorage.activeTabId) {
          _getNotificationSettings().then(function (data) {
            if (_.filter(data, {channel: 'SOUND', active: true}).length > 0) {
              sound.play();
            }
          });
        }
      } else {
        if (!sound) {
          sound = ngAudio.load('assets/sounds/new.ogg');
        }
        $timeout(function () {
          _playSound();
        }, 100);
      }
    }

    function _getNotificationSettings() {
      return authService.getUser().then(function (currentUser) {
        return UserNotificationSettingModel.query({}, {userId: currentUser.id});
      });
    }

  }

})(angular);
