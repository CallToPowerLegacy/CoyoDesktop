(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.divider')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('de', {
          "WIDGET.DIVIDER.DESCRIPTION": "Zeigt eine einfache Trennlinie an",
          "WIDGET.DIVIDER.HELP.TEXT": "Gib der Trennlinie einen Titel. Falls es keinen Titel geben soll, lasse das einfach Feld leer.",
          "WIDGET.DIVIDER.NAME": "Trennlinie",
          "WIDGET.DIVIDER.SETTINGS.TEXT": "Title"
        });
        /* eslint-enable quotes */
      });
})(angular);
