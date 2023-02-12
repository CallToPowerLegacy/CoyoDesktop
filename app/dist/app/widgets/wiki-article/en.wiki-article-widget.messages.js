(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.wikiarticle')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('en', {
          "WIDGETS.WIKIARTICLE.DESCRIPTION": "Displays a single wiki article.",
          "WIDGETS.WIKIARTICLE.NAME": "Wiki Article",
          "WIDGETS.WIKIARTICLE.NO_ARTICLES": "No article found",
          "WIDGETS.WIKIARTICLE.SETTINGS.WIKIARTICLE.HELP": "Select the wiki article.",
          "WIDGETS.WIKIARTICLE.SETTINGS.WIKIARTICLE.LABEL": "Wiki Article",
          "WIDGETS.WIKIARTICLE.SETTINGS.PERMISSION_ERROR": "You don't have sufficient permissions."
        });
        /* eslint-enable quotes */
      });
})(angular);
