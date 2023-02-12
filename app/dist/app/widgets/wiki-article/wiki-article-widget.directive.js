(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.wikiarticle')
      .directive('coyoWikiArticleWidget', wikiArticleWidget)
      .controller('WikiArticleWidgetController', WikiArticleWidgetController);

  /**
   * @ngdoc directive
   * @name coyo.widgets.wikiarticle:coyoWikiArticleWidget
   * @element ANY
   * @restrict E
   * @scope
   *
   * @description
   * Renders the widget to show a single wiki article
   *
   * @param {object} widget
   * The widget configuration
   */
  function wikiArticleWidget() {
    return {
      restrict: 'E',
      templateUrl: 'app/widgets/wiki-article/wiki-article-widget.html',
      scope: {},
      bindToController: {
        widget: '<'
      },
      controller: 'WikiArticleWidgetController',
      controllerAs: '$ctrl'
    };
  }

  function WikiArticleWidgetController($scope, WikiArticleWidgetModel, targetService, widgetStatusService) {
    var vm = this;
    vm.go = targetService.go;
    vm.loadArticle = loadArticle;

    widgetStatusService.refreshOnSettingsChange($scope);

    /* Method to load a single article */
    function loadArticle() {
      delete vm.widget.article;
      return WikiArticleWidgetModel.getArticle(vm.widget.settings._articleId).then(function (article) {
        vm.widget.article = article;
        return article;
      }).finally(function () {
        vm.lastUpdate = new Date().getTime();
      });
    }

    $scope.$watch(function () { return vm.widget.settings._articleId; }, function (newVal, oldVal) {
      if (newVal !== oldVal) {
        vm.loadArticle();
      }
    });
  }

})(angular);
