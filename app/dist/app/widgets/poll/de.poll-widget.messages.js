(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.poll')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('de', {
          "WIDGET.POLL.DESCRIPTION": "Zeigt eine Umfrage an.",
          "WIDGET.POLL.NAME": "Umfrage",
          "WIDGET.POLL.CONFIG": "Umfrage",
          "WIDGET.POLL.RESULTS": "Ergebnis",
          "WIDGET.POLL.EXTENDEDOPTIONS": "Erweiterte Einstellungen",
          "WIDGET.POLL.SETTINGS.CONFIG.QUESTION": "Frage",
          "WIDGET.POLL.SETTINGS.CONFIG.QUESTION.HELP": "Die Frage auf die sich die Umfrage bezieht.",
          "WIDGET.POLL.SETTINGS.CONFIG.DESCRIPTION": "Beschreibung",
          "WIDGET.POLL.SETTINGS.CONFIG.DESCRIPTION.HELP": "Weitere Hilfestellungen und Beschreibung der Umfrage.",
          "WIDGET.POLL.SETTINGS.CONFIG.OPTION": "Antwort",
          "WIDGET.POLL.SETTINGS.CONFIG.OPTION.HELP": "Eine Antwortmöglichkeit der Umfrage.",
          "WIDGET.POLL.SETTINGS.CONFIG.ADDOPTION": "Antwort hinzufügen",
          "WIDGET.POLL.SETTINGS.CONFIG.ADDOPTION.HELP": "Eine Antwortmöglichkeit hinzufügen.",
          "WIDGET.POLL.SETTINGS.CONFIG.ANONYMOUS": "Anonyme Teilnahme",
          "WIDGET.POLL.SETTINGS.CONFIG.ANONYMOUS.HELP": "Umfrageergebnis wird anonym angezeigt. Die Stimmen der einzelnen Benutzer werden nicht mehr angezeigt. Wenn diese Option im Nachhinein deaktiviert wird, werden Benutzer die bereits anonym abgestimmt haben nicht angezeigt.",
          "WIDGET.POLL.SETTINGS.CONFIG.SHOWRESULTS": "Ergebnis anzeigen",
          "WIDGET.POLL.SETTINGS.CONFIG.SHOWRESULTS.HELP": "Ergebnisse werden nach der Beantwortung angezeigt. Wenn diese Einstellung deaktiviert ist, wird das Ergebnis nur im Ergebnisbereich des Einstellungen-Dialogs angezeigt.",
          "WIDGET.POLL.SETTINGS.CONFIG.FROZEN": "Umfrage schließen",
          "WIDGET.POLL.SETTINGS.CONFIG.FROZEN.HELP": "Es können keine weiteren Antworten abgegeben werden",
          "WIDGET.POLL.SETTINGS.CONFIG.MAXANSWERS.HELP": "Anzahl der möglichen Antworten pro Benutzer.",
          "WIDGET.POLL.SETTINGS.CONFIG.MAXANSWERS": "Anzahl Antworten pro User",
          "WIDGET.POLL.WIDGET.VOTE": "Stimme",
          "WIDGET.POLL.WIDGET.VOTES": "Stimmen",
          "WIDGET.POLL.WIDGET.NOVOTES": "Diese Antwort hat noch keine Stimmen.",
          "WIDGET.POLL.WIDGET.FROZENREMARK": "GESCHLOSSEN",
          "WIDGET.POLL.WIDGET.MAXANSWERSREMARK": "BIS ZU {count} ANTWORTEN",
          "WIDGET.POLL.WIDGET.ANONYMOUSREMARK": "ANONYM",
          "WIDGET.POLL.WIDGET.MODAL.TITLE": "Stimmen"
        });
        /* eslint-enable quotes */
      });
})(angular);
