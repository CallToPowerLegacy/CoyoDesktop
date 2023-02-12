(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.userprofile', [
        'coyo.widgets.api',
        'commons.i18n'
      ])
      .config(registerUserProfileWidget);

  function registerUserProfileWidget(widgetRegistryProvider) {
    widgetRegistryProvider.register({
      key: 'userprofile',
      name: 'WIDGET.USERPROFILE.NAME',
      description: 'WIDGET.USERPROFILE.DESCRIPTION',
      icon: 'zmdi-account-box-o',
      categories: 'dynamic',
      directive: 'coyo-user-profile-widget',
      settings: {
        templateUrl: 'app/widgets/user-profile/user-profile-widget-settings.html'
      }
    });
  }

})(angular);
