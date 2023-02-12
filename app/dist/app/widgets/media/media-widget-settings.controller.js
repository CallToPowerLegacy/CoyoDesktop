(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.media')
      .controller('MediaWidgetSettingsController', MediaWidgetSettingsController);

  function MediaWidgetSettingsController($scope, $q, mediaWidgetSelectionService,
                                         coyoEndpoints, modalService, contentTypeService) {
    var vm = this;
    vm.model = {album: {}, media: []};
    vm.widget = $scope.model;
    vm.widget.settings = vm.widget.settings || {};
    vm.previewUrl = coyoEndpoints.sender.preview;

    vm.tabs = {
      active: 1,
      MEDIA: 1,
      INFORMATION: 2
    };

    vm.$onInit = _init;

    vm.switchTab = switchTab;
    vm.isMediaTab = isMediaTab;
    vm.isInformationTab = isInformationTab;
    vm.isImage = isImage;
    vm.isVideo = isVideo;
    vm.togglePreview = togglePreview;
    vm.toggleAllPreviews = toggleAllPreviews;
    vm.deleteMedia = deleteMedia;
    vm.openFileLibrary = openFileLibrary;
    vm.openEditDescriptionModal = openEditDescriptionModal;
    vm.treeOptions = _buildTreeOptions();


    function switchTab(tab) {
      vm.tabs.active = tab;
    }

    function isMediaTab() {
      return vm.tabs.active === vm.tabs.MEDIA;
    }

    function isInformationTab() {
      return vm.tabs.active === vm.tabs.INFORMATION;
    }

    function isImage(contentType) {
      return contentTypeService.isImage(contentType);
    }

    function isVideo(contentType) {
      return contentTypeService.isVideo(contentType);
    }

    function togglePreview(media) {
      media.preview = _.isUndefined(media.preview) ? true : !media.preview;
    }

    function deleteMedia(media) {
      var index = _.findIndex(vm.model.media, {id: media.id});
      if (index > -1) {
        vm.model.media.splice(index, 1);
        _.each(_.slice(vm.model.media, index), function (media) {
          media.sortOrderId--;
        });
      }
    }

    function openFileLibrary() {
      var existingFilesCount = vm.model.media ? vm.model.media.length : 0;
      mediaWidgetSelectionService.selectMedia().then(function (selectedFiles) {
        _.each(selectedFiles, function (media, index) {
          if (!media.sortOrderId) {
            media.sortOrderId = index + existingFilesCount;
          }
          vm.model.media.push(media);
        });
      });
    }

    function openEditDescriptionModal(media) {
      modalService.open({
        templateUrl: 'app/widgets/media//media-widget-edit-description-modal.html',
        controller: 'MediaWidgetEditDescriptionModalController',
        controllerAs: '$modal',
        resolve: {
          media: function () {
            return media;
          }
        }
      }).result.then(function (newDescription) {
        media.description = newDescription;
      });
    }

    function _buildTreeOptions() {
      return {
        dropped: function (event) {
          if (event.source.index !== event.dest.index) {
            var from = event.source.index;
            var to = event.dest.index;

            /* find index of dragged item */
            var indexOfMoved = _.findIndex(vm.model.media, function (media) {
              return media.sortOrderId === from;
            });

            /* based on whether the item was moved up or down, increase or decrease all sort order ids of items between
               old and new position */
            if (from < to) {
              _.each(vm.model.media, function (media) {
                if (media.sortOrderId > from && media.sortOrderId <= to) {
                  media.sortOrderId--;
                }
              });
            } else if (to < from) {
              _.each(vm.model.media, function (media) {
                if (media.sortOrderId >= to && media.sortOrderId < from) {
                  media.sortOrderId++;
                }
              });
            }

            /* finally set new sort order id on dragged item */
            vm.model.media[indexOfMoved].sortOrderId = to;
          }
        }
      };
    }

    function onBeforeSave() {
      vm.widget.settings.album = vm.model.album;
      vm.widget.settings._media = vm.model.media;
      return $q.resolve();
    }

    function _init() {
      $scope.saveCallbacks.onBeforeSave = onBeforeSave;

      if (vm.widget.settings.album) {
        vm.model.album = vm.widget.settings.album;
      }
      if (vm.widget.settings._media) {
        vm.model.media = vm.widget.settings._media;
      }

      $scope.$watch(function getValue() {
        return vm.model;
      }, function collectionChanged(newValue, oldValue) {
        if (newValue !== oldValue) {
          vm.toggleAllPreviews();
        }
      }, true);
    }

    function toggleAllPreviews() {
      var previews = _.find(vm.model.media, 'preview');
      if (_.isUndefined(previews) || previews.length === 0) {
        _.each(vm.model.media, function (media) {
          media.preview = true;
        });
      }
    }
  }
})(angular);
