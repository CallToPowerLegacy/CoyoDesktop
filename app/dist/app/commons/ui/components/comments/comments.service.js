(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .factory('commentsService', commentsService);

  /**
   * @ngdoc service
   * @name commons.ui.commentsService
   *
   * @description
   * Provides functions for bulk-load comments
   *
   * @requires coyo.domain.CommentModel
   * @requires $timeout
   * @requires $q
   * @requires commons.resource.Page
   */
  function commentsService(CommentModel, $timeout, $q, Page) {

    var pendingCommentRequests = [];
    var pendingCommentInfoRequests = [];

    return {
      getComments: getComments,
      getCommentInfo: getCommentInfo
    };

    /**
     * @ngdoc function
     * @name commons.ui.commentsService#getComments
     * @methodOf commons.ui.commentsService
     *
     * @description
     * Caches the comment request for one digest cycle and sending a bulk request
     *
     * @param {string} targetId  the id of the target
     * @param {string} targetType  the type of the target
     *
     * @returns {promise} Is fulfilled with the actual comments as page
     */
    function getComments(targetId, targetType) {
      var deferred = $q.defer();
      pendingCommentRequests.push({targetId: targetId, targetType: targetType, promise: deferred});

      /*
       * Wait for one angular digest cycle and collect all requested target ids. Make one call (per user id) to the
       * backend and then assign the results to the designated promises.
       */
      $timeout(function () {
        if (!_.isEmpty(pendingCommentRequests)) {
          var pendingCopy = angular.copy(pendingCommentRequests);
          pendingCommentRequests = [];

          angular.forEach(_.groupBy(pendingCopy, 'targetType'), function (entry, targetType) {
            _getInitCommentsForTargetType(entry, targetType);
          });
        }
      });
      return deferred.promise;
    }

    /**
     * @ngdoc function
     * @name commons.ui.commentsService#getComments
     * @methodOf commons.ui.commentsService
     *
     * @description
     * Caches the comment info request for one digest cycle and sending a bulk request
     *
     * @param {string} targetId  the id of the target
     * @param {string} targetType  the type of the target
     *
     * @returns {promise} Is fulfilled with the actual comment count
     */
    function getCommentInfo(targetId, targetType) {
      var deferred = $q.defer();
      pendingCommentInfoRequests.push({targetId: targetId, targetType: targetType, promise: deferred});

      /*
       * Wait for one angular digest cycle and collect all requested target ids. Make one call (per user id) to the
       * backend and then assign the results to the designated promises.
       */
      $timeout(function () {
        if (!_.isEmpty(pendingCommentInfoRequests)) {
          var pendingCopy = angular.copy(pendingCommentInfoRequests);
          pendingCommentInfoRequests = [];

          angular.forEach(_.groupBy(pendingCopy, 'targetType'), function (entry, targetType) {
            _getCommentInfoForTargetType(entry, targetType);
          });
        }
      });
      return deferred.promise;
    }

    function _getCommentInfoForTargetType(commentRequest, targetType) {
      CommentModel.getInfos(_.map(commentRequest, 'targetId'), targetType).then(function (commentInfos) {
        angular.forEach(commentRequest, function (request) {
          if (commentInfos[request.targetId]) {
            request.promise.resolve(commentInfos[request.targetId]);
          } else {
            request.promise.reject();
          }
        });
      }, function () {
        angular.forEach(commentRequest, function (request) {
          request.promise.reject();
        });
      });
    }

    function _getInitCommentsForTargetType(commentRequest, targetType) {
      CommentModel.getWithPermissions(targetType, {ids: _.map(commentRequest, 'targetId')}, ['delete', 'edit', 'like', 'accessoriginalauthor'])
          .then(function (comments) {
            angular.forEach(commentRequest, function (request) {
              if (comments[request.targetId]) {
                var page = new Page(comments[request.targetId], {}, {
                  url: CommentModel.url,
                  resultMapper: function (item) {
                    return new CommentModel(item);
                  }
                });
                request.promise.resolve(page);
              } else {
                request.promise.reject();
              }
            });
          },
          function () {
            angular.forEach(commentRequest, function (request) {
              request.promise.reject();
            });
          });
    }
  }
})(angular);
