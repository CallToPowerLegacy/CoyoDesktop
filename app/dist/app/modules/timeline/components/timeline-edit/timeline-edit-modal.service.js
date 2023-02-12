(function () {
  'use strict';

  angular.module('coyo.timeline')
      .factory('timelineEditModalService', timelineEditModalService)
      .controller('TimelineEditModalController', TimelineEditModalController);

  /**
   * @ngdoc service
   * @name coyo.timeline.timelineEditModalService
   *
   * @description
   * Opens a modal with a textarea to edit a timeline post. Timeline posts can only be edited if they have no comments
   * or likes and if the current user is the author.
   *
   * @requires modalService
   */
  function timelineEditModalService(modalService) {
    return {
      open: open
    };

    /**
     * @ngdoc method
     * @name coyo.timeline.timelineEditModalService#open
     * @methodOf coyo.timeline.timelineEditModalService
     *
     * @description
     * Opens the modal to edit the given timeline item. Fetches a new up-to-date version of the item and works on it
     * - so the original item is only affected when the user hits the save button.
     *
     * @param {object} item
     * The timeline item to edit the text of.
     *
     * @param {object} item.data
     * The timeline items data object which contains the message to edit.
     *
     * @param {String} item.data.message
     * The message to edit. Must not be undefined.
     *
     * @returns {object} A promise which is called after the message was updated successfully.
     */
    function open(item) {
      return modalService.open({
        templateUrl: 'app/modules/timeline/components/timeline-edit/timeline-edit-modal.html',
        controller: 'TimelineEditModalController',
        resolve: {
          item: /*@ngInject*/ function (TimelineItemModel) {
            // resolve a fresh copy of the item
            return new TimelineItemModel({id: item.id}).getWithPermissions(false, {}, ['delete', 'manage', 'accessoriginalauthor', 'like', 'comment', 'share']);
          }
        }
      }).result;
    }

  }

  function TimelineEditModalController($uibModalInstance, oembedVideoService, $sce, item) {
    var vm = this;

    vm.item = item;
    vm.error = !item._permissions.manage;

    vm.save = save;

    function save() {
      _.set(vm.item, 'data.edited', true);
      vm.item.update().then(function (updatedItem) {
        $uibModalInstance.close(updatedItem);

        _.forEach(updatedItem.videoPreviews, function (videoPreview) {
          var videoElement = oembedVideoService.createEmbedCode(videoPreview, angular.element('<div>'));
          if (videoElement) {
            videoPreview.embedCode = {
              url: videoPreview.videoUrl,
              html: $sce.trustAsHtml(videoElement.prop('outerHTML')),
              heightPercentage: oembedVideoService.getHeightPercentage(videoElement)
            };
          }
        });
      }).catch(function () {
        vm.error = true;
      });
    }

  }

})();
