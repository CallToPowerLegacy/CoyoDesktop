(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.wiki')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('de', {
          "WIDGETS.WIKI.DESCRIPTION": "Zeigt eine Liste der neuesten Wiki-Artikel, entweder global oder für ein ausgewähltes Wiki.",
          "WIDGETS.WIKI.NAME": "Neueste Wiki-Artikel",
          "WIDGETS.WIKI.NO_ARTICLES": "Keine Artikel gefunden",
          "WIDGETS.WIKI.NO_WIKI_APPS_FOUND": "Keine Wiki-Apps gefunden.",
          "WIDGETS.WIKI.SETTINGS.ARTICLE_COUNT.HELP": "Die maximale Anzahl von Artikeln, die im Widget angezeigt werden sollen.",
          "WIDGETS.WIKI.SETTINGS.ARTICLE_COUNT.LABEL": "Anzahl der Artikel",
          "WIDGETS.WIKI.SETTINGS.WIKI_APP.HELP": "Wähle die Wiki-App aus, für welcher die neuesten Artikel angezeigt werden sollen. Wenn kein Wiki ausgewählt ist, werden die neuesten Artikel aus allen sichtbaren Wikis angezeigt.",
          "WIDGETS.WIKI.SETTINGS.WIKI_APP.LABEL": "Wiki-App",
          "WIDGETS.WIKI.SETTINGS.APP_LOAD_ERROR": "Die ausgewählte App kann nicht geladen werden."
        });
        /* eslint-enable quotes */
      });
})(angular);
