(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.personal-timeline')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('de', {
          "WIDGET.PERSONAL_TIMELINE.DESCRIPTION": "Dieses Widget stellt die persönliche Timeline des aktiven Nutzers dar.",
          "WIDGET.PERSONAL_TIMELINE.NAME": "Timeline"
        });
        /* eslint-enable quotes */
      });
})(angular);
