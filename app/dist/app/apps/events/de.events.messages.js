(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.events')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('de', {
          "APP.EVENTS.DESCRIPTION": "Die Events-App zeigt all Events die einer Seite oder einem Workspace zugeordnet sind.",
          "APP.EVENTS.NAME": "Events",
          "APP.EVENTS.LIST.SEARCH": "Nach Namen suchen",
          "APP.EVENTS.LIST.NONE": "Events",
          "APP.EVENTS.LIST.SINGULAR": "Event",
          "APP.EVENTS.LIST.PLURAL": "Events"
        });
        /* eslint-enable quotes */
      });
})(angular);
