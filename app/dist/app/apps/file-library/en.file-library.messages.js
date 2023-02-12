(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.file-library')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('en', {
          "APP.FILE_LIBRARY.DESCRIPTION": "Upload files to the documents app, sort them into folders and share them with your colleagues.",
          "APP.FILE_LIBRARY.NAME": "Documents",
          "APP.FILE_LIBRARY.SETTINGS.EDITORS.LABEL": "Editors",
          "APP.FILE_LIBRARY.SETTINGS.EDITORS.EVERYONE.LABEL": "Everyone",
          "APP.FILE_LIBRARY.SETTINGS.EDITORS.EVERYONE.DESCRIPTION": "All users can upload and modify files.",
          "APP.FILE_LIBRARY.SETTINGS.EDITORS.ADMINS.LABEL": "Admins",
          "APP.FILE_LIBRARY.SETTINGS.EDITORS.ADMINS.DESCRIPTION": "Only admins can upload and modify files."
        });
        /* eslint-enable quotes */
      });
})(angular);
