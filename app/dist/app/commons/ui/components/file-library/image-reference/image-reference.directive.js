(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoImageReference', ImageReference)
      .controller('ImageReferenceController', ImageReferenceController);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoImageReference:coyoImageReference
   * @scope
   * @restrict 'E'
   * @element OWN
   *
   * @description
   * Renders an image from the file library as a picture element. Supports rendering different image sizes for
   * different screen sizes and also checks whether the display supports retina.
   *
   * @param {string} fileId
   * The id of the file to be rendered.
   *
   * @param {string} senderId
   * The id of the file's sender.
   *
   * @param {object=} sizeDefinitions
   * A map defining which screen size should result in which image size. The keys are defining the screen's size via
   * bootstrap style identifiers: `screen-xs`, `screen-sm`, `screen-md` and `screen-lg`. The image sizes are defined in
   * shirt sizes starting from XS to XXL. The image's width described by one of those sizes is defined in the backend.
   *
   * It is also possible to define a default size by using the `default` key. The directive checks whether the device
   * supports retina and will shift the image sizes up automatically if retina is supported.
   *
   * If the `sizeDefintitions` parameter is not set, the image will be rendered in it's original size. This is not
   * recommended since this might result in large images being loaded for mobile devices.
   *
   * Example:
   * ```
   * {
   *   'default': 'M',
   *   'screen-lg': 'XL'
   * }
   * ```
   *
   * In this example the image would be rendered in the size M (medium) if the screen size is smaller than 'screen-lg'.
   * Starting with a large screen, an image of the size XL (extra large) will be rendered. If the devices display
   * supports retina the image sizes 'L' and 'XXL' are rendered accordingly.
   *
   * @requires coyo.domain.FileModel
   * @requires coyo.domain.DocumentModel
   * @requires commons.resource.backendUrlService
   * @requires $log
   * @requires $scope
   * @requires $httpParamSerializerJQLike
   */
  function ImageReference() {
    return {
      restrict: 'E',
      templateUrl: 'app/commons/ui/components/file-library/image-reference/image-reference.html',
      scope: {},
      bindToController: {
        fileId: '<',
        senderId: '<',
        sizeDefinitions: '<?',
        placeholderUrl: '<?'
      },
      controller: 'ImageReferenceController',
      controllerAs: '$ctrl'
    };
  }

  function ImageReferenceController($log, $http, $scope, $httpParamSerializerJQLike, $timeout, FileModel, DocumentModel,
                                    backendUrlService, socketService, errorService) {
    var vm = this;
    vm.previewAvailable = true;

    var unsubscribePreviewStatusFn;
    var fileStatus;
    var urlXsFile;

    var retinaLookup = {
      XS: 'S',
      S: 'M',
      M: 'L',
      L: 'XL',
      XL: 'XXL',
      XXL: 'ORIGINAL',
      ORIGINAL: 'ORIGINAL'
    };

    function setImageUrl() {
      if (vm.fileId && vm.senderId) {
        FileModel.get({id: vm.fileId, senderId: vm.senderId}).then(function (file) {
          var image = {
            fileId: vm.fileId,
            senderId: vm.senderId,
            modified: file.modified
          };

          var baseUrl = _getBaseUrl(image);
          var queryParams = {modified: image.modified};

          vm.imageUrl = baseUrl + '?' + $httpParamSerializerJQLike(queryParams);
          vm.imageUrls = {};

          if (vm.sizeDefinitions) {
            if (!vm.sizeDefinitions.default) {
              $log.error('Default missing: If providing size definitions you must specify an image size for default.');
              return;
            }
            _.forEach(vm.sizeDefinitions, function (imageSize, screenSize) {
              if (screenSize === 'default') {
                vm.defaultUrl = _getUrlForSize(baseUrl, queryParams, imageSize);
                if (retinaLookup[imageSize]) {
                  vm.defaultUrl += ', ' + _getUrlForSize(baseUrl, queryParams, retinaLookup[imageSize]) + ' 2x';
                }
              } else {
                vm.imageUrls[screenSize] = _getUrlForSize(baseUrl, queryParams, imageSize);
                if (retinaLookup[imageSize]) {
                  vm.imageUrls[screenSize] +=
                      ', ' + _getUrlForSize(baseUrl, queryParams, retinaLookup[imageSize]) + ' 2x';
                }
              }
            });

            // Request the smallest image variant to trigger a request to get socket responses
            // This also prevents "flickering" when requesting a preview that is non-existent in the UI
            // Don't cache this request client-side, otherwise the backend cannot send a websocket update!
            urlXsFile = _getUrlForSize(baseUrl, queryParams, 'XS');
          }

          $http.get(urlXsFile).then(function () {
            vm.previewAvailable = true;
            vm.isProcessing = false;
          }).catch(function (errorResponse) {
            errorService.suppressNotification(errorResponse);
          });
        }).catch(function (errorResponse) {
          errorService.suppressNotification(errorResponse);
          vm.isProcessing = false;
          vm.previewAvailable = false;
        });
      } else {
        vm.isProcessing = false;
        vm.previewAvailable = false;
      }
    }

    function _getUrlForSize(baseUrl, queryParams, size) {
      var params = angular.extend({}, queryParams, {'type': size});
      return baseUrl + '?' + $httpParamSerializerJQLike(params);
    }

    function _getBaseUrl(image) {
      return backendUrlService.getUrl() + DocumentModel.$url({
        senderId: image.senderId,
        id: image.fileId
      });
    }

    function _unsubscribeFileStatus() {
      if (unsubscribePreviewStatusFn) {
        unsubscribePreviewStatusFn();
        unsubscribePreviewStatusFn = undefined;
      }
    }

    function _previewStatusChange(data) {
      fileStatus = data.content.status;

      switch (fileStatus) {
        case 'CANNOT_PROCESS':
          vm.isProcessing = false;
          break;
        case 'PROCESSING':
          $timeout(function () {
            vm.isProcessing = true;
          });
          break;
        case 'SUCCESS':
          $timeout(function () {
            vm.isProcessing = false;
            vm.previewAvailable = true;
          });
          break;
        case 'FAILED':
          _unsubscribeFileStatus();
          $timeout(function () {
            vm.isProcessing = false;
            vm.previewAvailable = false;
          });
          break;
        default:
          break;
      }
    }

    (function _init() {
      unsubscribePreviewStatusFn =
          socketService.subscribe('/topic/item.' + vm.senderId + '.' + vm.fileId + '.preview.status',
              _previewStatusChange);
      $scope.$on('$destroy', _unsubscribeFileStatus);

      $scope.$watch(function () {
        return vm.fileId;
      }, function () {
        vm.isProcessing = true;
        setImageUrl();
      });

      vm.isProcessing = true;
      setImageUrl();
    })();

  }

})(angular);
