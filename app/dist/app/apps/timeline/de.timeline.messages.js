(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.timeline')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('de', {
          "APP.TIMELINE.ALLOWEDINSTANCES.ERROR": "Leider kannst du nur {instances} Timeline-{instances, plural, =0 {Apps} =1 {App} other {Apps}} pro Seite oder Workspace anlegen.",
          "APP.TIMELINE.DESCRIPTION": "Die Timeline-App zeigt die Timeline der aktuellen Seite bzw. des aktuellen Workspaces an.",
          "APP.TIMELINE.NAME": "Timeline",
          "APP.TIMELINE.AUTHOR": "Autor",
          "APP.TIMELINE.AUTHORS": "Autoren",
          "APP.TIMELINE.AUTHORTYPE.ADMIN.DESCRIPTION": "Nur Admins können Beiträge erstellen",
          "APP.TIMELINE.AUTHORTYPE.ADMIN.NAME": "Admins",
          "APP.TIMELINE.AUTHORTYPE.VIEWER.DESCRIPTION": "Alle Mitglieder können Beiträge erstellen.",
          "APP.TIMELINE.AUTHORTYPE.VIEWER.NAME": "Alle Mitglieder"
        });
        /* eslint-enable quotes */
      });
})(angular);
