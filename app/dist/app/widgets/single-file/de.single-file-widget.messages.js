(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.singlefile')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('de', {
          "WIDGET.SINGLEFILE.DESCRIPTION": "Zeigt ein einzelnes Dokument an.",
          "WIDGET.SINGLEFILE.NAME": "Einzelnes Dokument",
          "WIDGET.SINGLEFILE.NO_FILE": "Kein Dokument ausgewählt.",
          "WIDGET.SINGLEFILE.OPEN_IN_FILELIBRARY": "In Dokumentenbibliothek öffnen",
          "WIDGET.SINGLEFILE.UNABLE_TO_LOAD": "Dateiupload nicht möglich",
          "WIDGET.SINGLEFILE.SETTINGS.FILE.BUTTON": "Wähle ein Dokument",
          "WIDGET.SINGLEFILE.SETTINGS.FILE.LABEL": "Dokument",
          "WIDGET.SINGLEFILE.SETTINGS.FILE.HELP": "Wähle ein Dokument, um es im Widget anzuzeigen.",
          "WIDGET.SINGLEFILE.SETTINGS.HIDE_DATE.LABEL": "Datum verbergen",
          "WIDGET.SINGLEFILE.SETTINGS.HIDE_DATE.HELP": "Das Upload-Datum bei der Darstellung des Widgets verbergen.",
          "WIDGET.SINGLEFILE.SETTINGS.HIDE_SENDER.LABEL": "Quelle verbergen",
          "WIDGET.SINGLEFILE.SETTINGS.HIDE_SENDER.HELP": "Die Quelle des Dokuments bei der Darstellung des Widgets verbergen.",
          "WIDGET.SINGLEFILE.SETTINGS.HIDE_PREVIEW.LABEL": "Vorschaubild verbergen",
          "WIDGET.SINGLEFILE.SETTINGS.HIDE_PREVIEW.HELP": "Statt des Vorschaubilds des Dokuments wird ein Icon angezeigt.",
          "WIDGET.SINGLEFILE.SETTINGS.HIDE_DOWNLOAD_LINK.LABEL": "Download-Link verbergen",
          "WIDGET.SINGLEFILE.SETTINGS.HIDE_DOWNLOAD_LINK.HELP": "Den Download-Link bei der Darstellung des Widgets verbergen.",
          "WIDGET.SINGLEFILE.MODAL.FILE.SELECT": "Datei auswählen"
        });
        /* eslint-enable quotes */
      });
})(angular);
