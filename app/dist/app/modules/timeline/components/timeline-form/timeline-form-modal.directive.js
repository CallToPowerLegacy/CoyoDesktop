(function (angular) {
  'use strict';

  angular
      .module('coyo.timeline')
      .directive('oyocTimelineFormModal', timelineFormModal);

  /**
   * @ngdoc directive
   * @name coyo.timeline.oyocTimelineFormModal:oyocTimelineFormModal
   * @restrict 'E'
   * @element OWN
   *
   * @description
   * Renders the timeline form for creating new items (in a modal view).
   *
   * @param {string} contextId The ID of the sender from whose perspective the stream should be rendered (the context)
   * @param {string} timelineType The timeline type
   */
  function timelineFormModal() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/modules/timeline/components/timeline-form/timeline-form-modal.html',
      bindToController: {
        contextId: '@',
        timelineType: '<'
      },
      controller: 'TimelineFormController',
      controllerAs: '$ctrl'
    };
  }

})(angular);
