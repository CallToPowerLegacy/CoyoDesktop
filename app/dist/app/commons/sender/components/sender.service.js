(function (angular) {
  'use strict';

  angular
      .module('commons.sender')
      .factory('senderService', senderService);

  /**
   * @ngdoc service
   * @name commons.sender.senderService
   *
   * @description
   * A service to manage senders. In particular to change sender images (avatar, cover).
   *
   * @requires coyoEndpoints
   * @requires imageUploadModal
   */
  function senderService(coyoEndpoints, imageUploadModal) {

    return {
      changeAvatar: changeAvatar,
      changeCover: changeCover
    };

    /**
     * @ngdoc method
     * @name commons.sender.senderService#changeAvatar
     * @methodOf commons.sender.senderService
     *
     * @description
     * Returns a function that opens a modal dialog to upload, crop and save a new avatar image for the given sender.
     *
     * @param {object} options
     * The image upload modal options.
     */
    function changeAvatar(options) {
      return function (sender) {
        var modalOptions = angular.merge({
          url: coyoEndpoints.sender.avatar.replace('{id}', sender.id),
          areaType: 'rectangle',
          cropAspectRatio: '1',
          imageSize: {w: 320, h: 320}
        }, options);

        modalOptions.canDelete = !!sender.imageUrls.avatar;

        return imageUploadModal.open(modalOptions).result.then(function (data) {
          angular.extend(sender.imageUrls, data);
        });
      };
    }

    /**
     * @ngdoc method
     * @name commons.sender.senderService#changeCover
     * @methodOf commons.sender.senderService
     *
     * @description
     * Returns a function that opens a modal dialog to upload, crop and save a new cover image for the given sender.
     *
     * @param {object} options
     * The image upload modal options.
     */
    function changeCover(options) {
      return function changeCover(sender) {
        var modalOptions = angular.merge({
          url: coyoEndpoints.sender.cover.replace('{id}', sender.id),
          areaType: 'rectangle',
          cropAspectRatio: '6',
          imageSize: {w: 1920, h: 320}
        }, options);

        modalOptions.canDelete = !!sender.imageUrls.cover;

        return imageUploadModal.open(modalOptions).result.then(function (data) {
          angular.extend(sender.imageUrls, data);
        });
      };
    }
  }

})(angular);
