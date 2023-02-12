(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.blog')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('de', {
          "WIDGETS.BLOG.DESCRIPTION": "Zeigt eine Liste der neuesten Blogbeiträge an, entweder global oder für eine ausgewählte Blog-App.",
          "WIDGETS.BLOG.NAME": "Neueste Blogbeiträge",
          "WIDGETS.BLOG.NO_ARTICLES": "Keine Beiträge gefunden",
          "WIDGETS.BLOG.NO_BLOG_APPS_FOUND": "Keine Blog-Apps gefunden.",
          "WIDGETS.BLOG.SETTINGS.ARTICLE_COUNT.HELP": "Die maximale Anzahl von Blogbeiträgen, die in diesem Widget angezeigt werden sollen.",
          "WIDGETS.BLOG.SETTINGS.ARTICLE_COUNT.LABEL": "Anzahl von Beiträgen",
          "WIDGETS.BLOG.SETTINGS.BLOG_APP.HELP": "Wähle die Blog-App aus, aus der die neuesten Beiträge angezeigt werden sollen. Wenn keine App ausgewählt ist, werden die aktuellsten Beiträge aus allen sichtbaren Blogs angezeigt.",
          "WIDGETS.BLOG.SETTINGS.BLOG_APP.LABEL": "Blog-App"
        });
        /* eslint-enable quotes */
      });
})(angular);
