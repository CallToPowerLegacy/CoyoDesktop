(function (angular) {
  'use strict';

  angular.module('commons.ui')
      .factory('specifyLinkModalService', specifyLinkModalService)
      .controller('SpecifyLinkModalController', SpecifyLinkModalController);

  /**
   * @ngdoc service
   * @name commons.ui.specifyLinkModalService
   *
   * @description
   * The service provides a 'specify link' modal.
   *
   * @requires modalService
   */
  function specifyLinkModalService(modalService) {

    return {
      specify: specify
    };

    /**
     * @ngdoc method
     * @name commons.ui.specifyLinkModalService#specify
     * @methodOf commons.ui.specifyLinkModalService
     *
     * @description
     * Opens a 'specify link' modal.
     *
     * @param {object} options
     * Configuration options for the modal
     *
     * @param {string} options.title
     * Translation key of the title of the confirm modal
     *
     * @param {string} options.text
     * Translation key of the text
     *
     * @param {string} options.url
     * Translation key of the url
     *
     * @param {string} options.newWindow
     * Translation key of the newWindow option
     *
     * @param {string} options.selection
     * Selected content
     *
     * @param {object} model
     * The URL model.
     *
     * @param {string} model.text
     * The text of the URL
     *
     * @param {string} model.url
     * The URL
     *
     * @param {boolean} model.newWindow
     * Boolean flag whether to open the link in a new window
     *
     * @param {object=} translationContext
     * Variables that are to be used for placeholder replacement of all given translation keys.
     *
     * @returns {object} Promise to resolve when the modal is closed (on 'OK').
     */
    function specify(options, model) {
      return modalService.open({
        templateUrl: 'app/commons/ui/components/rte/components/specify-link/specify-link-modal.html',
        controller: 'SpecifyLinkModalController',
        resolve: {
          options: function () {
            return options;
          },
          model: function () {
            return model;
          }
        }
      }).result;
    }
  }

  function SpecifyLinkModalController($document, $uibModalInstance, options, model) {
    var vm = this;
    vm.model = model || {
      text: options.selection,
      url: '',
      newWindow: true
    };

    angular.extend(vm, options);

    vm.onClick = onClick;
    vm.onDismiss = onDismiss;
    vm.valid = valid;

    function valid() {
      return !_.isEmpty(vm.model.url);
    }

    function onClick() {
      if (valid()) {
        unbindKeyUp();
        _validateModel();
        $uibModalInstance.close(vm.model);
      }
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
      if (event.which === 13 && valid()) {
        event.preventDefault();
        unbindKeyUp();
        _validateModel();
        $uibModalInstance.close(vm.model);
      }
    };

    bindKeyUp();

    function _validateModel() {
      if (_.isEmpty(vm.model.text)) {
        vm.model.text = vm.model.url;
      }
    }
  }

})(angular);
