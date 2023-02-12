(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.blogarticle')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('en', {
          "WIDGETS.BLOGARTICLE.DESCRIPTION": "Displays a single blog article.",
          "WIDGETS.BLOGARTICLE.NAME": "Blog Article",
          "WIDGETS.BLOGARTICLE.NO_ARTICLES": "No articles found.",
          "WIDGETS.BLOGARTICLE.READMORE": "Read More",
          "WIDGETS.BLOGARTICLE.SETTINGS.BLOG_ARTICLE": "Blog Article",
          "WIDGETS.BLOGARTICLE.SETTINGS.BLOG_ARTICLE.HELP": "Select the blog article.",
          "WIDGETS.BLOGARTICLE.SETTINGS.PERMISSION_ERROR": "You don't have sufficient permissions."
        });
        /* eslint-enable quotes */
      });
})(angular);
