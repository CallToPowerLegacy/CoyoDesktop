(function () {
  'use strict';

  angular.module('commons.tour')
      .factory('tourSelectionModal', tourSelectionModal)
      .controller('TourSelectionModalController', TourSelectionModalController);

  /**
   * @ngdoc service
   * @name commons.tour.tourSelectionModal
   *
   * @description
   * Shows a modal with all tour topics available on the current page. A click on one of the topics restart the
   * tour steps of the given topic.
   *
   * @requires modalService
   */
  function tourSelectionModal(modalService) {

    return {
      open: open
    };

    /**
     * @ngdoc method
     * @name commons.tour.tourSelectionModal#open
     * @methodOf commons.tour.tourSelectionModal
     *
     * @description
     * Opens the modal. The modal is closed again when a user chooses a topic or if he closes the modal manually.
     *
     * @param {Array} topics
     * An array of topics which are available on the current page.
     *
     * @returns {object} A promise to be called when the modal is closed.
     */
    function open(topics) {
      return modalService.open({
        templateUrl: 'app/commons/tour/components/tour-selection-modal/tour-selection-modal.html',
        controller: 'TourSelectionModalController',
        resolve: {
          topics: function () {
            return topics || [];
          }
        }
      }).result;
    }
  }

  function TourSelectionModalController(topics, tourService, $uibModalInstance) {
    var vm = this;
    vm.topics = topics;

    vm.startTour = startTour;

    function startTour(topic) {
      $uibModalInstance.close();
      tourService.restart(topic);
    }
  }

})();
