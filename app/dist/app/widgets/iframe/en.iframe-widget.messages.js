(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.iframe')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('en', {
          "WIDGET.IFRAME.DESCRIPTION": "Displays a website in an HTML-iFrame.",
          "WIDGET.IFRAME.NAME": "iFrame",
          "WIDGETS.IFRAME.SETTINGS.CONFIG.HEIGHT.LABEL": "Height",
          "WIDGETS.IFRAME.SETTINGS.CONFIG.HEIGHT.HELP": "The height of the iFrame in pixels",
          "WIDGETS.IFRAME.SETTINGS.CONFIG.URL.LABEL": "URL",
          "WIDGETS.IFRAME.SETTINGS.CONFIG.URL.HELP": "The URL of the website to be displayed in the iFrame.",
          "WIDGETS.IFRAME.SETTINGS.CONFIG.URL.PLACEHOLDER": "http://",
          "WIDGETS.IFRAME.SETTINGS.CONFIG.SCROLL.LABEL": "Scrolling",
          "WIDGETS.IFRAME.SETTINGS.CONFIG.SCROLL.HELP": "Activate scrolling in the iFrame.",
          "WIDGETS.IFRAME.SETTINGS.MESSAGE": "Please note that this widget utilizes HTML iframes which are heavily restricted by most modern browsers and websites. If you are accessing this platform via SSL, you can only include other SSL-secured websites."
        });
        /* eslint-enable quotes */
      });
})(angular);
