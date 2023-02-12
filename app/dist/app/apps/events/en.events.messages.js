(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.events')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('en', {
          "APP.EVENTS.DESCRIPTION": "The events app displays all events associated to a specific page or workspace.",
          "APP.EVENTS.NAME": "Events",
          "APP.EVENTS.LIST.SEARCH": "Search by name",
          "APP.EVENTS.LIST.NONE": "Events",
          "APP.EVENTS.LIST.SINGULAR": "Event",
          "APP.EVENTS.LIST.PLURAL": "Events"
        });
        /* eslint-enable quotes */
      });
})(angular);
