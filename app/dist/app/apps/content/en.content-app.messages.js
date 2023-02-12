(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.content')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('en', {
          "APP.CONTENT.DESCRIPTION": "The content app allows you to orchestrate a custom page with layouting options and widgets.",
          "APP.CONTENT.NAME": "Content",
          "APP.CONTENT.EDIT_CONTENT": "Edit content",
          "APP.CONTENT.EDIT_MODE.END": "Done"
        });
        /* eslint-enable quotes */
      });
})(angular);
