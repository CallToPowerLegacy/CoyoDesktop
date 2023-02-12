(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.blog', [
        'coyo.widgets.api',
        'commons.resource',
        'commons.target',
        'commons.i18n'
      ])
      .config(registerBlogWidget);

  function registerBlogWidget(widgetRegistryProvider) {
    widgetRegistryProvider.register({
      name: 'WIDGETS.BLOG.NAME',
      key: 'blog',
      icon: 'zmdi-collection-text',
      categories: 'dynamic',
      directive: 'coyo-blog-widget',
      description: 'WIDGETS.BLOG.DESCRIPTION',
      titles: ['WIDGETS.BLOG.NAME'],
      settings: {
        controller: 'BlogWidgetSettingsController',
        templateUrl: 'app/widgets/blog/blog-widget-settings.html'
      }
    });
  }

})(angular);
