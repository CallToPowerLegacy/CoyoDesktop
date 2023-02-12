(function (angular) {
  'use strict';

  angular.module('commons.ui')
      .factory('alertConfirmModalService', alertConfirmModalService)
      .controller('AlertConfirmModalController', AlertConfirmModalController);

  /**
   * @ngdoc service
   * @name commons.ui.alertConfirmModalService
   *
   * @description
   * The service extends modalService#confirm so that is allows to place an alert notification inside the confirm modal.
   *
   * @requires modalService
   */
  function alertConfirmModalService(modalService) {

    return {
      confirm: confirm
    };

    /**
     * @ngdoc method
     * @name commons.ui.alertConfirmModalService#confirm
     * @methodOf commons.ui.alertConfirmModalService
     *
     * @description
     * Opens a confirm modal with an additional alert element.
     *
     * @param {object} options
     * Configuration options for the modal
     *
     * @param {string} options.title
     * Translation key of the title of the confirm modal
     *
     * @param {string} options.text
     * Translation key of the text inside the modal
     *
     * @param {object[]=} alerts
     * An array of alert boxes to show
     *
     * @param {string} options.alert.alertClass
     * Bootstrap alert class to be used (e.g. 'alert-danger').
     *
     * @param {string} options.alert.alertTitle
     * Translation key of the prefix of the alert text, will be rendered in bold
     *
     * @param {string} options.alert.alertText
     * Translation key of the text inside the alert
     *
     * @param {object=} translationContext
     * Variables that are to be used for placeholder replacement of all given translation keys.
     *
     * @returns {object} Promise to resolve when the modal is closed (on 'OK').
     */
    function confirm(options) {
      return modalService.open({
        templateUrl: 'app/commons/ui/components/alert-confirm/alert-confirm-modal.html',
        controller: 'AlertConfirmModalController',
        resolve: {
          options: function () {
            return options;
          }
        }
      }).result;
    }
  }

  function AlertConfirmModalController($document, $uibModalInstance, options) {
    var vm = this;
    angular.extend(vm, options);
    angular.extend(vm, {
      buttons: [{
        icon: 'check-circle',
        title: 'YES',
        style: 'btn-primary',
        onClick: onClick
      }, {
        icon: 'close-circle',
        title: 'NO',
        style: 'btn-default',
        onClick: onDismiss
      }]
    });

    function onClick() {
      unbindKeyUp();
      $uibModalInstance.close();
    }

    function onDismiss() {
      unbindKeyUp();
      $uibModalInstance.dismiss();
    }

    function bindKeyUp() {
      $document.bind('keyup', onEnterKeyUp);
    }

    function unbindKeyUp() {
      $document.unbind('keyup', onEnterKeyUp);
    }

    var onEnterKeyUp = function (event) {
      if (event.which === 13) {
        event.preventDefault();
        unbindKeyUp();
        $uibModalInstance.close();
      }
    };

    bindKeyUp();
  }

})(angular);
