(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .factory('lightBoxModalService', lightBoxModalService)
      .controller('LightBoxModalController', LightBoxModalController);

  /**
   * @ngdoc service
   * @name  commons.ui.lightBoxModalService
   *
   * @description
   * Service to show modal with light box to display media (images or videos)
   *
   * @requires $uibModal
   */
  function lightBoxModalService($uibModal) {

    return {
      open: open,
      close: close
    };

    /**
     * @ngdoc method
     * @name commons.ui.lightBoxModalService#open
     * @methodOf commons.ui.lightBoxModalService
     *
     * @description
     * Open modal with light box
     *
     * @param {object[]=} model
     * The model containing the media files and the album settings such as title or description.
     *
     * @param {string=} initialMediaId
     * Optional, if set, determines with which media item the light box will start and display it.
     *
     * @returns {object} modalDetails
     * Returns a promise
     */
    function open(model, initialMediaId) {
      return $uibModal.open({
        animation: true,
        backdrop: 'static',
        templateUrl: 'app/commons/ui/components/light-box/light-box-modal.html',
        controller: 'LightBoxModalController',
        controllerAs: '$ctrl',
        resolve: {
          model: function () {
            return model;
          },
          initialMediaId: function () {
            return initialMediaId;
          }
        },
        size: 'xl',
        bindToController: true
      });
    }

    /**
     * @ngdoc method
     * @name  commons.ui.lightBoxModalService#close
     * @methodOf commons.ui.lightBoxModalService
     *
     * @description
     * Closes the modal
     *
     * @param {object} uibModalInstance
     * Instance of the current modal
     */
    function close(uibModalInstance) {
      uibModalInstance.dismiss();
    }
  }

  function LightBoxModalController($scope, $uibModalInstance, $interval, $window, DocumentModel, coyoEndpoints,
                                   backendUrlService, contentTypeService, model, initialMediaId) {
    var vm = this;
    vm.album = model.album;
    vm.media = _.sortBy(model._media, [function (media) {
      return media.sortOrderId;
    }]);
    vm.previewUrl = coyoEndpoints.sender.preview;
    vm.downloadUrl = undefined;
    vm.currentMedia = undefined;
    vm.showControls = true;
    var eventListenerName = 'lightbox-poweruserkeys';

    vm.$onInit = _init;
    vm.isImage = isImage;
    vm.isVideo = isVideo;
    vm.loadPrevious = loadPrevious;
    vm.loadNext = loadNext;
    vm.isPaused = isPaused;
    vm.keystroke = keystroke;
    vm.close = close;

    function isImage() {
      return contentTypeService.isImage(vm.currentMedia.contentType);
    }

    function isVideo() {
      return contentTypeService.isVideo(vm.currentMedia.contentType);
    }

    function loadPrevious() {
      var index = _.findIndex(vm.media, ['id', vm.currentMedia.id]);
      if (!_.isUndefined(index)) {
        var nextIndex = --index;
        vm.currentMedia =
            nextIndex >= 0 && nextIndex < vm.media.length ? vm.media[nextIndex] : vm.media[vm.media.length - 1];
      } else {
        vm.currentMedia = vm.media[0];
      }
    }

    function loadNext() {
      var index = _.findIndex(vm.media, ['id', vm.currentMedia.id]);
      if (!_.isUndefined(index)) {
        var nextIndex = ++index;
        vm.currentMedia = nextIndex < vm.media.length ? vm.media[nextIndex] : vm.media[0];
      } else {
        vm.currentMedia = vm.media[0];
      }
    }

    function getVideoElement() {
      return _.find(angular.element.find('video'), function (video) {
        return video.currentSrc.indexOf(vm.currentMedia.id) > -1;
      });
    }

    function isPaused() {
      var video = getVideoElement();
      return !_.isUndefined(video) ? !!video.paused : false;
    }

    function play() {
      var video = getVideoElement();
      if (!_.isUndefined(video)) {
        video.play();
      }
    }

    function pause() {
      var video = getVideoElement();
      if (!_.isUndefined(video)) {
        video.pause();
      }
    }

    function getCurrentVolume() {
      var video = getVideoElement();
      return !_.isUndefined(video) ? video.volume : 0;
    }

    function volumeUp() {
      var video = getVideoElement();
      var currentVolume = getCurrentVolume();
      if (!_.isUndefined(video) && currentVolume < 1) {
        updateCurrentVolume(currentVolume + 0.1);
      }
    }

    function volumeDown() {
      var video = getVideoElement();
      var currentVolume = getCurrentVolume();
      if (!_.isUndefined(video) && currentVolume > 0) {
        updateCurrentVolume(currentVolume - 0.1);
      }
    }

    function clamp(num, min, max) {
      return num <= min ? min : num >= max ? max : num;
    }

    function updateCurrentVolume(newValue) {
      var video = getVideoElement();
      if (!_.isUndefined(video) && !_.isUndefined(newValue)) {
        getVideoElement().volume = clamp(newValue, 0, 1);
      }
    }

    function jumpTo(scale) {
      var video = getVideoElement();
      if (!_.isUndefined(scale) && !_.isUndefined(video)) {
        video.currentTime = getDuration() * scale;
      }
    }

    function getDuration() {
      var video = getVideoElement();
      return !_.isUndefined(video) ? Math.round(video.duration) : 0;
    }

    function keystroke($event) {
      if ($event.keyCode === 37) {
        loadPrevious();
      } else if ($event.keyCode === 39) {
        loadNext();
      } else if ($event.keyCode === 38) {
        volumeUp();
      } else if ($event.keyCode === 40) {
        volumeDown();
      } else if ($event.keyCode === 32 && vm.isVideo()) {
        isPaused() ? play() : pause();
      } else if ($event.keyCode === 48) {
        jumpTo(0);
      } else if ($event.keyCode === 49) {
        jumpTo(0.1);
      } else if ($event.keyCode === 50) {
        jumpTo(0.2);
      } else if ($event.keyCode === 51) {
        jumpTo(0.3);
      } else if ($event.keyCode === 52) {
        jumpTo(0.4);
      } else if ($event.keyCode === 53) {
        jumpTo(0.5);
      } else if ($event.keyCode === 54) {
        jumpTo(0.6);
      } else if ($event.keyCode === 55) {
        jumpTo(0.7);
      } else if ($event.keyCode === 56) {
        jumpTo(0.8);
      } else if ($event.keyCode === 57) {
        jumpTo(0.9);
      } else if ($event.keyCode === 27) {
        vm.close();
      }
    }

    function close() {
      $window.removeEventListener(eventListenerName, keystroke);
      $uibModalInstance.close();
    }

    function setDownloadUrl() {
      vm.downloadUrl = backendUrlService.getUrl() + DocumentModel.$url({
        senderId: vm.currentMedia.senderId,
        id: vm.currentMedia.id
      });
    }

    function _init() {
      if (!_.isUndefined(initialMediaId)) {
        vm.currentMedia = _.find(vm.media, ['id', initialMediaId]);
      } else if (_.isUndefined(vm.currentMedia)) {
        vm.currentMedia = vm.media[0];
      }

      setDownloadUrl();

      $scope.$watch(function getValue() {
        return vm.currentMedia;
      }, function mediaChanged(newValue, oldValue) {
        if (newValue !== oldValue) {
          setDownloadUrl();
        }
      }, true);

      $interval(function () {
        vm.showControls = vm.isVideo() && !_.isUndefined(getVideoElement()) ? isPaused() : true;
      }, 200);

      $window.addEventListener(eventListenerName, keystroke);
    }
  }
})(angular);
