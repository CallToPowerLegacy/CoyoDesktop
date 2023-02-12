(function () {
  'use strict';

  angular
      .module('commons.subscriptions')
      .factory('subscriptionsService', subscriptionsService);

  /**
   * @ngdoc service
   * @name commons.subscriptions.subscriptionsService
   *
   * @description
   * Service for handling subscriptions. It provides methods to subscribe, unsubscribe and get information about
   * subscriptions.
   */
  function subscriptionsService($q, $timeout, $rootScope, UserSubscriptionModel) {
    var pendingRequests = [];

    return {
      subscribe: subscribe,
      unsubscribe: unsubscribe,
      getSubscriptions: getSubscriptions,
      getSubscriptionsByType: getSubscriptionsByType,
      onSubscriptionChange: onSubscriptionChange
    };

    /**
     * @ngdoc function
     * @name commons.subscriptions.subscriptionsService#subscribe
     * @methodOf commons.subscriptions.subscriptionsService
     *
     * @description
     * Subscribes a user to a target
     *
     * @param {string} userId The ID of the user to subscribe to the target.
     * @param {string} targetId The target ID
     * @param {string} targetType The target type
     * @param {string} senderId The sender ID
     *
     * @returns {promise} An $http promise
     */
    function subscribe(userId, targetId, targetType, senderId) {
      return new UserSubscriptionModel({
        userId: userId,
        targetId: targetId,
        targetType: targetType,
        senderId: senderId
      }).create();
    }

    /**
     * @ngdoc function
     * @name commons.subscriptions.subscriptionsService#unsubscribe
     * @methodOf commons.subscriptions.subscriptionsService
     *
     * @description
     * Unsubscribes a user from a target. This means the subscription object is deleted.
     *
     * @param {string} userId The ID of the user to unsubscribe from the target.
     * @param {string} targetId The target ID
     *
     * @returns {promise} An $http promise
     */
    function unsubscribe(userId, targetId) {
      var url = UserSubscriptionModel.$url({userId: userId});
      return UserSubscriptionModel.$delete(url, {targetId: targetId});
    }

    /**
     * @ngdoc method
     * @name commons.subscriptions.subscriptionsService#getSubscriptions
     * @methodOf commons.subscriptions.subscriptionsService
     *
     * @description
     * Returns the subscriptions of a user for given targets.
     *
     * @param {string} userId The ID of the user to check the subscription status for.
     * @param {string[]=} targetIds The IDs of the targets.
     *
     * @returns {promise} An $http promise.
     */
    function getSubscriptions(userId, targetIds) {
      var url = UserSubscriptionModel.$url({userId: userId});
      var paramIds = angular.isArray(targetIds) ? _.join(targetIds, ',') : targetIds;
      return paramIds ? UserSubscriptionModel.$get(url, {targetIds: paramIds}) : UserSubscriptionModel.$get(url);
    }

    /**
     * @ngdoc method
     * @name commons.subscriptions.subscriptionsService#getSubscriptionsByType
     * @methodOf commons.subscriptions.subscriptionsService
     *
     * @description
     * Returns the subscriptions of a user for given target type.
     *
     * @param {string} userId The ID of the user to check the subscription status for.
     * @param {string} targetType The type name of the targets.
     *
     * @returns {promise} An $http promise.
     */
    function getSubscriptionsByType(userId, targetTypes) {
      var url = UserSubscriptionModel.$url({userId: userId});
      var targets = angular.isArray(targetTypes) ? _.join(targetTypes, ',') : targetTypes;
      return UserSubscriptionModel.$get(url, {targetType: targets});
    }

    /**
     * @ngdoc method
     * @name commons.subscriptions.subscriptionsService#onSubscriptionChange
     * @methodOf commons.subscriptions.subscriptionsService
     *
     * @description
     * Determines whether a user is subscribed to the given target. Once it is resolved the passed callback is called.
     * In addition the caller is subscribed to an event that is invoked every time the subscriptions are changed.
     *
     * @param {string} userId The ID of the user to check the subscription status for.
     * @param {string} targetId The ID of the target.
     * @param {function} callback A callback method that is invoked every time the subscriptions of the user are
     * updated and contains the subscription object. It is called at least once initially.
     *
     * @returns {function} A function to unregister the event handler. This should be called when the scope is
     * destroyed.
     */
    function onSubscriptionChange(userId, targetId, callback) {
      _getSubscription(userId, targetId).then(function (subscription) {
        callback(subscription);
      });
      return $rootScope.$on('currentUser:updated', function () {
        _getSubscription(userId, targetId).then(function (subscription) {
          callback(subscription);
        });
      });
    }

    /* ----- PRIVATE ----- */

    function _getSubscription(userId, targetId) {
      var deferred = $q.defer();
      pendingRequests.push({userId: userId, targetId: targetId, promise: deferred});

      /*
       * Wait for one angular digest cycle and collect all requested target ids. Make one call (per user id) to the
       * backend and then assign the results to the designated promises.
       */
      $timeout(function () {
        if (!_.isEmpty(pendingRequests)) {
          var pendingCopy = angular.copy(pendingRequests);
          pendingRequests = [];

          angular.forEach(_.groupBy(pendingCopy, 'userId'), function (entry, user) {
            getSubscriptions(user, _.map(entry, 'targetId')).then(function (userSubscriptions) {
              angular.forEach(pendingCopy, function (request) {
                request.promise.resolve(_.find(userSubscriptions, {targetId: request.targetId}));
              });
            });
          });
        }
      });
      return deferred.promise;
    }
  }

})();
