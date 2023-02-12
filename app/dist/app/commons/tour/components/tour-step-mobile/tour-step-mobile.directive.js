(function () {
  'use strict';

  angular
      .module('commons.tour')
      .component('coyoTourStepMobile', tourStepMobile())
      .controller('TourStepMobileController', TourStepMobileController);

  /**
   * @ngdoc directive
   * @name commons.tour.coyoTourStepMobile:coyoTourStepMobile
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * This directive adds a tour step to the mobile tour. It is only visible when the user starts the application in a
   * mobile resolution (xs or sm). The tour step is automatically registered when loaded. Place it in the template
   * where you like to explain something to the user. In comparison to {@link commons.tour.coyoTourStep:coyoTourStep}
   * the resulting tour step is not bound to any DOM element.
   *
   * @param {string} topic
   * Every tour step needs to be assigned to a topic, which determines what the tour step is describing. E.g. all tour
   * steps explaining menu items of the main navigation should have the topic "navigation". If one step of the a topic
   * was loaded and the user ends the tour, all steps of that topic are marked as seen.
   *
   * @param {number} order
   * Sets the order in which the step should be shown within the tour. For example a step with the order "1" is
   * displayed before a step with the order "5".
   *
   * @param {string} title
   * The title of the tour step.
   *
   * @param {string} content
   * The content of the tour step. This supports displaying HTML.
   *
   * @param {string=} imageUrl
   * An optional url of an image to be added to the content. This will be placed under the content.
   */
  function tourStepMobile() {
    return {
      templateUrl: 'app/commons/tour/components/tour-step-mobile/tour-step-mobile.html',
      bindings: {
        topic: '@',
        order: '@',
        title: '@',
        content: '@',
        imageUrl: '@?'
      },
      controller: 'TourStepMobileController'
    };
  }

  function TourStepMobileController($rootScope, $scope, $transitions, tourService) {
    var vm = this;
    var unregisterTransitionHook, unregisterRestart, unregisterEnd;

    vm.$onInit = _init;

    function _init() {
      vm.enabled = false;
      vm.stepContent = (vm.imageUrl) ? vm.content + '<img src="' + vm.imageUrl + '" />' : vm.content;

      tourService.isEnabled(vm.topic).then(function (enabled) {
        vm.enabled = enabled;
      });

      unregisterTransitionHook = $transitions.onSuccess({}, function () {
        tourService.isEnabled(vm.topic).then(function (enabled) {
          vm.enabled = enabled;
        });
      });

      unregisterRestart = $rootScope.$on('tour.restart', function (event, key) {
        if (key === 'mobile') {
          vm.enabled = true;
        }
      });

      unregisterEnd = $rootScope.$on('tour.ended', function () {
        vm.enabled = false;
      });

      $scope.$on('$destroy', _destroy);
    }

    function _destroy() {
      if (unregisterTransitionHook) {
        unregisterTransitionHook();
      }
      if (unregisterRestart) {
        unregisterRestart();
      }
      if (unregisterEnd) {
        unregisterEnd();
      }
    }

  }

})();
