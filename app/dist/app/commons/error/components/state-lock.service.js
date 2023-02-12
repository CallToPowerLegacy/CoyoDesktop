(function (angular) {
  'use strict';

  angular
      .module('commons.error')
      .factory('stateLockService', stateLockService);

  /**
   * @ngdoc service
   * @name commons.error.stateLockService
   *
   * @description
   *
   * Maintains a lock that can be used to prevent navigation away from the current state, e.g. when in edit mode.
   * Multiple locks can be obtained to allow for multiple areas on the screen to lock the state independently of each other.
   *
   * When at least one lock is present, navigation away from the page (or closing the browser tab) is prevented with
   * a confirmation message.
   *
   * Handling angular state navigation is done inside the global `$transitions.onStart` listener which checks for locks
   * via the `isLocked` method.
   *
   * @requires $window
   * @requires $translate
   * @requires $q
   * @requires $timeout
   */
  function stateLockService($window, $translate, $q, $timeout) {

    var lockCount = 0;

    return {
      lock: lock,
      unlock: unlock,
      unlockAll: unlockAll,
      isLocked: isLocked,
      ignoreLock: ignoreLock
    };

    /**
     * @ngdoc method
     * @name commons.error.stateLockService#lock
     * @methodOf commons.error.stateLockService
     *
     * @description
     * Add a lock to prevent leaving the state.
     */
    function lock() {
      lockCount++;
      $translate('CONFIRMATION.LEAVE_STATE.TEXT').then(function (translation) {
        $window.onbeforeunload = function () {
          return translation;
        };
      });
    }

    /**
     * @ngdoc method
     * @name commons.error.stateLockService#unlock
     * @methodOf commons.error.stateLockService
     *
     * @description
     * Remove a lock.
     */
    function unlock() {
      lockCount = lockCount > 0 ? lockCount - 1 : 0;
      if (lockCount === 0) {
        $window.onbeforeunload = undefined;
      }
    }

    /**
     * @ngdoc method
     * @name commons.error.stateLockService#unlockAll
     * @methodOf commons.error.stateLockService
     *
     * @description
     * Remove all current locks. Needed to allow the user to override the warning.
     */
    function unlockAll() {
      lockCount = 0;
      $window.onbeforeunload = undefined;
    }

    /**
     * @ngdoc method
     * @name commons.error.stateLockService#isLocked
     * @methodOf commons.error.stateLockService
     *
     * @description
     * Check if there are any current locks.
     *
     * @returns {boolean} true if the state is locked, false otherwise
     */
    function isLocked() {
      return lockCount > 0;
    }

    /**
     * @ngdoc method
     * @name commons.error.stateLockService#ignoreLock
     * @methodOf commons.error.stateLockService
     *
     * @description
     * Runs the given callback after temporarily disabling the state lock.
     * This is useful for attachment downloads that will not really leave the state but where
     * the browser displays the leave alert anyway.
     *
     * @param {function} the callback to be executed while the lock is disabled
     */
    function ignoreLock(callback) {
      if (isLocked()) {
        var originalLockCount = lockCount;
        unlockAll();
        $q.when(callback()).then(function () {
          $timeout(function () {
            lock();
            lockCount = originalLockCount;
          });
        });
      } else {
        callback();
      }
    }
  }

})(angular);
