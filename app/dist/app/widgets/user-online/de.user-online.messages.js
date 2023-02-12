(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.useronline')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('de', {
          "WIDGET.USERONLINE.DESCRIPTION": "Zeigt die Anzahl aller Benutzer an, die gerade online sind.",
          "WIDGET.USERONLINE.NAME": "Benutzer Online",
          "WIDGET.USERONLINE.USERS": "Benutzer",
          "WIDGET.USERONLINE.ONLINE": "Online"
        });
        /* eslint-enable quotes */
      });
})(angular);
