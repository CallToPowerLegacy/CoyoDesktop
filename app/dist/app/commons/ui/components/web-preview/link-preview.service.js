(function (angular) {
  'use strict';

  angular
      .module('commons.resource')
      .factory('webPreviewService', webPreviewService);

  /**
   * @ngdoc service
   * @name commons.resource.webPreviewService
   *
   * @description
   * Service for generating link previews from messages of posts in the backend.
   *
   * @requires LinkPreviewModel
   * @requires $log
   * @requires $q
   */
  function webPreviewService(LinkPreviewModel, $log, $q) {

    var deferred = $q.defer();

    var loading = {};
    var linkPreview = {};
    linkPreview.generating = false;
    linkPreview.loading = false;

    return {
      isLoading: isLoading,
      extractUrls: extractUrls,
      generateWebPreviews: generateWebPreviews,
      cancelGenerateRequest: cancelGenerateRequest,
      loadTemporaryLinkPreviewImage: loadTemporaryLinkPreviewImage,
      loadLinkPreviewImage: loadLinkPreviewImage
    };

    /**
     * @ngdoc method
     * @name commons.ui.webPreviewService#extractUrls
     * @methodOf commons.resource.webPreviewService
     *
     * @description
     * Extract urls from a text
     *
     * @param {string} text e.g. a message of a post
     *
     * @return {Array} urls the urls found in a text
     */
    function extractUrls(text) {
      var regEx = /(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/gi;
      return text.match(regEx);
    }

    /**
     * @ngdoc method
     * @name commons.ui.webPreviewService#isLoading
     * @methodOf commons.resource.webPreviewService
     *
     * @description
     * Returns if there is still an ongoing request pending for a previously requested url
     *
     * @return {boolean} true if for at least one url a response is pending from the server
     */
    function isLoading() {
      return _.includes(loading, true);
    }

    /**
     * @ngdoc method
     * @name commons.ui.webPreviewService#generateWebPreviews
     * @methodOf commons.resource.webPreviewService
     *
     * @description
     * Uploads given urls from a post to the backend to generate link previews.
     * Use a more elaborate way with deferred instead of a a direct return of the promise, as it needs to be
     * possible to reject/resolve an ongoing request for the generation of link previews when the user submits
     * the form with a post when there is no response yet - to prevent that the response is attached to the empty form.
     *
     * @param {Array} urls the urls found in a post
     *
     * @return {object} Promise that resolves to a list of objects (LinkPreview)
     */
    function generateWebPreviews(urls) {
      $log.debug('[webPreviewService] Start generating the link previews', urls);
      linkPreview.generating = true;

      deferred = $q.defer();

      var toBeFetchedUrls = new Array();

      _.forEach(urls, function (url) {
        if (_.isUndefined(loading[url]) || !loading[url]) {
          toBeFetchedUrls.push(url);
          loading[url] = true;
        }
      });

      LinkPreviewModel.generateWebPreviews(urls).then(function (response) {
        deferred.resolve(response);
      }, function (error) {
        $log.error('An error occurred while generating the link previews ', urls, error);
        deferred.reject(error);
      }).finally(function () {
        linkPreview.generating = false;
        _.forEach(urls, function (url) {
          loading[url] = false;
        });
      });

      return deferred.promise;
    }

    function cancelGenerateRequest(reason) {
      $log.debug('[webPreviewService] Cancel the request for generating link previews', reason);
      deferred.resolve();
    }

    /**
     * @ngdoc method
     * @name commons.ui.webPreviewService#loadTemporaryLinkPreviewImage
     * @methodOf commons.resource.webPreviewService
     *
     * @description
     * Retrieves the temporary link preview image for a given (temporary) blob uid and content type.
     *
     * @param {string} blobUid the uid for a temporary blob
     * @param {string} contentType the content type for the temporary blob
     *
     * @return {object} Promise that resolves to the image of a (LinkPreview)
     */
    function loadTemporaryLinkPreviewImage(blobUid, contentType) {
      $log.debug('[webPreviewService] Start retrieving the temporary link preview image ', blobUid);
      linkPreview.loading = true;

      return LinkPreviewModel.loadTemporaryLinkPreviewImage(blobUid, contentType).finally(function () {
        linkPreview.loading = false;
      });
    }

    /**
     * @ngdoc method
     * @name commons.ui.webPreviewService#loadLinkPreviewImage
     * @methodOf commons.resource.webPreviewService
     *
     * @description
     * Retrieves the link preview image for a given blob uid and content type.
     *
     * @param {string} id the id of the link preview
     * @param {string} contentType the content type for the blob
     *
     * @return {object} Promise that resolves to the image of a (LinkPreview)
     */
    function loadLinkPreviewImage(id) {
      $log.debug('[webPreviewService] Start retrieving the link preview image ', id);
      linkPreview.loading = true;

      return LinkPreviewModel.loadLinkPreviewImage(id).finally(function () {
        linkPreview.loading = false;
      });
    }
  }

})(angular);
