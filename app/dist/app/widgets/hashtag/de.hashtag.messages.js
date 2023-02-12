(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.hashtag')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('de', {
          "WIDGET.HASHTAG.DESCRIPTION": "Zeigt eine Hashtag-Cloud der beliebtesten Hashtags der letzten Tage, Wochen oder Monate.",
          "WIDGET.HASHTAG.NAME": "Beliebte Hashtags",
          "WIDGET.HASHTAG.TITLE": "Beliebte Hashtags",
          "WIDGET.HASHTAG.EMPTY": "Es gibt noch keine Hashtags.",
          "WIDGET.HASHTAG.SETTINGS.PERIOD": "Zeitraum",
          "WIDGET.HASHTAG.SETTINGS.PERIOD.UNLIMITED": "Immer",
          "WIDGET.HASHTAG.SETTINGS.PERIOD.ONE_YEAR": "12 Monate",
          "WIDGET.HASHTAG.SETTINGS.PERIOD.SIX_MONTHS": "6 Monate",
          "WIDGET.HASHTAG.SETTINGS.PERIOD.THREE_MONTHS": "3 Monate",
          "WIDGET.HASHTAG.SETTINGS.PERIOD.TWO_MONTHS": "2 Monate",
          "WIDGET.HASHTAG.SETTINGS.PERIOD.ONE_MONTH": "1 Monat",
          "WIDGET.HASHTAG.SETTINGS.PERIOD.TWO_WEEKS": "2 Wochen",
          "WIDGET.HASHTAG.SETTINGS.PERIOD.ONE_WEEK": "1 Woche",
          "WIDGET.HASHTAG.SETTINGS.PERIOD.ONE_DAY": "1 Tag",
          "WIDGET.HASHTAG.SETTINGS.PERIOD.HELP": "Nur die Hashtags, die in der ausgewählten Zeitspanne erstellt wurden, werden für die Hashtag-Cloud berücksichtigt."
        });
        /* eslint-enable quotes */
      });

})(angular);
