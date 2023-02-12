(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.wikiarticle')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('de', {
          "WIDGETS.WIKIARTICLE.DESCRIPTION": "Zeigt einen einzelnen Wiki-Artikel an.",
          "WIDGETS.WIKIARTICLE.NAME": "Einzelner Wiki-Artikel",
          "WIDGETS.WIKIARTICLE.NO_ARTICLES": "Keinen Artikel gefunden",
          "WIDGETS.WIKIARTICLE.SETTINGS.WIKIARTICLE.HELP": "Wiki-Artikel auswählen.",
          "WIDGETS.WIKIARTICLE.SETTINGS.WIKIARTICLE.LABEL": "Wiki-Artikel",
          "WIDGETS.WIKIARTICLE.SETTINGS.PERMISSION_ERROR": "Du verfügst nicht über ausreichende Berechtigungen."
        });
        /* eslint-enable quotes */
      });
})(angular);
