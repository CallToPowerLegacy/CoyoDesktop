(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.personal-timeline')
      .directive('coyoPersonalTimelineWidget', personalTimelineWidget)
      .controller('PersonalTimelineWidgetController', PersonalTimelineWidgetController);

  /**
   * @ngdoc directive
   * @name coyo.widgets.personal-timeline:coyoPersonalTimelineWidget
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Renders the widget to display a personal timeline stream.
   */
  function personalTimelineWidget() {
    return {
      restrict: 'E',
      templateUrl: 'app/widgets/personal-timeline/personal-timeline-widget.html',
      scope: {},
      bindToController: {},
      controller: 'PersonalTimelineWidgetController',
      controllerAs: '$ctrl'
    };
  }

  function PersonalTimelineWidgetController(authService) {
    var vm = this;

    authService.getUser().then(function (user) {
      vm.currentUser = user;
    });
  }

})(angular);
