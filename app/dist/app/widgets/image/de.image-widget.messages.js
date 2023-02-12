(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.image')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('de', {
          "WIDGET.IMAGE.DESCRIPTION": "Zeig ein einzelnes Bild an.",
          "WIDGET.IMAGE.NAME": "Bild"
        });
        /* eslint-enable quotes */
      });
})(angular);
