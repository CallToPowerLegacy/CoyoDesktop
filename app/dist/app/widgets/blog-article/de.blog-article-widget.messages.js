(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.blogarticle')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('de', {
          "WIDGETS.BLOGARTICLE.DESCRIPTION": "Zeigt einen einzelnen Blogbeitrag an.",
          "WIDGETS.BLOGARTICLE.NAME": "Einzelner Blogbeitrag",
          "WIDGETS.BLOGARTICLE.NO_ARTICLES": "Keine Beiträge gefunden.",
          "WIDGETS.BLOGARTICLE.READMORE": "Weiterlesen",
          "WIDGETS.BLOGARTICLE.SETTINGS.BLOG_ARTICLE": "Blogbeitrag",
          "WIDGETS.BLOGARTICLE.SETTINGS.BLOG_ARTICLE.HELP": "Blogbeitrag auswählen.",
          "WIDGETS.BLOGARTICLE.SETTINGS.PERMISSION_ERROR": "Du verfügst nicht über ausreichende Berechtigungen."
        });
        /* eslint-enable quotes */
      });
})(angular);
