(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.bookmarking')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('de', {
          "WIDGETS.BOOKMARKING.ADD_BOOKMARK": "Lesezeichen hinzufügen",
          "WIDGETS.BOOKMARKING.DESCRIPTION": "Zeigt eine Liste von Lesezeichen an.",
          "WIDGETS.BOOKMARKING.NAME": "Lesezeichen",
          "WIDGETS.BOOKMARKING.NO_BOOKMARKS": "Es gibt aktuell noch keine Lesezeichen",
          "WIDGETS.BOOKMARKING.TITLE.PLACEHOLDER": "Gib einen Titel an",
          "WIDGETS.BOOKMARKING.URL.PLACEHOLDER": 'https://'
        });
        /* eslint-enable quotes */
      });
})(angular);
