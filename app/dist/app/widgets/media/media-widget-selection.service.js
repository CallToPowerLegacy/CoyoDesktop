(function (angular) {
  'use strict';

  angular.module('coyo.widgets.media')
      .factory('mediaWidgetSelectionService', mediaWidgetSelectionService);

  /**
   * @ngdoc service
   * @name coyo.widgets.media.mediaWidgetSelectionService
   *
   * @description
   * Internal service to handle media selection in the media widget.
   *
   * @requires coyo.domain.SenderModel
   * @requires coyo.apps.api.appService
   * @requires commons.ui.fileLibraryModalService
   */
  function mediaWidgetSelectionService(SenderModel, appService, fileLibraryModalService, $q) {

    return {
      selectMedia: selectMedia
    };

    /**
     * @ngdoc overview
     * @name coyo.widgets.media.mediaWidgetSelectionService#selectMedia
     * @memberOf coyo.widgets.media.mediaWidgetSelectionService
     *
     * @description
     * Select media via the file library modal and assign single or multiple selected media to the widget model.
     * If the widget is located in the context of a sender this sender will be preselected.
     * If the widget is additionally in the context of an app, the app's rootFolder is preselected.
     */
    function selectMedia() {
      var senderIdOrSlug = SenderModel.getCurrentIdOrSlug();
      if (angular.isDefined(senderIdOrSlug)) {
        return SenderModel.getWithPermissions(senderIdOrSlug, {}, ['createFile']).then(function (sender) {
          var appIdOrSlug = appService.getCurrentAppIdOrSlug();
          if (angular.isUndefined(appIdOrSlug) || appIdOrSlug === null) {
            return openFileLibrary(sender);
          } else {
            return sender.getApp(appIdOrSlug).then(function (app) {
              return openFileLibrary(sender, {id: app.rootFolderId});
            });
          }
        });
      } else {
        return $q.resolve(openFileLibrary());
      }
    }

    function openFileLibrary(sender, initialFolder) {
      var options = {
        uploadMultiple: true,
        selectMode: 'multiple',
        filterContentType: ['image', 'video'],
        initialFolder: initialFolder
      };
      return fileLibraryModalService.open(sender, options).then(function (selectedFiles) {
        return selectedFiles;
      });
    }
  }

})(angular);
