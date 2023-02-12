(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.iframe')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('de', {
          "WIDGET.IFRAME.DESCRIPTION": "Zeigt eine Website in einem HTML-iFrame an.",
          "WIDGET.IFRAME.NAME": "iFrame",
          "WIDGETS.IFRAME.SETTINGS.CONFIG.HEIGHT.LABEL": "Höhe",
          "WIDGETS.IFRAME.SETTINGS.CONFIG.HEIGHT.HELP": "Die Höhe des iFrames in Pixel",
          "WIDGETS.IFRAME.SETTINGS.CONFIG.URL.LABEL": "URL",
          "WIDGETS.IFRAME.SETTINGS.CONFIG.URL.HELP": "Die URL der Webseite, die im iFrame dargestellt wird.",
          "WIDGETS.IFRAME.SETTINGS.CONFIG.URL.PLACEHOLDER": "http://",
          "WIDGETS.IFRAME.SETTINGS.CONFIG.SCROLL.LABEL": "Scrolling",
          "WIDGETS.IFRAME.SETTINGS.CONFIG.SCROLL.HELP": "Scrolling im iFrame aktivieren.",
          "WIDGETS.IFRAME.SETTINGS.MESSAGE": "Bitte beachte, dass dieses Widget HTML iframes nutzt und deren Nutzung in modernen Browsern und Webseiten deutlich eingeschränkt ist. Wenn diese Plattform SSL-basiert ist, können nur andere SSL-basierte Webseiten eingebunden werden."
        });
        /* eslint-enable quotes */
      });
})(angular);
