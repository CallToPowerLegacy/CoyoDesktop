(function (angular) {
  'use strict';

  LinkPreviewModel.$inject = ['$http', 'restResourceFactory', 'coyoEndpoints'];
  angular
      .module('coyo.domain')
      .factory('LinkPreviewModel', LinkPreviewModel);

  /**
   * @ngdoc service
   * @name coyo.domain.LinkPreviewModel
   *
   * @description
   * Provides the Coyo link preview model.
   *
   * @requires $http
   * @requires restResourceFactory
   * @requires commons.config.coyoEndpoints
   */
  function LinkPreviewModel($http, restResourceFactory, coyoEndpoints) {
    var LinkPreviewModel = restResourceFactory({
      url: coyoEndpoints.webPreviews.generate
    });

    // class members
    angular.extend(LinkPreviewModel, {

      /**
       * @ngdoc function
       * @name coyo.domain.LinkPreviewModel#generate
       * @methodOf coyo.domain.LinkPreviewModel
       *
       * @description
       * Find urls and generate link previews for them.
       *
       * @params {string} urls The urls found in a post
       *
       * @returns {promise} A $http promise
       */
      generateWebPreviews: function (urls) {
        return this.$post(coyoEndpoints.webPreviews.generate, {
          urls: urls
        });
      },

      /**
       * @ngdoc function
       * @name coyo.domain.LinkPreviewModel#loadTemporaryLinkPreviewImage
       * @methodOf coyo.domain.LinkPreviewModel
       *
       * @description
       * Loads the image of a temporary link preview (while the user still edits a post).
       *
       * @param {string} blobUid the uid for a temporary blob
       * @param {string} contentType the content type for the temporary blob
       *
       * @returns {promise} A $http promise that resolves to the image blob of a (LinkPreview)
       */
      loadTemporaryLinkPreviewImage: function (blobUid, contentType) {
        return this.$get(coyoEndpoints.webPreviews.tempImage.replace('{{imageBlobUid}}', blobUid) + contentType);
      },

      /**
       * @ngdoc function
       * @name coyo.domain.LinkPreviewModel#loadLinkPreviewImage
       * @methodOf coyo.domain.LinkPreviewModel
       *
       * @description
       * Loads the image of a temporary link preview (while the user still edits a post).
       *
       * @param {string} id the if of the link preview
       *
       * @returns {promise} A $http promise that resolves to the image blob of a (LinkPreview)
       */
      loadLinkPreviewImage: function (id) {
        return this.$get(coyoEndpoints.webPreviews.image.replace('{{id}}', id));
      }
    });

    return LinkPreviewModel;
  }

})(angular);
