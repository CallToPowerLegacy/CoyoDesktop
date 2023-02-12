(function (angular) {
  'use strict';

  angular
      .module('coyo.domain')
      .factory('TimelineItemVideoPreviewModel', TimelineItemVideoPreviewModel);

  /**
   * @ngdoc service
   * @name coyo.domain.TimelineItemVideoPreviewModel
   *
   * @description
   * Provides the timeline link preview model.
   *
   * @requires restResourceFactory
   * @requires commons.config.coyoEndpoints
   */
  function TimelineItemVideoPreviewModel(restResourceFactory, coyoEndpoints) {
    var TimelineItemVideoPreviewModel = restResourceFactory({
      url: coyoEndpoints.timeline.webPreviews
    });

    return TimelineItemVideoPreviewModel;
  }

})(angular);
