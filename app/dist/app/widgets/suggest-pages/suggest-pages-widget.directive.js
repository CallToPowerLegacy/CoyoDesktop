(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.suggestpages')
      .directive('coyoSuggestPagesWidget', suggestPagesWidget)
      .controller('SuggestPageWidgetController', SuggestPageWidgetController);

  /**
   * @ngdoc directive
   * @name coyo.widgets.suggestpages:coyoSuggestPagesWidget
   * @element ANY
   * @restrict E
   * @scope
   *
   * @description
   * Renders the widget to display a selection of pages
   *
   * @param {object} widget
   * The widget configuration
   */
  function suggestPagesWidget() {
    return {
      restrict: 'E',
      templateUrl: 'app/widgets/suggest-pages/suggest-pages-widget.html',
      scope: {},
      bindToController: {
        widget: '<'
      },
      controller: 'SuggestPageWidgetController',
      controllerAs: '$ctrl'
    };
  }

  function SuggestPageWidgetController($scope, $q, PageModel, authService, widgetStatusService, subscriptionsService) {
    var vm = this;

    vm.loading = false;

    vm.loadPages = loadPages;

    widgetStatusService.refreshOnSettingsChange($scope);

    function _getSubscribedPageIds() {
      return authService.getUser().then(function (user) {
        return subscriptionsService.getSubscriptionsByType(user.id, 'page').then(function (subscriptions) {
          return _.map(subscriptions, 'targetId');
        });
      });
    }

    function loadPages() {
      vm.loading = true;

      return _getSubscribedPageIds().then(function (subscribedIds) {
        var pageIds = _.difference(vm.widget.settings._pageIds, subscribedIds);
        var pagePromise = pageIds.length ? PageModel.$get(PageModel.$url(), {pageIds: pageIds}) : $q.resolve([]);
        return pagePromise.then(function (pages) {
          vm.pages = pages;
          return pages;
        }).finally(function () {
          vm.lastUpdate = new Date().getTime();
          vm.loading = false;
        });
      });
    }
  }

})(angular);
