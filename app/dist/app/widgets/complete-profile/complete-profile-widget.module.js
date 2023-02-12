(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.completeprofile', [
        'coyo.widgets.api',
        'commons.i18n'
      ])
      .config(registerCompleteProfileWidget);

  function registerCompleteProfileWidget(widgetRegistryProvider) {
    widgetRegistryProvider.register({
      key: 'completeprofile',
      name: 'WIDGET.COMPLETEPROFILE.NAME',
      description: 'WIDGET.COMPLETEPROFILE.DESCRIPTION',
      icon: 'zmdi-check-all',
      categories: 'personal',
      directive: 'coyo-complete-profile-widget',
      titles: ['WIDGET.COMPLETEPROFILE.TITLE']
    });
  }

})(angular);
