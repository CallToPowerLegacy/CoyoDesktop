(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.text')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('de', {
          "WIDGET.TEXT.DESCRIPTION": "Zeigt einen einfachen Text und optional einen Titel an.",
          "WIDGET.TEXT.NAME": "Text",
          "WIDGET.TEXT.PLACEHOLDER": "Gib hier den Text ein..."
        });
        /* eslint-enable quotes */
      });
})(angular);
