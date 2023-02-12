(function (angular) {
  'use strict';

  angular.module('coyo.widgets.image')
      .factory('imageWidgetSelectionService', imageWidgetSelectionService);

  /**
   * @ngdoc service
   * @name coyo.widgets.image.imageWidgetSelectionService
   *
   * @description
   * Internal service to handle image selection in the image widget.
   *
   * @requires coyo.domain.SenderModel
   * @requires coyo.apps.api.appService
   * @requires commons.ui.fileLibraryModalService
   */
  function imageWidgetSelectionService(SenderModel, appService, fileLibraryModalService, $q) {

    return {
      selectImage: selectImage
    };

    /**
     * @ngdoc overview
     * @name coyo.widgets.image.imageWidgetSelectionService#selectImage
     * @memberOf coyo.widgets.image.imageWidgetSelectionService
     *
     * @description
     * Select an image via the file library modal and assign the (single) selected image to the widget model.
     * If the widget is located in the context of a sender this sender will be preselected.
     * If the widget is additionally in the context of an app, the app's rootFolder is preselected.
     *
     * @param {object} model
     * The widget domain model.
     */
    function selectImage(model) {
      var senderIdOrSlug = SenderModel.getCurrentIdOrSlug();
      if (angular.isDefined(senderIdOrSlug)) {
        return SenderModel.getWithPermissions(senderIdOrSlug, {}, ['createFile']).then(function (sender) {
          var appIdOrSlug = appService.getCurrentAppIdOrSlug();
          if (angular.isUndefined(appIdOrSlug)) {
            return openFileLibrary(model, sender);
          } else {
            return sender.getApp(appIdOrSlug).then(function (app) {
              return openFileLibrary(model, sender, {id: app.rootFolderId});
            });
          }
        });
      } else {
        return $q.resolve(openFileLibrary(model));
      }
    }

    function openFileLibrary(model, sender, initialFolder) {
      var options = {
        uploadMultiple: false,
        selectMode: 'single',
        filterContentType: 'image',
        initialFolder: initialFolder
      };
      var cropSettings = {
        cropImage: true
      };
      return fileLibraryModalService.open(sender, options, cropSettings).then(function (selectedFiles) {
        var image = selectedFiles;
        model.settings._image = {
          id: image.id,
          senderId: image.senderId
        };
      });
    }
  }

})(angular);
