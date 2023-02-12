(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.text')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('en', {
          "WIDGET.TEXT.DESCRIPTION": "Displays simple plain text with an optional title.",
          "WIDGET.TEXT.NAME": "Plain Text",
          "WIDGET.TEXT.PLACEHOLDER": "Enter text here..."
        });
        /* eslint-enable quotes */
      });
})(angular);
