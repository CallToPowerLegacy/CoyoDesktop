(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.button', [
        'coyo.domain',
        'commons.i18n'
      ])
      .config(registerButtonWidget)
      .constant('buttonWidgetStyleOptions', buttonWidgetStyleOptions());

  function registerButtonWidget(widgetRegistryProvider) {
    widgetRegistryProvider.register({
      key: 'button',
      name: 'WIDGET.BUTTON.NAME',
      description: 'WIDGET.BUTTON.DESCRIPTION',
      icon: 'zmdi-mail-reply zmdi-hc-flip-horizontal',
      categories: 'static',
      directive: 'coyo-button-widget',
      inlineOptions: {
        templateUrl: 'app/widgets/button/button-widget-inline-options.html',
        controller: 'ButtonWidgetInlineOptionsController',
        controllerAs: '$ctrl'
      },
      settings: {
        templateUrl: 'app/widgets/button/button-widget-settings.html',
        controller: 'ButtonWidgetSettingsController',
        controllerAs: '$ctrl'
      }
    });
  }

  function buttonWidgetStyleOptions() {
    return [
      {title: 'WIDGET.BUTTON.STYLE.DEFAULT', btnClass: 'btn-default', icon: 'zmdi-dot-circle'},
      {title: 'WIDGET.BUTTON.STYLE.PRIMARY', btnClass: 'btn-primary', icon: 'zmdi-star-circle'},
      {title: 'WIDGET.BUTTON.STYLE.SUCCESS', btnClass: 'btn-success', icon: 'zmdi-check-circle'},
      {title: 'WIDGET.BUTTON.STYLE.INFO', btnClass: 'btn-info', icon: 'zmdi-info-outline'},
      {title: 'WIDGET.BUTTON.STYLE.WARNING', btnClass: 'btn-warning', icon: 'zmdi-alert-circle'},
      {title: 'WIDGET.BUTTON.STYLE.DANGER', btnClass: 'btn-danger', icon: 'zmdi-alert-triangle'}
    ];
  }

})(angular);
