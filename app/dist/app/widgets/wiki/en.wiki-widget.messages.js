(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.wiki')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('en', {
          "WIDGETS.WIKI.DESCRIPTION": "Displays a list of latest wiki articles, either globally or for a specific wiki.",
          "WIDGETS.WIKI.NAME": "Latest Wiki Articles",
          "WIDGETS.WIKI.NO_ARTICLES": "No articles found",
          "WIDGETS.WIKI.NO_WIKI_APPS_FOUND": "No wiki apps found.",
          "WIDGETS.WIKI.SETTINGS.ARTICLE_COUNT.HELP": "The maximum number of articles to display in the widget.",
          "WIDGETS.WIKI.SETTINGS.ARTICLE_COUNT.LABEL": "Number of articles",
          "WIDGETS.WIKI.SETTINGS.WIKI_APP.HELP": "Select the wiki app for which to display the latest articles. If no wiki is selected, the latest articles from all visible wikis will be shown.",
          "WIDGETS.WIKI.SETTINGS.WIKI_APP.LABEL": "Wiki app",
          "WIDGETS.WIKI.SETTINGS.APP_LOAD_ERROR": "Unable to load selected app."
        });
        /* eslint-enable quotes */
      });
})(angular);
