(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.rte', [
        'coyo.widgets.api'
      ])
      .config(registerRTEWidget);

  function registerRTEWidget(widgetRegistryProvider) {
    widgetRegistryProvider.register({
      name: 'WIDGET.RTE.NAME',
      key: 'rte',
      icon: 'zmdi-text-format',
      categories: 'static',
      description: 'WIDGET.RTE.DESCRIPTION',
      directive: 'coyo-rte-widget'
    });
  }

})(angular);
