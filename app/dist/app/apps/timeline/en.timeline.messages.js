(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.timeline')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('en', {
          "APP.TIMELINE.ALLOWEDINSTANCES.ERROR": "Unfortunately, you can only create {instances} timeline {instances, plural, =0 {apps} =1 {app} other {apps}} per page or workspace.",
          "APP.TIMELINE.DESCRIPTION": "The timeline app displays the timeline of the current page or workspace.",
          "APP.TIMELINE.NAME": "Timeline",
          "APP.TIMELINE.AUTHOR": "Author",
          "APP.TIMELINE.AUTHORS": "Authors",
          "APP.TIMELINE.AUTHORTYPE.ADMIN.DESCRIPTION": "Only admins can post to the timeline.",
          "APP.TIMELINE.AUTHORTYPE.ADMIN.NAME": "Admins",
          "APP.TIMELINE.AUTHORTYPE.VIEWER.DESCRIPTION": "Everyone can post to the timeline.",
          "APP.TIMELINE.AUTHORTYPE.VIEWER.NAME": "Everyone"
        });
        /* eslint-enable quotes */
      });
})(angular);
