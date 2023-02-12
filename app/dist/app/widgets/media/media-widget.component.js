(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.media')
      /**
       * @ngdoc directive
       * @name coyo.widgets.media.coyoMediaWidget
       * @restrict 'E'
       *
       * @description
       * A widget which contains a media feed
       *
       * @param {object} widget - media widget
       * @param {object} editMode - true when widget editing is activated
       * @param {object} settingsMode - true when widget is shown in settings dialog
       */
      .component('coyoMediaWidget', {
        templateUrl: 'app/widgets/media/media-widget.html',
        bindings: {
          widget: '=',
          editMode: '<',
          settingsMode: '<'
        },
        controller: 'mediaWidgetController'
      })
      .controller('mediaWidgetController', mediaWidgetController);


  function mediaWidgetController($scope, coyoEndpoints, lightBoxModalService, contentTypeService) {
    var vm = this;
    vm.previewUrl = coyoEndpoints.sender.preview;

    vm.$onInit = _init;
    vm.isImage = isImage;
    vm.isVideo = isVideo;
    vm.openLightBoxModal = openLightBoxModal;

    function isImage(contentType) {
      return contentTypeService.isImage(contentType);
    }

    function isVideo(contentType) {
      return contentTypeService.isVideo(contentType);
    }

    function openLightBoxModal(mediaId) {
      lightBoxModalService.open(vm.widget.settings, mediaId);
    }

    function _init() {
      var unregisterWatch = $scope.$watch(function () {
        return vm.widget.settings;
      }, function (before, after) {
        if (before !== after) {
          updateModels();
        }
      });
      $scope.$on('$destroy', unregisterWatch);
      updateModels();
    }

    function updateModels() {
      if (vm.widget.settings) {
        vm.album = vm.widget.settings.album;
        vm.media = vm.widget.settings._media;
      }
    }
  }
})(angular);
