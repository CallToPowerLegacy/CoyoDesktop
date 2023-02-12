(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.image')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('en', {
          "WIDGET.IMAGE.DESCRIPTION": "Displays a single image.",
          "WIDGET.IMAGE.NAME": "Image"
        });
        /* eslint-enable quotes */
      });
})(angular);
