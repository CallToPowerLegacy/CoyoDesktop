(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoVideoReference', VideoReference)
      .controller('VideoReferenceController', VideoReferenceController);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoVideoReference:coyoVideoReference
   * @scope
   * @restrict 'E'
   * @element OWN
   *
   * @description
   * Renders a video from the file library as a video element. Supports rendering different image sizes for
   * different screen sizes and also checks whether the display supports retina.
   *
   * @param {string} file
   * The file to be rendered.
   *
   * @param {string} groupId
   * The id of the file's group (which can be effectively the sender id).
   *
   * @param {string} url
   * The url under which the file can be fetched.
   *
   * @param {object=} showControls
   * Defines whether to show the browsers inline controls
   *
   * @requires coyo.domain.FileModel
   * @requires coyo.domain.DocumentModel
   * @requires commons.resource.backendUrlService
   * @requires $scope
   * @requires $httpParamSerializerJQLike
   */
  function VideoReference() {
    return {
      restrict: 'E',
      templateUrl: 'app/commons/ui/components/file-library/video-reference/video-reference.html',
      scope: {},
      bindToController: {
        file: '<',
        groupId: '<',
        url: '<',
        showControls: '<?',
        showPreview: '<?'
      },
      controller: 'VideoReferenceController',
      controllerAs: '$ctrl'
    };
  }

  function VideoReferenceController($scope, $http, backendUrlService, errorService) {
    var vm = this;
    vm.isProcessing = false;
    vm.previewAvailable = false;

    function setVideoUrl() {
      if (vm.file.id && vm.groupId) {
        vm.isProcessing = true;

        vm.videoUrl = _getVideoUrl();

        $http.head(vm.videoUrl).then(function () {
          vm.previewAvailable = true;
        }).catch(function (errorResponse) {
          errorService.suppressNotification(errorResponse);
          vm.previewAvailable = errorResponse.status !== 404;
        }).finally(function () {
          vm.isProcessing = false;
        });
      }
    }

    function _getVideoUrl() {
      return backendUrlService.getUrl() + vm.url.replace('{{groupId}}', vm.groupId).replace('{{id}}', vm.file.id)
          + '/stream';
    }

    (function _init() {
      $scope.$watch(function getValue() {
        return vm.file.id;
      }, function changed(newValue, oldValue) {
        if (newValue !== oldValue) {
          setVideoUrl();
        }
      }, true);

      setVideoUrl();
    })();
  }
})(angular);
