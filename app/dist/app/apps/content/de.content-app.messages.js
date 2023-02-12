(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.content')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('de', {
          "APP.CONTENT.DESCRIPTION": "Mit der Inhalte-App kannst Du eine Seite mit eigenem Layout und Widgets erstellen.",
          "APP.CONTENT.NAME": "Inhalt",
          "APP.CONTENT.EDIT_CONTENT": "Inhalt bearbeiten",
          "APP.CONTENT.EDIT_MODE.END": "Fertig"
        });
        /* eslint-enable quotes */
      });
})(angular);
