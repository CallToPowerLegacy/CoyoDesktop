(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.rss')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('en', {
          "WIDGET.RSS.DESCRIPTION": "Displays an RSS feed.",
          "WIDGET.RSS.ERRORS.AUTHENTICATION": "Please authenticate.",
          "WIDGET.RSS.ERRORS.URL.INVALID": "No entries have been found. Please check the RSS URL.",
          "WIDGET.RSS.ERRORS.VALIDATION.INVALID_URL": "Invalid RSS feed URL, recheck the specified URL.",
          "WIDGET.RSS.ERRORS.VALIDATION.VALID_URL": "RSS Feed is valid.",
          "WIDGET.RSS.SETTINGS.CONFIG.CONNECTIONFAILURE": "Could not connect to server.",
          "WIDGET.RSS.NAME": "RSS Feed",
          "WIDGET.RSS.READ_MORE": "Read More",
          "WIDGET.RSS.SETTINGS.CONFIG": "RSS settings",
          "WIDGET.RSS.SETTINGS.CONFIG.CREDENTIALS.INVALID": "Credentials invalid",
          "WIDGET.RSS.SETTINGS.CONFIG.FURTHER.CONFIG": "Further settings",
          "WIDGET.RSS.SETTINGS.CONFIG.IMAGE.HELP": "Activate: Display image of feed.",
          "WIDGET.RSS.SETTINGS.CONFIG.IMAGE": "Display article image",
          "WIDGET.RSS.SETTINGS.CONFIG.LOADING": "Verifying feed...",
          "WIDGET.RSS.SETTINGS.CONFIG.MAX.COUNT": "Max number of entries to show",
          "WIDGET.RSS.SETTINGS.CONFIG.MAX.COUNT.HELP": "The amount of displayed entries.",
          "WIDGET.RSS.SETTINGS.CONFIG.PASSWORD.HELP": "Password for basic authentication.",
          "WIDGET.RSS.SETTINGS.CONFIG.PASSWORD.LABEL": "Password",
          "WIDGET.RSS.SETTINGS.CONFIG.RSS.LABEL": "RSS settings",
          "WIDGET.RSS.SETTINGS.CONFIG.USER.HELP": "Username for basic authentication.",
          "WIDGET.RSS.SETTINGS.CONFIG.URL.LABEL": "RSS URL",
          "WIDGET.RSS.SETTINGS.CONFIG.USER.LABEL": "User",
          "WIDGET.RSS.SETTINGS.CONFIG.VERIFY.LABEL": "Verify"
        });
        /* eslint-enable quotes */
      });
})(angular);
