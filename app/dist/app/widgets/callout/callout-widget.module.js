(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.callout', [
        'coyo.widgets.api',
        'commons.i18n'
      ])
      .config(registerCalloutWidget)
      .constant('calloutWidgetStyleOptions', calloutWidgetStyleOptions());

  function registerCalloutWidget(widgetRegistryProvider) {
    widgetRegistryProvider.register({
      key: 'callout',
      name: 'WIDGET.CALLOUT.NAME',
      description: 'WIDGET.CALLOUT.DESCRIPTION',
      icon: 'zmdi-alert-triangle',
      categories: 'static',
      directive: 'coyo-callout-widget',
      inlineOptions: {
        controller: 'CalloutWidgetInlineOptionsController',
        controllerAs: '$ctrl',
        templateUrl: 'app/widgets/callout/callout-widget-inline-options.html'
      }
    });
  }

  function calloutWidgetStyleOptions() {
    return [
      {title: 'WIDGET.CALLOUT.SEVERITY.SUCCESS', alertClass: 'alert-success', icon: 'zmdi-check-circle'},
      {title: 'WIDGET.CALLOUT.SEVERITY.INFO', alertClass: 'alert-info', icon: 'zmdi-info-outline'},
      {title: 'WIDGET.CALLOUT.SEVERITY.WARNING', alertClass: 'alert-warning', icon: 'zmdi-alert-circle'},
      {title: 'WIDGET.CALLOUT.SEVERITY.DANGER', alertClass: 'alert-danger', icon: 'zmdi-alert-triangle'}
    ];
  }

})(angular);
