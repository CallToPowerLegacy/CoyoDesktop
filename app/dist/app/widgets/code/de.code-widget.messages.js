(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.code')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('de', {
          "WIDGET.CODE.DESCRIPTION": "Erlaubt es Nutzern, interaktive Inhalte mit HTML, JavaScript und CSS zu erstellen",
          "WIDGET.CODE.SETTINGS.INVALID": "Bitte aktualisiere die Seite, um deine initialen Einstellungen zu sehen.",
          "WIDGET.CODE.NAME": "Code",
          "WIDGET.CODE.SETTINGS.HTML.TEXT": "HTML",
          "WIDGET.CODE.SETTINGS.HTML.HELP": "Gib hier den HTML-Code ein, der angezeigt werden soll",
          "WIDGET.CODE.SETTINGS.JS.TEXT": "JavaScript",
          "WIDGET.CODE.SETTINGS.JS.HELP": "Gib hier den JavaScript-Code ein, der ausgeführt werden soll",
          "WIDGET.CODE.SETTINGS.CSS.TEXT": "CSS",
          "WIDGET.CODE.SETTINGS.CSS.HELP": "Gib hier die CSS-Stylings ein, die Styling-Definitionen bereitstellen",
          "WIDGET.CODE.TITLE": "Code",
          "WIDGET.CODE.WARNING": "Vorsicht: Jede Art von Code ist hier erlaubt. Es entfällt kein Code und es wird kein Code weggekürzt. Bitte denke darüber nach, ob du wirklich Code über dieses Widget einfügen musst. Wenn möglich, erwäge eine Alternative."
        });
        /* eslint-enable quotes */
      });
})(angular);
