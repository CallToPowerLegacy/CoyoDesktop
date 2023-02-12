(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.suggestpages')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('de', {
          "WIDGETS.SUGGEST_PAGES.DESCRIPTION": "Zeigt eine Liste von ausgewählten Seiten an.",
          "WIDGETS.SUGGEST_PAGES.NAME": "Vorgeschlagene Seiten",
          "WIDGETS.SUGGEST_PAGES.NO_PAGE_FOUND": "Keine Seiten gefunden.",
          "WIDGETS.SUGGEST_PAGES.SETTINGS.PAGE.HELP": "Wähle bis zu 10 Seiten aus, die den Benutzern angezeigt werden sollen.",
          "WIDGETS.SUGGEST_PAGES.SETTINGS.PAGE.LABEL": "Seiten",
          "WIDGETS.SUGGEST_PAGES.SETTINGS.PAGE_LOAD_ERROR": "Laden der ausgewählten Seiten nicht möglich."
        });
        /* eslint-enable quotes */
      });
})(angular);
