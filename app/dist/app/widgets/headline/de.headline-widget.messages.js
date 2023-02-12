(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.headline')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('de', {
          "WIDGET.HEADLINE.DESCRIPTION": "Zeigt eine Überschrift in anpassbarer Größe an.",
          "WIDGET.HEADLINE.NAME": "Überschrift",
          "WIDGET.HEADLINE.PLACEHOLDER": "Überschrift..."
        });
        /* eslint-enable quotes */
      });
})(angular);
