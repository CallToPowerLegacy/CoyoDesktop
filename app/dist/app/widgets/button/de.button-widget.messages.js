(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.button')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('de', {
          "WIDGET.BUTTON.DESCRIPTION": "Ein Button, der Benutzer zu einer URL weiterleitet. Den Button kannst du nach deinen Wünschen designen.",
          "WIDGET.BUTTON.NAME": "Link-Button",
          "WIDGET.BUTTON.PLACEHOLDER": "Titel des Buttons",
          "WIDGET.BUTTON.SETTINGS.LINK_TARGET": "In neuem Fenster öffnen?",
          "WIDGET.BUTTON.SETTINGS.LINK_TARGET.HELP": "Falls aktiviert, öffnet sich der Link in einem neuen Browser-Tab.",
          "WIDGET.BUTTON.SETTINGS.PREVIEW": "Vorschau",
          "WIDGET.BUTTON.SETTINGS.STYLE": "Design",
          "WIDGET.BUTTON.SETTINGS.STYLE.HELP": "Wähle ein Button-Design aus.",
          "WIDGET.BUTTON.SETTINGS.TEXT": "Titel",
          "WIDGET.BUTTON.SETTINGS.TEXT.HELP": "Gib den Title des Buttons ein.",
          "WIDGET.BUTTON.SETTINGS.URL": "URL",
          "WIDGET.BUTTON.SETTINGS.URL.HELP": "Gib eine gültige URL an.",
          "WIDGET.BUTTON.SETTINGS.URL.PLACEHOLDER": "https://",
          "WIDGET.BUTTON.STYLE.DANGER": "Achtung",
          "WIDGET.BUTTON.STYLE.DEFAULT": "Standard",
          "WIDGET.BUTTON.STYLE.INFO": "Info",
          "WIDGET.BUTTON.STYLE.PRIMARY": "Primär",
          "WIDGET.BUTTON.STYLE.SUCCESS": "Erfolg",
          "WIDGET.BUTTON.STYLE.WARNING": "Warnung"
        });
        /* eslint-enable quotes */
      });
})(angular);
