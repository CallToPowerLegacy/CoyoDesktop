(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.blog')
      .directive('oyocBlogArticleTime', blogArticleTime);

  /**
   * @ngdoc directive
   * @name coyo.apps.blog.oyocBlogArticleTime:oyocBlogArticleTime
   * @scope
   * @restrict 'E'
   * @element OWN
   *
   * @description
   * Renders the publication time and status of a blog article.
   *
   * @param {object} article The blog article
   */
  function blogArticleTime() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/apps/blog/blog-article-time.html',
      scope: {
        article: '='
      }
    };
  }
})(angular);
