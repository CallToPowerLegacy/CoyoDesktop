(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.blog')
      .directive('coyoBlogWidget', blogWidget)
      .controller('BlogWidgetController', BlogWidgetController);

  /**
   * @ngdoc directive
   * @name coyo.widgets.blog.coyoBlogWidget:coyoBlogWidget
   * @element ANY
   * @restrict E
   * @scope
   *
   * @description
   * Renders the widget to show the latest blog articles
   *
   * @param {object} widget
   * The widget configuration
   */
  function blogWidget() {
    return {
      restrict: 'E',
      templateUrl: 'app/widgets/blog/blog-widget.html',
      scope: {},
      bindToController: {
        widget: '='
      },
      controller: 'BlogWidgetController',
      controllerAs: '$ctrl'
    };
  }

  function BlogWidgetController($scope, BlogWidgetModel, targetService, widgetStatusService) {
    var vm = this;

    vm.loadArticles = loadArticles;
    vm.go = targetService.go;

    widgetStatusService.refreshOnSettingsChange($scope);

    function loadArticles() {
      var size = vm.widget.settings._articleCount;
      var appId = _.get(vm.widget.settings, '_app.id');

      delete vm.articles;
      return BlogWidgetModel.getLatest(size, appId).then(function (articles) {
        vm.articles = articles;
        return articles;
      }).finally(function () {
        vm.lastUpdate = new Date().getTime();
      });
    }
  }

})(angular);
