(function () {
  'use strict';

  angular
      .module('coyo.domain')
      .factory('FileModel', FileModel);

  /**
   * @ngdoc service
   * @name coyo.domain.FileModel
   *
   * @description
   * Provides the Coyo file model.
   *
   * @requires restResourceFactory
   * @requires commons.config.coyoEndpoints
   */
  function FileModel(restResourceFactory, coyoEndpoints) {
    var FileModel = restResourceFactory({
      url: coyoEndpoints.sender.files
    });

    // class members
    angular.extend(FileModel, {

      /**
       * @ngdoc method
       * @name coyo.domain.FileModel#move
       * @methodOf coyo.domain.FileModel
       *
       * @description
       * Moves a file to another folder.
       *
       * @param {string} senderId The ID of the sender the source's file library belongs to
       * @param {string} sourceId The ID of the file to be moved
       * @param {string=} destinationId The ID of the target folder
       *
       * @returns {object} Promise resolving to the new file
       */
      move: function (senderId, sourceId, destinationId) {
        return FileModel.$put(FileModel.$url({
          senderId: senderId,
          id: sourceId
        }, '/move'), null, null, {
          'destinationId': destinationId || ''
        });
      },

      /**
       * @ngdoc method
       * @name coyo.domain.FileModel#rename
       * @methodOf coyo.domain.FileModel
       *
       * @description
       * Renames the given file of the given sender with the passed name.
       *
       * @param {string} senderId
       * The id of the sender the file belongs to.
       *
       * @param {object} file
       * The file to rename
       *
       * @param {string} filename
       * The new filename to rename the file to.
       *
       * @returns {object} A promise of the renaming operation
       */
      rename: function (senderId, file, filename) {
        var url = FileModel.$url({id: file.id, senderId: senderId}, '/name');
        var params = FileModel.applyPermissions(['manage', 'publicLink'], {name: filename});
        return FileModel.$put(url, {}, {}, params);
      }
    });

    return FileModel;
  }
})();
