(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.welcome')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('de', {
          "WIDGET.WELCOME.DESCRIPTION": "Dieses Widget zeigt den Namen eines Benutzers, seinen Avatar und sein Titelbild zusammen mit einem Willkommens-Text an.",
          "WIDGET.WELCOME.NAME": "Willkommen",
          "WIDGET.WELCOME.TEXT": "Willkommen!",
          "WIDGET.WELCOME.SETTINGS.SHOW_COVER.LABEL": "Titelbild anzeigen",
          "WIDGET.WELCOME.SETTINGS.SHOW_COVER.HELP": "Zeigt das Titelbild des Benutzers im Hintergrund an.",
          "WIDGET.WELCOME.SETTINGS.TEXT.LABEL": "Willkommenstext",
          "WIDGET.WELCOME.SETTINGS.TEXT.HELP": "Wähle einen Willkommenstext, der angezeigt werden soll."
        });
        /* eslint-enable quotes */
      });
})(angular);
