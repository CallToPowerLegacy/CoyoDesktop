(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .factory('timelineItemVideoPreviewService', timelineItemVideoPreviewService);

  /**
   * @ngdoc service
   * @name commons.ui.timelineItemVideoPreviewService
   *
   * @description
   * Provides functions for bulk-load timeline item link previews
   *
   * @requires coyo.domain.TimelineItemVideoPreviewModel
   * @requires $timeout
   * @requires $q
   * @requires commons.resource.Page
   */
  function timelineItemVideoPreviewService(TimelineItemVideoPreviewModel, $timeout, $q, Page) {
    var pendingVideoPreviewRequests = [];

    return {
      getTimelineItemVideoPreviews: getTimelineItemVideoPreviews
    };

    /**
     * @ngdoc function
     * @name commons.ui.timelineItemVideoPreviewService#getTimelineItemVideoPreviews
     * @methodOf commons.ui.timelineItemVideoPreviewService
     *
     * @description
     * Caches the timeline item video preview request for one digest cycle and sending a bulk request
     *
     * @param {string} itemId  the id of the target
     *
     * @returns {promise} Is fulfilled with the timeline item video previews
     */
    function getTimelineItemVideoPreviews(itemId) {
      var deferred = $q.defer();
      pendingVideoPreviewRequests.push({itemId: itemId, promise: deferred});

      /*
       * Wait for one angular digest cycle and collect all requested ids. Make one call (per timeline item id) to
       * the backend and then assign the results to the designated promises.
       */
      $timeout(function () {
        if (!_.isEmpty(pendingVideoPreviewRequests)) {
          var pendingCopy = angular.copy(pendingVideoPreviewRequests);
          pendingVideoPreviewRequests = [];

          angular.forEach(_.groupBy(pendingCopy), function (entry) {
            _getInitVideoPreviewsForItemId(entry);
          });
        }
      });
      return deferred.promise;
    }

    function _getInitVideoPreviewsForItemId(tilpRequest, targetType) {
      TimelineItemVideoPreviewModel.get(targetType, {ids: _.map(tilpRequest, 'itemId')})
          .then(function (timelineItemVideoPreviews) {
            angular.forEach(tilpRequest, function (request) {
              if (timelineItemVideoPreviews[request.itemId]) {
                var page = new Page(timelineItemVideoPreviews[request.itemId], {}, {
                  url: TimelineItemVideoPreviewModel.url,
                  resultMapper: function (item) {
                    return new TimelineItemVideoPreviewModel(item);
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
