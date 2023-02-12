(function () {
  'use strict';

  angular
      .module('coyo.domain')
      .factory('FilePublicLinkModel', FilePublicLinkModel);

  /**
   * @ngdoc service
   * @name coyo.domain.FilePublicLinkModel
   *
   * @description
   * Provides the Coyo model for the public link dialog.
   *
   * @requires commons.config.coyoEndpoints
   * @requires $http
   */
  function FilePublicLinkModel(coyoEndpoints, $http) {

    return {
      getLink: getLink,
      create: create,
      recreate: recreate,
      activate: activate,
      deactivate: deactivate
    };

    /**
     * @ngdoc method
     * @name coyo.domain.FilePublicLinkModel#getLink
     * @methodOf coyo.domain.FilePublicLinkModel
     *
     * @description
     * Retrieves a public file link.
     *
     * @param {string} senderId The ID of the sender the file belongs to
     * @param {string} fileId The ID of the file
     * @returns {object} Promise resolving to the public link
     */
    function getLink(senderId, fileId) {
      var url = coyoEndpoints.publicLink.getLink.replace('{{senderId}}', senderId).replace('{{fileId}}', fileId);
      return $http.get(url, {
        autoHandleErrors: false
      }).then(_onSuccess).catch(function () {
        return null;
      });
    }

    /**
     * @ngdoc method
     * @name coyo.domain.FilePublicLinkModel#create
     * @methodOf coyo.domain.FilePublicLinkModel
     *
     * @description
     * Creates a new public link.
     *
     * @param {string} senderId The ID of the sender the file belongs to
     * @param {string} fileId The ID of the file
     * @returns {object} Promise resolving to the new public link
     */
    function create(senderId, fileId) {
      var url = coyoEndpoints.publicLink.create.replace('{{senderId}}', senderId).replace('{{fileId}}', fileId);
      return $http.post(url).then(_onSuccess);
    }

    /**
     * @ngdoc method
     * @name coyo.domain.FilePublicLinkModel#recreate
     * @methodOf coyo.domain.FilePublicLinkModel
     *
     * @description
     * Recreates a the given public link.
     *
     * @param {object} link The public link
     * @returns {object} Promise resolving to the new public link
     */
    function recreate(link) {
      var url = coyoEndpoints.publicLink.recreate.replace('{{token}}', link.token);
      return $http.put(url).then(_onSuccess);
    }

    /**
     * @ngdoc method
     * @name coyo.domain.FilePublicLinkModel#activate
     * @methodOf coyo.domain.FilePublicLinkModel
     *
     * @description
     * Activates the given public link.
     *
     * @param {object} link The public link
     * @returns {object} Promise resolving to the public link
     */
    function activate(link) {
      var url = coyoEndpoints.publicLink.activate.replace('{{token}}', link.token);
      return $http.put(url).then(function () {
        link.active = true;
        return link;
      });
    }

    /**
     * @ngdoc method
     * @name coyo.domain.FilePublicLinkModel#deactivate
     * @methodOf coyo.domain.FilePublicLinkModel
     *
     * @description
     * Deactivates the given public link.
     *
     * @param {object} link The public link
     * @returns {object} Promise resolving to the public link
     */
    function deactivate(link) {
      var url = coyoEndpoints.publicLink.deactivate.replace('{{token}}', link.token);
      return $http.put(url).then(function () {
        link.active = false;
        return link;
      });
    }

    function _onSuccess(response) {
      return response.data;
    }
  }

})(angular);
