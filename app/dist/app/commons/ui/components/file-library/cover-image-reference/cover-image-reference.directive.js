(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoCoverImageReference', CoverImageReference)
      .controller('CoverImageReferenceController', CoverImageReferenceController);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoCoverImageReference:coyoCoverImageReference
   * @scope
   * @restrict 'E'
   * @element OWN
   *
   * @description
   * Renders an image from the file library as a square cover, by using css to set the image as background-element. Supports
   * rendering different image sizes for different screen sizes and also checks whether the display supports retina.
   *
   * @param {string} fileId
   * The id of the file to be rendered.
   *
   * @param {string} senderId
   * The id of the file's sender.
   *
   * @param {object=} sizeDefinitions
   * A map defining which screen size should result in which coverImage size. The keys are defining the screen's size via
   * bootstrap style identifiers: `screen-xs`, `screen-sm`, `screen-md` and `screen-lg`. The coverImage sizes are defined in
   * shirt sizes starting from XS to XXL. The coverImage's width described by one of those sizes is defined in the backend.
   *
   * It is also possible to define a default size by using the `default` key. The directive checks whether the device
   * supports retina and will shift the coverImage sizes up automatically if retina is supported.
   *
   * If the `sizeDefintitions` parameter is not set, the coverImage will be rendered in it's original size. This is not
   * recommended since this might result in large coverImages being loaded for mobile devices.
   *
   * Example:
   * ```
   * {
   *   'default': 'M',
   *   'screen-lg': 'XL'
   * }
   * ```
   *
   * In this example the coverImage would be rendered in the size M (medium) if the screen size is smaller than 'screen-lg'.
   * Starting with a large screen, an coverImage of the size XL (extra large) will be rendered. If the devices display
   * supports retina the coverImage sizes 'L' and 'XXL' are rendered accordingly.
   *
   * @requires coyo.domain.FileModel
   * @requires coyo.domain.DocumentModel
   * @requires commons.resource.backendUrlService
   * @requires $log
   * @requires $scope
   * @requires $rootScope
   * @requires $httpParamSerializerJQLike
   */
  function CoverImageReference() {
    return {
      restrict: 'E',
      templateUrl: 'app/commons/ui/components/file-library/cover-image-reference/cover-image-reference.html',
      scope: {},
      bindToController: {
        fileId: '<',
        senderId: '<',
        sizeDefinitions: '<?'
      },
      controller: 'CoverImageReferenceController',
      controllerAs: '$ctrl'
    };
  }

  function CoverImageReferenceController($log, $http, $scope, $rootScope, $httpParamSerializerJQLike, $timeout,
                                         FileModel, DocumentModel, backendUrlService, socketService, errorService) {
    var vm = this;
    vm.previewAvailable = true;

    var unsubscribePreviewStatusFn;
    var unsubscribeScreenChangedFn;
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

    function setCoverImageUrl() {
      if (vm.fileId && vm.senderId) {
        FileModel.get({id: vm.fileId, senderId: vm.senderId}).then(function (file) {
          var coverImage = {
            fileId: vm.fileId,
            senderId: vm.senderId,
            modified: file.modified
          };

          var baseUrl = _getBaseUrl(coverImage);
          var queryParams = {modified: coverImage.modified};

          vm.coverImageUrl = baseUrl + '?' + $httpParamSerializerJQLike(queryParams);
          vm.coverImageUrls = {};

          if (vm.sizeDefinitions) {
            if (!vm.sizeDefinitions.default) {
              $log.error('Default missing: If providing size definitions you must specify an coverImage size for default.');
              return;
            }
            _.forEach(vm.sizeDefinitions, function (coverImageSize, screenSize) {
              if (screenSize === 'default') {
                vm.defaultUrl = _getUrlForSize(baseUrl, queryParams, coverImageSize);
              } else {
                vm.coverImageUrls[screenSize] = _getUrlForSize(baseUrl, queryParams, coverImageSize);
              }
            });

            vm.coverImageUrl = _pickUrlForScreenSize();

            // Request the smallest coverImage variant to trigger a request to get socket responses
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
      var sizeForScreen = $rootScope.isRetina && retinaLookup[size] ? retinaLookup[size] : size;
      var params = angular.extend({}, queryParams, {'type': sizeForScreen});
      return baseUrl + '?' + $httpParamSerializerJQLike(params);
    }

    function _getBaseUrl(coverImage) {
      return backendUrlService.getUrl() + DocumentModel.$url({
        senderId: coverImage.senderId,
        id: coverImage.fileId
      });
    }

    function _pickUrlForScreenSize() {
      if ($rootScope.screenSize.isXs) {
        return _getSizeOrDefault('screen-xs');
      } else if ($rootScope.screenSize.isSm) {
        return _getSizeOrDefault('screen-sm');
      } else if ($rootScope.screenSize.isMd) {
        return _getSizeOrDefault('screen-md');
      } else if ($rootScope.screenSize.isLg) {
        return _getSizeOrDefault('screen-lg');
      } else {
        return vm.defaultUrl;
      }
    }

    function _getSizeOrDefault(size) {
      return vm.coverImageUrls[size] ? vm.coverImageUrls[size] : vm.defaultUrl;
    }

    function _unsubscribeFileStatus() {
      if (unsubscribePreviewStatusFn) {
        unsubscribePreviewStatusFn();
        unsubscribePreviewStatusFn = undefined;
      }
    }

    function _unsubscribeScreenChanged() {
      if (unsubscribeScreenChangedFn) {
        unsubscribeScreenChangedFn();
        unsubscribeScreenChangedFn = undefined;
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

      unsubscribeScreenChangedFn = $rootScope.$on('screenSize:changed', function () {
        _pickUrlForScreenSize();
      });
      $scope.$on('$destroy', _unsubscribeScreenChanged);

      $scope.$watch(function () {
        return vm.fileId;
      }, function () {
        vm.isProcessing = true;
        setCoverImageUrl();
      });

      vm.isProcessing = true;
      setCoverImageUrl();
    })();

  }

})(angular);
