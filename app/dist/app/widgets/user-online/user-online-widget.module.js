(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.useronline', [
        'coyo.widgets.api',
        'commons.i18n'
      ])
      .config(registerUserOnlineWidget);

  function registerUserOnlineWidget(widgetRegistryProvider) {
    widgetRegistryProvider.register({
      key: 'useronline',
      name: 'WIDGET.USERONLINE.NAME',
      description: 'WIDGET.USERONLINE.DESCRIPTION',
      icon: 'zmdi-account-circle',
      categories: 'dynamic',
      directive: 'coyo-user-online-widget'
    });
  }

})(angular);
