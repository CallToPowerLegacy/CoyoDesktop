(function () {
  'use strict';

  angular
      .module('commons.sender')
      .component('coyoFilePreview', filePreview())
      .controller('PreviewImageController', PreviewImageController);

  /**
   * @ngdoc directive
   * @name commons.sender.coyoFilePreview:coyoFilePreview
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Renders the image element for a sender's document preview and takes care, that the correct image sizes is set as
   * src. The image size depends on the passed size for the preview. The directive also takes into consideration whether
   * the display supports retina.
   *
   * @param {object} file
   * The file to get the preview of.
   * the display supports retina.
   *
   * @param {string} url
   * The 'base' preview URL with placeholders for the group ID and the image ID
   *
   * @param {string} groupId
   * The group ID to be replaced in the URL
   *
   * @param {string=} size
   * The size of the preview. Possible values are xs, sm, md, lg and xl and original. Default: md.
   *
   * @param {string} options
   * The options.
   *
   * @requires $scope
   * @requires $rootScope
   * @requires commons.resource.backendUrlService
   */
  function filePreview() {
    return {
      restrict: 'E',
      templateUrl: 'app/commons/sender/components/file-preview/file-preview.html',
      scope: {},
      bindings: {
        file: '<',
        url: '<',
        groupId: '<',
        size: '@?',
        options: '<?'
      },
      controller: 'PreviewImageController',
      controllerAs: '$ctrl'
    };
  }

  function PreviewImageController($rootScope, $scope, $http, $sce, backendUrlService, socketService,
                                  CapabilitiesModel, errorService) {
    var vm = this;

    var isSuccess = false;
    var unsubscribePreviewStatusFn;
    var fileStatus;
    vm.conversionError = false;
    vm.options = angular.extend({
      hideNoPreviewAvailableMsg: false,
      hidePreviewGenerationInformation: false,
      backgroundImage: false,
      showPdfDesktop: false,
      showPdfMobile: false
    }, vm.options);

    vm.onError = onError;

    /**
     * Defines the translation from preview sizes (bootstrap style) to available image sizes in backend.
     */
    var imageSizes = {
      xs: {sd: 'XS', retina: 'S'},
      sm: {sd: 'S', retina: 'M'},
      md: {sd: 'M', retina: 'L'},
      lg: {sd: 'L', retina: 'XL'},
      xl: {sd: 'XL', retina: 'XXL'},
      original: {sd: '', retina: ''}
    };

    vm.imageSize = imageSizes[vm.size || 'md'];
    vm.isProcessing = false;

    /**
     * Called if an error occurred on image load
     */
    function onError() {
      if (fileStatus === 'FAILED' || fileStatus === 'CANNOT_PROCESS') {
        vm.loading = false;
        vm.isProcessing = false;
        vm.conversionError = true;
        vm.previewAvailable = false;
      } else {
        vm.isProcessing = true;
      }
    }

    /*****************************************************************************/

    /**
     * Unsubscribes from the file status socket connection.
     */
    function _unsubscribeFileStatus() {
      if (unsubscribePreviewStatusFn) {
        unsubscribePreviewStatusFn();
        unsubscribePreviewStatusFn = undefined;
      }
    }

    /**
     * Returns the image size (retina or sd).
     *
     * @returns {string} size The image size (retina or sd)
     */
    function _getImageSize() {
      return ($rootScope.screenSize.isRetina) ? vm.imageSize.retina : vm.imageSize.sd;
    }

    /**
     * No preview can be generated. The image will not be available.
     */
    function _setCannotProcess() {
      _unsubscribeFileStatus();
      vm.loading = false;
      vm.conversionError = false;
      vm.isProcessing = false;
      $rootScope.$emit('previewNotAvailable', vm.file.id);
    }

    /**
     * Preview generation is in progress. The image will be available.
     */
    function _setProcessing() {
      vm.loading = false;
      vm.conversionError = false;
      vm.isProcessing = true;
    }

    /**
     * Preview generation succeeded. The image is available.
     */
    function _setSuccess() {
      _unsubscribeFileStatus();
      isSuccess = true;
      vm.loading = false;
      vm.conversionError = false;
      vm.isProcessing = false;
      CapabilitiesModel.previewImageFormat(vm.file.contentType).then(function (format) {
        vm.imageSrc = _createPreviewUrl(vm.url, vm.groupId, vm.file.id, _getImageSize(), format, vm.file.modified);
      });
      vm.pdfSrc = _createPdfUrl(vm.url, vm.groupId, vm.file.id, vm.file.modified);
    }

    /**
     * Preview generation failed. The image will not be available.
     */
    function _setFailed() {
      _unsubscribeFileStatus();
      vm.loading = false;
      vm.conversionError = true;
      vm.isProcessing = false;
    }

    /**
     * On preview status change. Checks whether a preview could/can be generated and whether it is already generated.
     * Redirects to the specific status functions.
     *
     * @param {string} status The returned preview status from the backend
     */
    function _previewStatusChange(status) {
      if (!isSuccess) {
        switch (status) {
          case 'CANNOT_PROCESS':
            _setCannotProcess();
            break;
          case 'PROCESSING':
            _setProcessing();
            break;
          case 'SUCCESS':
            _setSuccess();
            break;
          case 'FAILED':
            _setFailed();
            break;
          default:
            _setCannotProcess();
            break;
        }
      }
    }

    /**
     * Creates the preview URL.
     *
     * @param {string} url the backend URL
     * @param {string} groupId the group ID
     * @param {string} documentId the document ID
     * @param {string} size the size of the preview image to be loaded
     * @param {string} format the mimetype of preview image
     * @param {string} modified the modified date
     * @return {string} a preview URL
     */
    function _createPreviewUrl(url, groupId, documentId, size, format, modified) {
      var baseUrl = backendUrlService.getUrl() + url.replace('{{groupId}}', groupId).replace('{{id}}', documentId);
      var _modified = modified ? ('&modified=' + modified) : '';
      var _type = size ? ('&type=' + size) : '';
      format = (!size && vm.file.contentType === 'image/gif') ? vm.file.contentType : format;

      return baseUrl + (baseUrl.indexOf('?') < 0 ? '?' : '&') + 'format=' + format + _type + _modified;
    }

    function _createPdfUrl(url, groupId, fileId, modified) {
      var baseUrl = backendUrlService.getUrl() + url.replace('{{groupId}}', groupId).replace('{{id}}', fileId);
      var _modified = modified ? ('modified=' + modified) : '';
      var _amp = modified && (vm.file.contentType !== 'application/pdf') ? '&' : '';
      var _format = (vm.file.contentType !== 'application/pdf') ? ('format=application/pdf') : '';

      return $sce.trustAsResourceUrl(baseUrl + (baseUrl.indexOf('?') < 0 ? '?' : '&') + _format + _amp + _modified);
    }

    /**
     * Returns the preview status.
     *
     * @param {string} url the backend URL
     * @param {string} groupId the group ID
     * @param {string} documentId the document ID
     * @return {string} the status of the preview generation of the given document
     */
    function _getPreviewStatus(url, groupId, documentId) {
      return backendUrlService.getUrl() + url.replace('{{groupId}}', groupId).replace('{{id}}', documentId) + '/preview-status';
    }

    /**
     * Checks whether a preview can be generated.
     *
     * @param {object} file The file to be checked
     * @param {boolean} true if a preview can be generated, false else
     */
    function _canGeneratePreview(file) {
      return CapabilitiesModel.imgAvailable(file.contentType).then(function (available) {
        return available;
      }).catch(function () {
        return false;
      });
    }

    /**
     * Subscribes to the preview status socket route of the file.
     * Register the unsubscription on scope destroy.
     */
    function _subscribeToPreviewStatus() {
      unsubscribePreviewStatusFn =
          socketService.subscribe('/topic/item.' + vm.groupId + '.' + vm.file.id + '.preview.status', function (data) {
            _previewStatusChange(data.content.status);
          });
      $scope.$on('$destroy', _unsubscribeFileStatus);
    }

    /**
     * Tries to load the preview image of the given file.
     */
    function _loadPreview() {
      vm.loading = true;
      _canGeneratePreview(vm.file).then(function (previewAvailable) {
        vm.previewAvailable = previewAvailable;
        if (vm.previewAvailable) {
          _subscribeToPreviewStatus();
          // Don't cache this request client-side!
          $http.get(_getPreviewStatus(vm.url, vm.groupId, vm.file.id)).then(function (statusData) {
            _previewStatusChange(statusData.data.status);
          }).catch(function (errorResponse) {
            errorService.suppressNotification(errorResponse);
            _setCannotProcess();
          });
        } else {
          _setCannotProcess();
        }
      });
    }

    function _isVideoTypeSupported(contentType) {
      // removed ogg and webm because it's not supported on every browser
      return contentType === 'video/mp4';
    }

    /**
     * Resets all status and tries to load the preview.
     */
    function _reset() {
      _unsubscribeFileStatus();
      isSuccess = false;

      vm.imageSrc = undefined;
      vm.conversionError = false;
      vm.previewAvailable = false;
      vm.isProcessing = false;
      vm.videoType = false;

      if (_isVideoTypeSupported(vm.file.contentType)) {
        vm.videoType = true;
        vm.previewAvailable = true;
        vm.videoUrl = backendUrlService.getUrl() +
            vm.url.replace('{{groupId}}', vm.groupId).replace('{{id}}', vm.file.id) +
            '/stream';
      } else {
        _loadPreview();
      }
    }

    (function _init() {
      // this is loaded once initially and then after each change of vm.file
      $scope.$watch(function () {
        return vm.file;
      }, _reset);

      _reset();

      CapabilitiesModel.pdfAvailable(vm.file.contentType).then(function (available) {
        vm.pdfPreviewAvailable = available;
      });
    })();
  }
})();
