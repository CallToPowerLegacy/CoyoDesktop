(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.video')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('en', {
          "WIDGETS.VIDEO.DESCRIPTION": "Embeds a video of a website.",
          "WIDGETS.VIDEO.NAME": "Video",
          "WIDGETS.VIDEO.ERROR": "Could not load video.",
          "WIDGETS.VIDEO.SETTINGS.CONFIG.URL.LABEL": "URL",
          "WIDGETS.VIDEO.SETTINGS.CONFIG.URL.HELP": "The URL of the videos to embed.",
          "WIDGETS.VIDEO.SETTINGS.CONFIG.TITLE.LABEL": "Title (optional)",
          "WIDGETS.VIDEO.SETTINGS.CONFIG.TITLE.HELP": "The title will be displayed below the video-thumbnail.",
          "WIDGETS.VIDEO.SETTINGS.CONFIG.DESCRIPTION.LABEL": "Description (optional)",
          "WIDGETS.VIDEO.SETTINGS.CONFIG.DESCRIPTION.HELP": "The description will be displayed below the title.",
          "WIDGETS.VIDEO.SETTINGS.CONFIG.URL.PLACEHOLDER": "http://",
          "WIDGETS.VIDEO.SETTINGS.MESSAGE": "If you are accessing this platform via SSL, you can only include SSL-secured websites."
        });
        /* eslint-enable quotes */
      });
})(angular);
