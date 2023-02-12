(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.callout')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('en', {
          "WIDGET.CALLOUT.DESCRIPTION": "Displays a callout box.",
          "WIDGET.CALLOUT.NAME": "Callout",
          "WIDGET.CALLOUT.PLACEHOLDER": "Enter text here...",
          "WIDGET.CALLOUT.SEVERITY.SUCCESS": "Success",
          "WIDGET.CALLOUT.SEVERITY.INFO": "Info",
          "WIDGET.CALLOUT.SEVERITY.WARNING": "Warning",
          "WIDGET.CALLOUT.SEVERITY.DANGER": "Danger"
        });
        /* eslint-enable quotes */
      });
})(angular);
