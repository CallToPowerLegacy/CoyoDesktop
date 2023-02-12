(function (angular) {
  'use strict';

  angular
      .module('coyo.domain')
      .factory('TimelineItemLinkPreviewModel', TimelineItemLinkPreviewModel);

  /**
   * @ngdoc service
   * @name coyo.domain.TimelineItemLinkPreviewModel
   *
   * @description
   * Provides the timeline link preview model.
   *
   * @requires restResourceFactory
   * @requires commons.config.coyoEndpoints
   */
  function TimelineItemLinkPreviewModel(restResourceFactory, coyoEndpoints) {
    var TimelineItemLinkPreviewModel = restResourceFactory({
      url: coyoEndpoints.timeline.webPreviews
    });

    return TimelineItemLinkPreviewModel;
  }

})(angular);
