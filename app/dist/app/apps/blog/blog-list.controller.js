(function (angular) {
  'use strict';

  angular
      .module('coyo.apps.blog')
      .controller('BlogListController', BlogListController);

  /**
   * Controller for blog article listing.
   *
   * @requires $state
   * @requires moment
   * @requires modalService
   * @requires coyo.apps.blog.BlogArticleModel
   * @requires app
   * @requires $q
   * @requires blogAppConfig
   * @constructor
   */
  function BlogListController($state, moment, modalService, BlogArticleModel, app, $q, blogAppConfig) {
    var vm = this;
    vm.app = app;
    vm.isNewMonth = isNewMonth;
    vm.filterActive = filterActive;
    vm.toggleIncludePublished = toggleIncludePublished;
    vm.toggleIncludeScheduled = toggleIncludeScheduled;
    vm.toggleIncludeDrafts = toggleIncludeDrafts;
    vm.toggleFilterYear = toggleFilterYear;
    vm.toggleFilterMonth = toggleFilterMonth;
    vm.deleteArticle = deleteArticle;
    vm.openView = openView;

    vm.blogArticles = {
      content: [],
      _queryParams: {
        _page: 0,
        _pageSize: blogAppConfig.paging.pageSize,
        _orderBy: 'publishDate,created,desc',
        includePublished: true,
        includeScheduled: true,
        includeDrafts: true
      }
    };

    function isNewMonth(index) {
      if (index === 0) {
        return false;
      }
      var current = vm.blogArticles.content[index];
      var last = vm.blogArticles.content[index - 1];
      return !moment(current.publishDate).isSame(last.publishDate, 'month');
    }

    function filterActive() {
      return !(vm.blogArticles._queryParams.includePublished &&
          vm.blogArticles._queryParams.includeScheduled &&
          vm.blogArticles._queryParams.includeDrafts &&
          !vm.blogArticles._queryParams.limitDate);
    }

    function toggleIncludePublished() {
      vm.blogArticles._queryParams.includePublished = !vm.blogArticles._queryParams.includePublished;
      return $q.all([vm.blogArticles.page(0), initFilter()]);
    }

    function toggleIncludeScheduled() {
      vm.blogArticles._queryParams.includeScheduled = !vm.blogArticles._queryParams.includeScheduled;
      return $q.all([vm.blogArticles.page(0), initFilter()]);
    }

    function toggleIncludeDrafts() {
      vm.blogArticles._queryParams.includeDrafts = !vm.blogArticles._queryParams.includeDrafts;
      return $q.all([vm.blogArticles.page(0), initFilter()]);
    }

    function toggleFilterYear(year) {
      vm.filterYear = vm.filterYear === year ? null : year;
    }

    function toggleFilterMonth(yearMonth) {
      if (vm.filterMonth !== yearMonth) {
        vm.blogArticles._queryParams.limitDate = yearMonth;
        vm.filterMonth = yearMonth;
        vm.filterYearActive = yearMonth.substring(0, 4);
      } else {
        delete vm.blogArticles._queryParams.limitDate;
        vm.filterMonth = null;
        vm.filterYearActive = null;
      }
      vm.blogArticles.page(0);
    }

    function initFilter() {
      var qp = vm.blogArticles._queryParams || {};
      return BlogArticleModel.count(vm.app, qp.includePublished, qp.includeScheduled, qp.includeDrafts).then(function (data) {
        vm.timeFilter = _.chain(data).toPairs().orderBy(function (item) {
          return item[0];
        }).map(function (item) {
          return {
            year: item[0].split('-')[0],
            time: item[0],
            moment: moment(item[0] + '-01'),
            count: item[1]
          };
        }).groupBy('year').forEach(function (value) {
          value.sum = _.sumBy(value, 'count');
        }).value();
      });
    }

    function initialLoad() {
      vm.blogArticles.loading = true;
      return BlogArticleModel.pagedQueryWithPermissions(
          undefined, vm.blogArticles._queryParams, {senderId: app.senderId, appId: app.id}, ['edit', 'delete', 'like', 'comment', 'share']
      ).then(function (result) {
        vm.blogArticles = result;
        initFilter();
      }).finally(function () {
        vm.blogArticles.loading = false;
      });
    }

    function deleteArticle(article) {
      modalService.confirm({
        title: 'APP.BLOG.MODAL.DELETE.TITLE',
        text: 'APP.BLOG.MODAL.DELETE.TEXT',
        translationContext: {title: article.title},
        close: {title: 'YES'},
        dismiss: {title: 'NO'}
      }).result.then(function () {
        article.delete().then(function () {
          $state.go($state.current.name, null, {reload: $state.current.name});
        });
      });
    }

    function openView(article) {
      $state.go('.view', {id: article.id});
    }

    initialLoad();
  }

})(angular);
