(function () {
  'use strict';

  angular
      .module('commons.tour')
      .component('oyocTourProgress', tourProgress())
      .controller('TourProgressController', TourProgressController);

  /**
   * @ngdoc directive
   * @name commons.tour.oyocTourProgress:oyocTourProgress
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Displays the progress with a bootstrap progress bar of the given ui-tour.
   *
   * @param {object} currentTour
   * The current ui-tour object to display the progress for.
   *
   * @requires $scope
   */
  function tourProgress() {
    return {
      templateUrl: 'app/commons/tour/components/tour-progress/tour-progress.html',
      bindings: {
        currentTour: '<'
      },
      controller: 'TourProgressController'
    };
  }

  function TourProgressController($scope) {
    var vm = this;
    var steps = [];

    vm.$onInit = _init;

    function _init() {
      _refreshProgress();
      $scope.$watchCollection(function () {
        return vm.currentTour._getSteps();
      }, _refreshProgress);
    }

    function _refreshProgress() {
      steps = vm.currentTour._getSteps();
      vm.maxSteps = steps.length;
      vm.stepIndex = _.findIndex(steps, vm.currentTour.getCurrentStep()) + 1;
    }

  }
})();
