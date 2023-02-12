(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.wiki')
      .directive('coyoWikiWidget', wikiWidget)
      .controller('WikiWidgetController', WikiWidgetController);

  /**
   * @ngdoc directive
   * @name coyo.widgets.wiki:wikiWidget
   * @element ANY
   * @restrict E
   * @scope
   *
   * @description
   * Renders the widget to show the latest wiki articles
   *
   * @param {object} widget
   * The widget configuration
   */
  function wikiWidget() {
    return {
      restrict: 'E',
      templateUrl: 'app/widgets/wiki/wiki-widget.html',
      scope: {},
      bindToController: {
        widget: '<'
      },
      controller: 'WikiWidgetController',
      controllerAs: '$ctrl'
    };
  }

  function WikiWidgetController($scope, WikiWidgetModel, targetService, widgetStatusService) {
    var vm = this;

    vm.loadArticles = loadArticles;
    vm.go = targetService.go;

    widgetStatusService.refreshOnSettingsChange($scope);

    function loadArticles() {
      vm.loading = true;
      var size = vm.widget.settings._articleCount;
      var appId = _.get(vm.widget.settings, '_appId');

      delete vm.articles;

      return WikiWidgetModel.getLatest(size, appId).then(function (articles) {
        vm.articles = articles;
        return articles;
      }).finally(function () {
        vm.lastUpdate = new Date().getTime();
        vm.loading = false;
      });
    }
  }

})(angular);
