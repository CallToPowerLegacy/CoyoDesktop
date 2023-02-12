(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.callout')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('de', {
          "WIDGET.CALLOUT.DESCRIPTION": "Zeigt eine Hinweisbox mit einem beliebigen Text an.",
          "WIDGET.CALLOUT.NAME": "Hinweis",
          "WIDGET.CALLOUT.PLACEHOLDER": "Gib hier deinen Text ein...",
          "WIDGET.CALLOUT.SEVERITY.SUCCESS": "Erfolg",
          "WIDGET.CALLOUT.SEVERITY.INFO": "Info",
          "WIDGET.CALLOUT.SEVERITY.WARNING": "Warnung",
          "WIDGET.CALLOUT.SEVERITY.DANGER": "Achtung"
        });
        /* eslint-enable quotes */
      });
})(angular);
