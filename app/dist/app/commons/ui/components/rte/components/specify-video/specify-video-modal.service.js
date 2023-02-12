(function (angular) {
  'use strict';

  angular.module('commons.ui')
      .factory('specifyVideoModalService', specifyVideoModalService)
      .controller('SpecifyVideoModalController', SpecifyVideoModalController);

  /**
   * @ngdoc service
   * @name commons.ui.specifyVideoModalService
   *
   * @description
   * The service provides a 'specify video' modal.
   *
   * @requires modalService
   */
  function specifyVideoModalService(modalService) {

    return {
      specify: specify
    };

    /**
     * @ngdoc method
     * @name commons.ui.specifyVideoModalService#specify
     * @methodOf commons.ui.specifyVideoModalService
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
     * @param {object} model
     * The URL model.
     *
     *
     * @param {string} model.url
     * The URL
     *
     *
     * @param {object=} translationContext
     * Variables that are to be used for placeholder replacement of all given translation keys.
     *
     * @returns {object} Promise to resolve when the modal is closed (on 'OK').
     */
    function specify(options, model) {
      return modalService.open({
        templateUrl: 'app/commons/ui/components/rte/components/specify-video/specify-video-modal.html',
        controller: 'SpecifyVideoModalController',
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

  function SpecifyVideoModalController($document, $uibModalInstance, VideoInfoModel, options, model) {
    var vm = this;
    vm.model = model || {
      url: ''
    };

    angular.extend(vm, options);

    vm.onClick = onClick;
    vm.onDismiss = onDismiss;
    vm.loading = false;
    vm.resetError = resetError;

    function frontendValid() {
      return !_.isEmpty(vm.model.url) && (!vm.validFunction || vm.validFunction(vm.model.url));
    }

    function close() {
      vm.loading = true;

      VideoInfoModel.generateVideoInfo(vm.model.url).then(function (model) {
        if (model.length > 0) {
          angular.extend(vm.model, model[0], {
            fromBackend: true
          });
        } else {
          angular.extend(vm.model, {fromBackend: false});
        }
        unbindKeyUp();
        $uibModalInstance.close(vm.model);
      }).catch(function (error) {
        //When video is not embeddable (no og:video:secure_url tag) show error
        if (error.data.errorStatus === 'VIDEO_NOT_EMBEDDABLE') {
          vm.error = 'RTE.MODAL.VALIDATION.NOT_EMBEDDABLE';
        } else if (frontendValid()) {
          // try the frontend validation way if backend can not get the information
          unbindKeyUp();
          $uibModalInstance.close(vm.model);
        } else {
          vm.error = 'RTE.MODAL.VALIDATION.INVALID_VIDEO_URL';
        }
      }).finally(function () {
        vm.loading = false;
      });
    }

    function onClick() {
      close();
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
      if (event.which === 13 && !vm.loading && vm.model.url) {
        event.preventDefault();
        close();
      }
    };

    function resetError() {
      vm.error = undefined;
    }

    bindKeyUp();
  }
})(angular);
