(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.downloads')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('en', {
          "WIDGETS.DOWNLOADS.DESCRIPTION": "Displays a list of files to download.",
          "WIDGETS.DOWNLOADS.NAME": "Downloads",
          "WIDGETS.DOWNLOADS.NO_FILES": "No files found",
          "WIDGETS.DOWNLOADS.SETTINGS.FILES.LABEL": "Files",
          "WIDGETS.DOWNLOADS.SETTINGS.FILES.HELP": "Select files to be displayed in the widget.",
          "WIDGETS.DOWNLOADS.UNABLE_TO_LOAD": "Unable to load file"
        });
        /* eslint-enable quotes */
      });
})(angular);
