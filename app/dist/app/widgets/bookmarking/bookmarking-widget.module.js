(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.bookmarking', [
        'coyo.widgets.api',
        'commons.i18n'
      ])
      .config(registerBookmarkingWidget);

  function registerBookmarkingWidget(widgetRegistryProvider) {
    widgetRegistryProvider.register({
      name: 'WIDGETS.BOOKMARKING.NAME',
      key: 'bookmarking',
      icon: 'zmdi-collection-bookmark',
      categories: 'static',
      directive: 'coyo-bookmarking-widget',
      description: 'WIDGETS.BOOKMARKING.DESCRIPTION',
      titles: ['WIDGETS.BOOKMARKING.NAME']
    });
  }

})(angular);
