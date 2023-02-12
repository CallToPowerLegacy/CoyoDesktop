(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.singlefile')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('en', {
          "WIDGET.SINGLEFILE.DESCRIPTION": "Displays a single file.",
          "WIDGET.SINGLEFILE.NAME": "Single File",
          "WIDGET.SINGLEFILE.NO_FILE": "No file selected.",
          "WIDGET.SINGLEFILE.OPEN_IN_FILELIBRARY": "Open in Filelibrary",
          "WIDGET.SINGLEFILE.UNABLE_TO_LOAD": "Unable to load file",
          "WIDGET.SINGLEFILE.SETTINGS.FILE.BUTTON": "Select a file",
          "WIDGET.SINGLEFILE.SETTINGS.FILE.LABEL": "File",
          "WIDGET.SINGLEFILE.SETTINGS.FILE.HELP": "Select a file to be displayed in the widget.",
          "WIDGET.SINGLEFILE.SETTINGS.HIDE_DATE.LABEL": "Hide Date",
          "WIDGET.SINGLEFILE.SETTINGS.HIDE_DATE.HELP": "Hide the Upload Date in the File Description.",
          "WIDGET.SINGLEFILE.SETTINGS.HIDE_SENDER.LABEL": "Hide Origin",
          "WIDGET.SINGLEFILE.SETTINGS.HIDE_SENDER.HELP": "Hide the Origin in the File Description.",
          "WIDGET.SINGLEFILE.SETTINGS.HIDE_PREVIEW.LABEL": "Hide Preview Image",
          "WIDGET.SINGLEFILE.SETTINGS.HIDE_PREVIEW.HELP": "Hide the preview image and show a file icon.",
          "WIDGET.SINGLEFILE.SETTINGS.HIDE_DOWNLOAD_LINK.LABEL": "Hide Download Link",
          "WIDGET.SINGLEFILE.SETTINGS.HIDE_DOWNLOAD_LINK.HELP": "Hide the Download Link in the File Description.",
          "WIDGET.SINGLEFILE.MODAL.FILE.SELECT": "Select a file"
        });
        /* eslint-enable quotes */
      });
})(angular);
