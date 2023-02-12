(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.video')
      .component('coyoVideoWidget', videoWidget())
      .controller('VideoWidgetController', VideoWidgetController);

  /**
   * @ngdoc directive
   * @name coyo.widgets.video:coyoVideoWidget
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Renders the widget to display a single video.
   *
   * @param {object} widget
   * The widget configuration
   */
  function videoWidget() {
    return {
      templateUrl: 'app/widgets/video/video-widget.html',
      bindings: {
        widget: '<'
      },
      controller: 'VideoWidgetController',
      controllerAs: '$ctrl'
    };
  }

  function VideoWidgetController($element, $sce, oembedVideoService) {
    var vm = this;
    vm.onInit = onInit;

    function onInit() {
      vm.fromBackend = angular.isDefined(vm.widget.settings.backendData);
      if (vm.fromBackend) {
        vm.videoUrl = vm.widget.settings.backendData.videoUrl;
        vm.ratio = vm.widget.settings.backendData.ratio;
      } else {
        var url = vm.widget.settings.url;
        var container = $element.parent().parent();
        var videoHtml = oembedVideoService.createByUrl(url, container[0]);
        if (videoHtml) {
          vm.videoHtml = $sce.trustAsHtml(videoHtml.prop('outerHTML'));
          vm.ratio = 56.25;
        } else {
          vm.error = true;
        }
      }
    }
  }

})(angular);
