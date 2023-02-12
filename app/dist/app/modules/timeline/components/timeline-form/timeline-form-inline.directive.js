(function (angular) {
  'use strict';

  angular
      .module('coyo.timeline')
      .directive('oyocTimelineFormInline', timelineFormInline);

  /**
   * @ngdoc directive
   * @name coyo.timeline.oyocTimelineFormInline:oyocTimelineFormInline
   * @restrict 'E'
   * @element OWN
   *
   * @description
   * Renders the timeline form for creating new items.
   *
   * @param {string} contextId The ID of the sender from whose perspective the stream should be rendered (the context)
   * @param {string} timelineType The timeline type
   */
  function timelineFormInline() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/modules/timeline/components/timeline-form/timeline-form-inline.html',
      scope: {},
      bindToController: {
        contextId: '@',
        timelineType: '<'
      },
      controller: 'TimelineFormController',
      controllerAs: '$ctrl'
    };
  }

})(angular);
