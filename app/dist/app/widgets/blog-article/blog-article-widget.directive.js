(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.blogarticle')
      .directive('coyoBlogArticleWidget', blogArticleWidget)
      .controller('BlogArticleWidgetController', BlogArticleWidgetController);

  /**
   * @ngdoc directive
   * @name coyo.widgets.blogarticle.coyoBlogArticleWidget:coyoBlogArticleWidget
   * @element ANY
   * @restrict E
   * @scope
   *
   * @description
   * Renders the widget to show a single blog article
   *
   * @param {object} widget
   * The widget configuration
   */
  function blogArticleWidget() {
    return {
      restrict: 'E',
      templateUrl: 'app/widgets/blog-article/blog-article-widget.html',
      scope: {},
      bindToController: {
        widget: '<'
      },
      controller: 'BlogArticleWidgetController',
      controllerAs: '$ctrl'
    };
  }

  function BlogArticleWidgetController($scope, BlogArticleWidgetModel, targetService, widgetStatusService) {
    var vm = this;

    vm.go = targetService.go;
    vm.loadArticle = loadArticle;

    widgetStatusService.refreshOnSettingsChange($scope);

    /* Method to load a single article */
    function loadArticle() {
      delete vm.widget.article;
      return BlogArticleWidgetModel.getArticle(vm.widget.settings._articleId).then(function (article) {
        vm.widget.article = article;
        vm.widget.article.teaserImage = {
          fileId: vm.widget.article.teaserImageFileId,
          senderId: vm.widget.article.teaserImageSenderId
        };
        vm.widget.article.teaserImageWide = {
          fileId: vm.widget.article.teaserImageWideFileId,
          senderId: vm.widget.article.teaserImageWideSenderId
        };
        return article;
      }).finally(function () {
        vm.lastUpdate = new Date().getTime();
      });
    }
  }

})(angular);
