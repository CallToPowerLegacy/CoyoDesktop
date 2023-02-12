(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.headline')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('en', {
          "WIDGET.HEADLINE.DESCRIPTION": "Displays a single headline which size is customizable.",
          "WIDGET.HEADLINE.NAME": "Headline",
          "WIDGET.HEADLINE.PLACEHOLDER": "Headline..."
        });
        /* eslint-enable quotes */
      });
})(angular);
