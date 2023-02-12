(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .factory('timelineItemLinkPreviewService', timelineItemLinkPreviewService);

  /**
   * @ngdoc service
   * @name commons.ui.timelineItemLinkPreviewService
   *
   * @description
   * Provides functions for bulk-load timeline item link previews
   *
   * @requires coyo.domain.TimelineItemLinkPreviewModel
   * @requires $timeout
   * @requires $q
   * @requires commons.resource.Page
   */
  function timelineItemLinkPreviewService(TimelineItemLinkPreviewModel, $timeout, $q, Page) {

    var pendingLinkPreviewRequests = [];

    return {
      getTimelineItemLinkPreviews: getTimelineItemLinkPreviews
    };

    /**
     * @ngdoc function
     * @name commons.ui.timelineItemLinkPreviewService#getTimelineItemLinkPreviews
     * @methodOf commons.ui.timelineItemLinkPreviewService
     *
     * @description
     * Caches the timeline item link preview request for one digest cycle and sending a bulk request
     *
     * @param {string} itemId  the id of the target
     *
     * @returns {promise} Is fulfilled with the timeline item link previews
     */
    function getTimelineItemLinkPreviews(itemId) {
      var deferred = $q.defer();
      pendingLinkPreviewRequests.push({itemId: itemId, promise: deferred});

      /*
       * Wait for one angular digest cycle and collect all requested ids. Make one call (per timeline item id) to
       * the backend and then assign the results to the designated promises.
       */
      $timeout(function () {
        if (!_.isEmpty(pendingLinkPreviewRequests)) {
          var pendingCopy = angular.copy(pendingLinkPreviewRequests);
          pendingLinkPreviewRequests = [];

          angular.forEach(_.groupBy(pendingCopy), function (entry) {
            _getInitLinkPreviewsForItemId(entry);
          });
        }
      });
      return deferred.promise;
    }

    function _getInitLinkPreviewsForItemId(tilpRequest, targetType) {
      TimelineItemLinkPreviewModel.get(targetType, {ids: _.map(tilpRequest, 'itemId')})
          .then(function (timelineItemLinkPreviews) {
            angular.forEach(tilpRequest, function (request) {
              if (timelineItemLinkPreviews[request.itemId]) {
                var page = new Page(timelineItemLinkPreviews[request.itemId], {}, {
                  url: TimelineItemLinkPreviewModel.url,
                  resultMapper: function (item) {
                    return new TimelineItemLinkPreviewModel(item);
                  }
                });
                request.promise.resolve(page);
              } else {
                request.promise.reject();
              }
            });
          },
          function () {
            angular.forEach(tilpRequest, function (request) {
              request.promise.reject();
            });
          });
    }
  }
})(angular);
