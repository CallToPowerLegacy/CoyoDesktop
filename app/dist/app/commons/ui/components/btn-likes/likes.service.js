(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .factory('likesService', likesService);

  /**
   * @ngdoc service
   * @name commons.ui.likesService
   *
   * @description
   * Provides functions for bulk-load likes
   *
   * @requires coyo.domain.LikeModel
   * @requires $q
   * @requires $timeout
   * @requires $coyoEndpoints
   */
  function likesService(LikeModel, $q, $timeout, coyoEndpoints) {

    var pendingLikeInfoRequests = [];

    return {
      getLikes: getLikes
    };

    /**
     * @ngdoc function
     * @name commons.ui.likesService#getLikes
     * @methodOf commons.ui.likesService
     *
     * @description
     * Caches the like request for one digest cycle and sending a bulk request
     *
     * @param {string} targetId  the id of the target
     * @param {string} targetType  the type of the target
     * @param {string} senderId  the id of the sender which sends the request
     *
     * @returns {promise} Is fulfilled with the actual likes of the target
     */
    function getLikes(targetId, targetType, senderId) {

      var deferred = $q.defer();
      pendingLikeInfoRequests.push({targetId: targetId, targetType: targetType, promise: deferred});

      /*
       * Wait for one angular digest cycle and collect all requested target ids. Make one call (per user id) to the
       * backend and then assign the results to the designated promises.
       */
      $timeout(function () {
        if (!_.isEmpty(pendingLikeInfoRequests)) {
          var pendingCopy = angular.copy(pendingLikeInfoRequests);
          pendingLikeInfoRequests = [];

          angular.forEach(_.groupBy(pendingCopy, 'targetType'), function (entry, targetType) {
            _getLikeInfosForTargetType(entry, targetType, senderId);
          });
        }
      });
      return deferred.promise;
    }

    function _getLikeInfosForTargetType(likeRequests, targetType, senderId) {
      var url = coyoEndpoints.likes.infoBulk.replace('{{targetType}}', targetType);

      LikeModel.$get(url, {
        senderId: senderId,
        ids: _.map(likeRequests, 'targetId')
      }).then(function (likeInfos) {
        angular.forEach(likeRequests, function (likeRequest) {
          if (likeInfos[likeRequest.targetId]) {
            likeRequest.promise.resolve(likeInfos[likeRequest.targetId]);
          } else {
            likeRequest.promise.reject();
          }
        });
      }, function () {
        angular.forEach(likeRequests, function (request) {
          request.promise.reject();
        });
      });
    }
  }

})(angular);
