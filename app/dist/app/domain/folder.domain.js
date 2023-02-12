(function (angular) {
  'use strict';

  angular
      .module('coyo.domain')
      .factory('FolderModel', FolderModel);

  /**
   * @ngdoc service
   * @name coyo.domain.FolderModel
   *
   * @description
   * Provides the Coyo folder model.
   *
   * @requires restResourceFactory
   * @requires commons.config.coyoEndpoints
   */
  function FolderModel(restResourceFactory, coyoEndpoints) {
    var FolderModel = restResourceFactory({
      url: coyoEndpoints.sender.folders
    });

    angular.extend(FolderModel, {

      /**
       * @ngdoc method
       * @name coyo.domain.FolderModel#getSettings
       * @methodOf coyo.domain.FolderModel
       *
       * @description
       * Retrieves the settings for the folder with the given ID.
       *
       * @param {string} senderId The ID of the sender the folder's file library belongs to
       * @param {string} folderId The ID of the folder
       * @returns {object} Promise resolving to the folder settings
       */
      getSettings: function (senderId, folderId) {
        return new FolderModel({id: folderId, senderId: senderId}).get('settings');
      },

      /**
       * @ngdoc method
       * @name coyo.domain.FolderModel#hasChildren
       * @methodOf coyo.domain.FolderModel
       *
       * @description
       * Check whether or not the given folder has any children.
       *
       * @param {string} senderId The ID of the sender the folder's file library belongs to
       * @param {string} folderId The ID of the folder
       * @returns {object} Promise resolving to the folder settings
       */
      hasChildren: function (senderId, folderId) {
        return new FolderModel({id: folderId, senderId: senderId}).get('has-children');
      }
    });

    return FolderModel;
  }

})(angular);
