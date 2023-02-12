(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.html')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('de', {
          "WIDGET.HTML.DESCRIPTION": "Stellt beliebigen HTML-Code dar.",
          "WIDGET.HTML.NAME": "HTML",
          "WIDGET.HTML.SETTINGS.TEXT": "HTML",
          "WIDGET.HTML.SETTINGS.TEXT.HELP": "Gib beliebigen HTML-Code ein, der von dem Widget interpretiert und angezeigt werden soll."
        });
        /* eslint-enable quotes */
      });
})(angular);
