(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.completeprofile')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('en', {
          "WIDGET.COMPLETEPROFILE.DESCRIPTION": "Displays a todo list for completing the user's profile",
          "WIDGET.COMPLETEPROFILE.NAME": "Complete Profile",
          "WIDGET.COMPLETEPROFILE.TITLE": "Complete your profile",
          "WIDGET.COMPLETEPROFILE.AVATAR": "Upload a profile picture",
          "WIDGET.COMPLETEPROFILE.COVER": "Upload a cover picture",
          "WIDGET.COMPLETEPROFILE.PROFILEFIELDS": "Fill in your profile details",
          "WIDGET.COMPLETEPROFILE.CREATEDPOST": "Post something on your wall",
          "WIDGET.COMPLETEPROFILE.FOLLOWINGUSER": "Follow a user",
          "WIDGET.COMPLETEPROFILE.PAGEMEMBER": "Follow a page"
        });
        /* eslint-enable quotes */
      });
})(angular);
