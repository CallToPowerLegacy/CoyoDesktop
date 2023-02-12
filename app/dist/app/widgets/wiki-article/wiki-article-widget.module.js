(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.wikiarticle', [
        'coyo.widgets.api',
        'commons.resource',
        'commons.target',
        'commons.i18n'
      ])
      .config(registerWikiArticleWidget);

  function registerWikiArticleWidget(widgetRegistryProvider) {
    widgetRegistryProvider.register({
      name: 'WIDGETS.WIKIARTICLE.NAME',
      key: 'wikiarticle',
      icon: 'zmdi-library',
      categories: 'static',
      directive: 'coyo-wiki-article-widget',
      description: 'WIDGETS.WIKIARTICLE.DESCRIPTION',
      settings: {
        controller: 'WikiArticleWidgetSettingsController',
        controllerAs: '$ctrl',
        templateUrl: 'app/widgets/wiki-article/wiki-article-widget-settings.html'
      }
    });
  }

})(angular);
