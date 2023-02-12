(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.blog')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('en', {
          "WIDGETS.BLOG.DESCRIPTION": "Displays a list of latest blog articles, either globally or for a specific blog.",
          "WIDGETS.BLOG.NAME": "Latest Blog Articles",
          "WIDGETS.BLOG.NO_ARTICLES": "No articles found",
          "WIDGETS.BLOG.NO_BLOG_APPS_FOUND": "No blog apps found.",
          "WIDGETS.BLOG.SETTINGS.ARTICLE_COUNT.HELP": "The maximum number of articles to display in the widget.",
          "WIDGETS.BLOG.SETTINGS.ARTICLE_COUNT.LABEL": "Number of articles",
          "WIDGETS.BLOG.SETTINGS.BLOG_APP.HELP": "Select the blog app for which to display the latest articles. If no blog is selected, the latest articles from all visible blogs will be shown",
          "WIDGETS.BLOG.SETTINGS.BLOG_APP.LABEL": "Blog app"
        });
        /* eslint-enable quotes */
      });
})(angular);
