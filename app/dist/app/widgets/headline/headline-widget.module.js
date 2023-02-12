(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.headline', [
        'coyo.widgets.api',
        'commons.i18n'
      ])
      .config(registerHeadlineWidget)
      .constant('headlineWidgetSizeOptions', headlineWidgetSizeOptions());

  function registerHeadlineWidget(widgetRegistryProvider) {
    widgetRegistryProvider.register({
      key: 'headline',
      name: 'WIDGET.HEADLINE.NAME',
      description: 'WIDGET.HEADLINE.DESCRIPTION',
      icon: 'zmdi-format-color-text',
      categories: 'static',
      directive: 'coyo-headline-widget',
      inlineOptions: {
        controller: 'HeadlineWidgetInlineOptionsController',
        controllerAs: '$ctrl',
        templateUrl: 'app/widgets/headline/headline-widget-inline-options.html'
      }
    });
  }

  function headlineWidgetSizeOptions() {
    return [
      {size: 'XL', previewClass: 'h1'},
      {size: 'L', previewClass: 'h2'},
      {size: 'M', previewClass: 'h3'},
      {size: 'S', previewClass: 'h4'}
    ];
  }

})(angular);
