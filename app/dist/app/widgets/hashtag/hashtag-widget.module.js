(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.hashtag', [
        'coyo.widgets.api',
        'commons.i18n'
      ])
      .config(registerDividerWidget)
      .constant('d3', d3); // eslint-disable-line no-undef

  function registerDividerWidget(widgetRegistryProvider) {
    widgetRegistryProvider.register({
      key: 'hashtag',
      name: 'WIDGET.HASHTAG.NAME',
      description: 'WIDGET.HASHTAG.DESCRIPTION',
      icon: 'zmdi-label-heart',
      categories: 'dynamic',
      directive: 'coyo-hashtag-widget',
      titles: ['WIDGET.HASHTAG.TITLE'],
      settings: {
        templateUrl: 'app/widgets/hashtag/hashtag-widget-settings.html',
        controller: 'HashtagWidgetSettingsController'
      }
    });
  }

})(angular);
