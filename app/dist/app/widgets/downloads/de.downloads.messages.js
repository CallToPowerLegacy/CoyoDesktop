(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.downloads')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('de', {
          "WIDGETS.DOWNLOADS.DESCRIPTION": "Zeigt eine Liste von ausgewählten Dateien an, die heruntergeladen werden können.",
          "WIDGETS.DOWNLOADS.NAME": "Downloads",
          "WIDGETS.DOWNLOADS.NO_FILES": "Keine Dateien gefunden",
          "WIDGETS.DOWNLOADS.SETTINGS.FILES.LABEL": "Dateien",
          "WIDGETS.DOWNLOADS.SETTINGS.FILES.HELP": "Wähle die Dateien aus, die im Widget angezeigt werden sollen.",
          "WIDGETS.DOWNLOADS.UNABLE_TO_LOAD": "Die Datei konnte nicht geladen werden"
        });
        /* eslint-enable quotes */
      });
})(angular);
