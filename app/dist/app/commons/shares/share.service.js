(function (angular) {
  'use strict';

  angular
      .module('commons.shares')
      .factory('shareService', shareService);

  /**
   * @ngdoc service
   * @name commons.shares.shareService
   *
   * @description
   * Service to share entities.
   */
  function shareService(modalService, TimelineShareModel) {

    return {
      share: share
    };

    /**
     * @ngdoc method
     * @name commons.shares.shareService#share
     * @methodOf commons.shares.shareService
     *
     * @description
     * Shares the given entity.
     *
     * @param {string} userId the current user ID
     * @param {string} itemId the item ID
     * @param {string} recipient the original recipient sender
     */
    function share(userId, itemId, typeName, parentIsPublic) {
      return modalService.open({
        size: 'md',
        templateUrl: 'app/commons/shares/share.modal.html',
        controller: 'ShareModalController',
        resolve: {
          parentIsPublic: function () {
            return parentIsPublic;
          }
        }
      }).result.then(function (data) {
        return TimelineShareModel.share(typeName, {
          itemId: itemId,
          recipientId: data.recipient.id,
          authorId: data.author.id,
          data: {
            message: data.message
          }
        });
      });
    }
  }

})(angular);
