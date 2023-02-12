(function () {
  'use strict';

  angular
      .module('commons.tour')
      .component('coyoTourStep', tourStep())
      .controller('TourStepController', TourStepController);

  /**
   * @ngdoc directive
   * @name commons.tour.coyoTourStep:coyoTourStep
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * This directive adds a tour step to the desktop tour. It is not visible when the user starts the application in a
   * mobile resolution (xs or sm). The tour step is automatically registered and bound to the html element containing
   * the component.
   *
   * IMPORTANT NOTE: Make sure that the parent element of this directive has "position: relative" or add the class
   * "tour-placeholder-container" to it.
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
   * @param {string} stepId
   * Identifies a tour step.
   *
   * @param {string=} imageUrl
   * An optional url of an image to be added to the content. This will be placed under the content.
   *
   * @param {string=auto} placement
   * A placement for the tour popover can be provided. By default the placement is determined automatically. See the
   * bootstrap-ui documentation for possible values.
   *
   * @param {boolean=false} noHighlight
   * By default an element is generated that fills the whole parent container of this directive to create a highlight
   * effect of the assigned DOM element. Sometimes this is not the desired effect or doesn't work properly. If this
   * is the case set this flag to "true".
   *
   * @param {boolean=false} fixed
   * This parameter needs to be set 'true' if the tour is attached to a fixed element.
   *
   * @param {string=} popupClass
   * Adds an additional class to the popover window of the tour step.
   *
   * @requires $log
   * @requires $rootScope
   * @requires $scope
   * @requires $element
   * @requires commons.tour.tourService
   *
   */
  function tourStep() {
    return {
      templateUrl: 'app/commons/tour/components/tour-step/tour-step.html',
      bindings: {
        topic: '@',
        order: '@',
        title: '@',
        content: '@',
        stepId: '@',
        imageUrl: '@?',
        placement: '@?',
        noHighlight: '<?',
        popupClass: '@?',
        fixed: '<?'
      },
      controller: 'TourStepController'
    };
  }

  function TourStepController($log, $rootScope, $scope, $element, $transitions, tourService) {
    var vm = this;
    var api = {};
    var unregisterTransitionHook, unregisterRestart, unregisterEnd;

    vm.$onInit = _init;

    function _init() {
      if (angular.isUndefined(vm.stepId)) {
        throw new Error('The parameter "stepId" is mandatory. Error when rendering tour step for topic "' + vm.topic + '"');
      }

      // create api object to register at service
      api = {id: vm.stepId, topic: vm.topic};

      vm.enabled = false;
      vm.isStepRegistered = tourService.isStepRegistered(vm.stepId);
      vm.placement = vm.placement || 'auto';
      vm.noHighlight = angular.isDefined(vm.noHighlight) ? !!vm.noHighlight : false;
      vm.fixed = angular.isDefined(vm.fixed) ? !!vm.fixed : false;
      vm.stepContent = (vm.imageUrl) ? vm.content + '<img src="' + vm.imageUrl + '" />' : vm.content;

      var placeholderClass = (vm.noHighlight) ? 'tour-placeholder' : 'tour-placeholder-highlight';
      $element.addClass(placeholderClass);

      tourService.isEnabled(vm.topic).then(_setEnabled);
      unregisterTransitionHook = $transitions.onSuccess({}, function () {
        tourService.isEnabled(vm.topic).then(_setEnabled);
      });

      unregisterRestart = $rootScope.$on('tour.restart', function (event, key) {
        if (key === vm.topic) {
          vm.enabled = true;
        }
      });

      unregisterEnd = $rootScope.$on('tour.ended', function () {
        vm.enabled = false;
      });

      _setVisibility($element.is(':visible'));
      $scope.$watch(function () {
        return $element.is(':visible');
      }, function () {
        _setVisibility($element.is(':visible'));
      });

      // clean up after scope was destroyed
      $scope.$on('$destroy', _destroy);
    }

    function _setVisibility(visibility) {
      vm.visible = visibility;
      if (vm.visible) {
        tourService.registerStep(api);
      }
      _logStateChanged();
    }

    function _setEnabled(enabled) {
      vm.enabled = enabled;
      _logStateChanged();
    }

    function _logStateChanged() {
      $log.debug('[TourStep] Tour step with id [' + vm.stepId + '] is enabled (' + vm.enabled + '), visible (' + vm.visible + ') and ID was already rendered (' + vm.isStepRegistered + ').');
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
      tourService.unregisterStep(api.id);
    }

  }

})();
