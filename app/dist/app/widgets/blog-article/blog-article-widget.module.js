(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.blogarticle', [
        'coyo.widgets.api',
        'commons.resource',
        'commons.target',
        'commons.i18n'
      ])
      .config(registerBlogArticleWidget);

  function registerBlogArticleWidget(widgetRegistryProvider) {
    widgetRegistryProvider.register({
      name: 'WIDGETS.BLOGARTICLE.NAME',
      key: 'blogarticle',
      icon: 'zmdi-file-text',
      categories: 'static',
      directive: 'coyo-blog-article-widget',
      description: 'WIDGETS.BLOGARTICLE.DESCRIPTION',
      settings: {
        controller: 'BlogArticleWidgetSettingsController',
        controllerAs: '$ctrl',
        templateUrl: 'app/widgets/blog-article/blog-article-widget-settings.html'
      }
    });
  }

})(angular);
