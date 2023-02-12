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
   * Renders a link preview for a given HTTP-Link.
   *
   */
  angular
      .module('commons.ui')
      .component('coyoLinkPreview', linkPreview())
      .controller('LinkPreviewController', LinkPreviewController);

  function linkPreview() {
    return {
      restrict: 'E',
      templateUrl: 'app/commons/ui/components/web-preview/link-preview.html',
      scope: {},
      bindings: {
        ngModel: '=',
        editMode: '=',
        focusVar: '=?'
      },
      controller: 'LinkPreviewController',
      controllerAs: '$ctrl'
    };
  }

  function LinkPreviewController(backendUrlService, webPreviewService) {
    var vm = this;
    vm.backendUrl = backendUrlService.getUrl();
    vm.isEdit = isEdit;
    vm.isLoadingLinkPreview = isLoadingLinkPreview;
    vm.getAbsoluteUrl = getAbsoluteUrl;
    vm.deletePreview = deletePreview;

    function isEdit() {
      return !!vm.editMode;
    }

    function isLoadingLinkPreview() {
      return webPreviewService.isLoading();
    }

    function getAbsoluteUrl(url) {
      return vm.backendUrl + url;
    }

    function deletePreview(url) {
      var index = _.findIndex(vm.ngModel, ['url', url]);
      if (!_.isUndefined(index)) {
        vm.ngModel.splice(index, 1);
      }
    }
  }
})(angular);
