(function (angular) {
  'use strict';

  angular
      .module('coyo.domain')
      .factory('DocumentModel', DocumentModel);

  /**
   * @ngdoc service
   * @name coyo.domain.DocumentModel
   *
   * @description
   * Provides the Coyo document model.
   *
   * @requires restResourceFactory
   * @requires commons.config.coyoEndpoints
   */
  function DocumentModel(restResourceFactory, coyoEndpoints) {
    var DocumentModel = restResourceFactory({
      url: coyoEndpoints.sender.documents
    });

    // class members
    angular.extend(DocumentModel, {

      /**
       * @ngdoc method
       * @name coyo.domain.DocumentModel#setDescription
       * @methodOf coyo.domain.DocumentModel
       *
       * @description
       * Sets a description for the given document.
       *
       * @param {string} senderId
       * The id of the sender the document belongs to.
       *
       * @param {object} documentId
       * The document ID of the document to set the description for
       *
       * @param {string} description
       * The description to set
       *
       * @returns {object} A promise of the operation
       */
      setDescription: function (senderId, documentId, description) {
        var url = DocumentModel.$url({id: documentId, senderId: senderId}, 'description');
        var params = DocumentModel.applyPermissions(['manage']);
        return DocumentModel.$put(url, {description: description}, {}, params);
      }
    });

    angular.extend(DocumentModel.prototype, {
      /**
       * Returns the versions of a file.
       *
       * @param {object} queryParams
       * The query parameters
       *
       * @returns {string}
       * The paged versions
       */
      getVersions: function (queryParams) {
        return DocumentModel.pagedQuery(null, queryParams, {id: this.id, senderId: this.senderId}, 'versions');
      },

      /**
       * Returns the relative download URL for the file's preview image.
       *
       * @returns {string}
       * The download URL
       */
      getDownloadUrl: function () {
        return this.$url();
      },

      /**
       * Returns the relative download URL for the file's preview image of the given version.
       *
       * @param {object} versionId
       * The version ID
       *
       * @returns {string}
       * The download URL
       */
      getDownloadUrlForVersion: function (versionId) {
        return this.$url('/versions/' + versionId);
      },

      /**
       * Returns the URL for the file's preview image of the given or the latest version (if no version was passed).
       *
       * @param {object} version
       * The DocumentVersion instance
       *
       * @returns {string}
       * The preview image URL
       */
      getVersionPreviewUrl: function (version) {
        var versionPart = version && version.id ? '/versions/' + version.id : '';
        return this.$url(versionPart);
      },

      /**
       * @ngdoc function
       * @name coyo.domain.DocumentModel#restore
       * @methodOf coyo.domain.DocumentModel
       *
       * @description
       * Restores the given version of the document.
       *
       * @param {object} versionId
       * The version's id to be restored
       *
       * @returns {promise} An $http promise
       */
      restoreVersion: function (versionId) {
        return DocumentModel.$put(this.$url('versions/' + versionId + '/restore'));
      }
    });

    return DocumentModel;
  }

})(angular);
