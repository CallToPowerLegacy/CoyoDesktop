(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.html')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('en', {
          "WIDGET.HTML.DESCRIPTION": "Renders custom HTML.",
          "WIDGET.HTML.NAME": "HTML",
          "WIDGET.HTML.SETTINGS.TEXT": "HTML",
          "WIDGET.HTML.SETTINGS.TEXT.HELP": "Enter your custom HTML to be rendered."
        });
        /* eslint-enable quotes */
      });
})(angular);
