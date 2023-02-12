(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .factory('aboutCoyoService', aboutCoyoService);

  /**
   * @ngdoc service
   * @name commons.ui.aboutCoyoService
   *
   * @description
   * Service for rendering about coyo.
   *
   * @requires modalService
   */
  function aboutCoyoService(modalService) {

    return {
      open: open
    };

    /**
     * @ngdoc function
     * @name commons.ui.aboutCoyoService#open
     * @methodOf commons.ui.aboutCoyoService
     *
     * @description
     * Open a modal with the information about current version
     */
    function open() {
      modalService.open({
        controller: 'AboutCoyoController',
        size: 'md',
        templateUrl: 'app/commons/ui/components/about-coyo/about-coyo.modal.html'
      });
    }
  }

})(angular);
