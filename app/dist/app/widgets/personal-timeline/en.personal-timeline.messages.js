(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.personal-timeline')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('en', {
          "WIDGET.PERSONAL_TIMELINE.DESCRIPTION": "A widget to display the personal timeline of the current user.",
          "WIDGET.PERSONAL_TIMELINE.NAME": "Timeline"
        });
        /* eslint-enable quotes */
      });
})(angular);
