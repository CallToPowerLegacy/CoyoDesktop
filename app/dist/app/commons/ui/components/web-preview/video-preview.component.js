(function (angular) {
  'use strict';

  /**
   * @ngdoc directive
   * @name commons.ui:webPreviews
   * @scope
   * @restrict 'E'
   * @element OWN
   *
   * @description
   * Renders a video preview for a given HTTP-Link.
   *
   */
  angular
      .module('commons.ui')
      .component('coyoVideoPreview', videoPreview())
      .controller('VideoPreviewController', VideoPreviewController);

  function videoPreview() {
    return {
      restrict: 'E',
      templateUrl: 'app/commons/ui/components/web-preview/video-preview.html',
      scope: {},
      bindings: {
        ngModel: '=',
        editMode: '=',
        focusVar: '=?'
      },
      controller: 'VideoPreviewController',
      controllerAs: '$ctrl'
    };
  }

  function VideoPreviewController($sce, $element, webPreviewService, oembedVideoService) {
    var vm = this;
    vm.$onInit = _init();
    vm.isEdit = isEdit;
    vm.isLoadingVideoPreview = isLoadingVideoPreview;
    vm.deletePreview = deletePreview;

    function _init() {
      _.forEach(vm.ngModel, function (videoPreview) {
        var videoElement = oembedVideoService.createEmbedCode(videoPreview, $element[0].parentElement);
        if (videoElement) {
          videoPreview.embedCode = {
            url: videoPreview.videoUrl,
            html: $sce.trustAsHtml(videoElement.prop('outerHTML')),
            heightPercentage: oembedVideoService.getHeightPercentage(videoElement)
          };
        }
      });
    }

    function isEdit() {
      return !!vm.editMode;
    }

    function isLoadingVideoPreview() {
      return webPreviewService.isLoading();
    }

    function deletePreview(videoUrl) {
      var index = _.findIndex(vm.ngModel, ['videoUrl', videoUrl]);
      if (!_.isUndefined(index)) {
        vm.ngModel.splice(index, 1);
      }
    }
  }
})(angular);
