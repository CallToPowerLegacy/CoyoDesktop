(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.useronline')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('en', {
          "WIDGET.USERONLINE.DESCRIPTION": "Displays the number of all currently online users.",
          "WIDGET.USERONLINE.NAME": "Online Users",
          "WIDGET.USERONLINE.USERS": "{count, plural, one{User} other{Users}}",
          "WIDGET.USERONLINE.ONLINE": "Online"
        });
        /* eslint-enable quotes */
      });
})(angular);
