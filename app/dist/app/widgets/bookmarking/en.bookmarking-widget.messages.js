(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.bookmarking')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('en', {
          "WIDGETS.BOOKMARKING.ADD_BOOKMARK": "Add bookmark",
          "WIDGETS.BOOKMARKING.DESCRIPTION": "Displays a list of bookmarks.",
          "WIDGETS.BOOKMARKING.NAME": "Bookmarks",
          "WIDGETS.BOOKMARKING.NO_BOOKMARKS": "Currently there are no bookmarks",
          "WIDGETS.BOOKMARKING.TITLE.PLACEHOLDER": "Enter a label",
          "WIDGETS.BOOKMARKING.URL.PLACEHOLDER": 'https://'
        });
        /* eslint-enable quotes */
      });
})(angular);
