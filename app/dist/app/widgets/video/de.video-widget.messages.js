(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.video')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('de', {
          "WIDGETS.VIDEO.DESCRIPTION": "Bindet ein Video von einer anderen Webseite ein.",
          "WIDGETS.VIDEO.NAME": "Video",
          "WIDGETS.VIDEO.ERROR": "Video konnte nicht geladen werden.",
          "WIDGETS.VIDEO.SETTINGS.CONFIG.URL.LABEL": "Video URL",
          "WIDGETS.VIDEO.SETTINGS.CONFIG.URL.HELP": "Die URL des Videos, welches im Widget dargestellt wird.",
          "WIDGETS.VIDEO.SETTINGS.CONFIG.TITLE.LABEL": "Titel (optional)",
          "WIDGETS.VIDEO.SETTINGS.CONFIG.TITLE.HELP": "Der Titel wird unter dem Video-Thumbnail angezeigt.",
          "WIDGETS.VIDEO.SETTINGS.CONFIG.DESCRIPTION.LABEL": "Beschreibung (optional)",
          "WIDGETS.VIDEO.SETTINGS.CONFIG.DESCRIPTION.HELP": "Die Beschreibung wird unter dem Titel angezeigt.",
          "WIDGETS.VIDEO.SETTINGS.CONFIG.URL.PLACEHOLDER": "http://",
          "WIDGETS.VIDEO.SETTINGS.MESSAGE": "Wenn diese Plattform SSL-basiert ist, können nur SSL-basierte Webseiten eingebunden werden."
        });
        /* eslint-enable quotes */
      });
})(angular);
