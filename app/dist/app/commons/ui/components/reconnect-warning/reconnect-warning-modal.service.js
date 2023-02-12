(function (angular) {
  'use strict';

  angular.module('commons.ui')
      .factory('reconnectWarningModalService', reconnectWarningModalService)
      .controller('ReconnectWarningModalController', ReconnectWarningModalController);

  /**
   * @ngdoc service
   * @name commons.ui.reconnectWarningModalService
   *
   * @description
   * This service provides a method to open a modal dialog which shows a error message when websockets are disconnect.
   * The modal displays a button to reload the page.
   *
   * @requires modalService
   */
  function reconnectWarningModalService(modalService) {

    return {
      open: open
    };

    /**
     * @ngdoc method
     * @name commons.ui.reconnectWarningModalService#open
     * @methodOf commons.ui.reconnectWarningModalService
     *
     * @description
     * This method opens the modal which shows the error message.
     */
    function open() {
      return modalService.open({
        size: 'lg',
        templateUrl: 'app/commons/ui/components/reconnect-warning/reconnect-warning-modal.html',
        controller: 'ReconnectWarningModalController',
        resolve: {}
      }).result;
    }
  }

  function ReconnectWarningModalController($window) {
    var vm = this;

    vm.reload = reload;

    function reload() {
      $window.location.reload();
    }
  }
})(angular);
