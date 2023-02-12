(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.blog')
      .controller('BlogArticleViewController', BlogArticleViewController);

  /**
   * Controller for viewing a blog article.
   *
   * @requires $state
   * @requires modalService
   * @requires article
   * @constructor
   */
  function BlogArticleViewController($state, modalService, app, article, articleContext) {
    var vm = this;
    vm.app = app;
    vm.article = article;
    vm.nrOfBlogArticles = articleContext.nrOfBlogArticles;
    vm.currentArticleNumber = articleContext.currentArticleNumber;
    vm.hasPreviousArticle = articleContext.previousArticleId !== null;
    vm.hasNextArticle = articleContext.nextArticleId !== null;

    vm.previousArticle = previousArticle;
    vm.nextArticle = nextArticle;
    vm.deleteArticle = deleteArticle;

    function previousArticle() {
      if (vm.hasPreviousArticle) {
        $state.go('^.view', {id: articleContext.previousArticleId});
      }
    }

    function nextArticle() {
      if (vm.hasNextArticle) {
        $state.go('^.view', {id: articleContext.nextArticleId});
      }
    }

    function deleteArticle() {
      modalService.confirm({
        title: 'APP.BLOG.MODAL.DELETE.TITLE',
        text: 'APP.BLOG.MODAL.DELETE.TEXT',
        translationContext: {title: vm.article.title},
        close: {title: 'YES'},
        dismiss: {title: 'NO'}
      }).result.then(function () {
        vm.article.delete().then(function () {
          $state.go('^');
        });
      });
    }
  }

})(angular);
