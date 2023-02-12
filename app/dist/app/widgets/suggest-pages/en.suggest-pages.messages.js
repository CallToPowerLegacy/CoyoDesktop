(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.suggestpages')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('en', {
          "WIDGETS.SUGGEST_PAGES.DESCRIPTION": "Displays a list of pages of your choice.",
          "WIDGETS.SUGGEST_PAGES.NAME": "Suggested Pages",
          "WIDGETS.SUGGEST_PAGES.NO_PAGE_FOUND": "No pages found.",
          "WIDGETS.SUGGEST_PAGES.SETTINGS.PAGE.HELP": "Select up to 10 pages as suggestions.",
          "WIDGETS.SUGGEST_PAGES.SETTINGS.PAGE.LABEL": "Pages",
          "WIDGETS.SUGGEST_PAGES.SETTINGS.PAGE_LOAD_ERROR": "Unable to load all selected pages. Changes will automatically deselect hidden pages."
        });
        /* eslint-enable quotes */
      });
})(angular);
