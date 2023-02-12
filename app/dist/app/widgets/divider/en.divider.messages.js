(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.divider')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('en', {
          "WIDGET.DIVIDER.DESCRIPTION": "Displays a simple divider line.",
          "WIDGET.DIVIDER.HELP.TEXT": "Please enter the divider's title or leave blank to omit the title.",
          "WIDGET.DIVIDER.NAME": "Divider",
          "WIDGET.DIVIDER.SETTINGS.TEXT": "Title"
        });
        /* eslint-enable quotes */
      });
})(angular);
