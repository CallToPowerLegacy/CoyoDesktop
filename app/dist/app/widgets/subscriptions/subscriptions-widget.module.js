(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.subscriptions', [
        'coyo.widgets.api',
        'commons.i18n'
      ])
      .config(registerSubscriptionsWidget);

  function registerSubscriptionsWidget(widgetRegistryProvider) {
    widgetRegistryProvider.register({
      key: 'subscriptions',
      name: 'WIDGET.SUBSCRIPTIONS.NAME',
      description: 'WIDGET.SUBSCRIPTIONS.DESCRIPTION',
      icon: 'zmdi-notifications',
      categories: 'personal',
      directive: 'coyo-subscriptions-widget',
      titles: ['WIDGET.SUBSCRIPTIONS.PAGE', 'WIDGET.SUBSCRIPTIONS.WORKSPACE']
    });
  }

})(angular);
