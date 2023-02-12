(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.subscriptions')
      .directive('coyoSubscriptionsWidget', subscriptionsWidget)
      .controller('SubscriptionsWidgetController', SubscriptionsWidgetController);

  /**
   * @ngdoc directive
   * @name coyo.widgets.subscriptions:coyoSubscriptionsWidget
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Renders the widget to display lists of pages and workspaces the user is subscribed to.
   */
  function subscriptionsWidget() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/widgets/subscriptions/subscriptions-widget.html',
      scope: {},
      bindToController: {
        widget: '<'
      },
      controller: 'SubscriptionsWidgetController',
      controllerAs: '$ctrl'
    };
  }

  function SubscriptionsWidgetController($rootScope, $scope, $element, $timeout, coyoConfig, authService, targetService, UserSubscriptionModel, Pageable, utilService) {
    var vm = this;
    var pageSize = 5;
    var currentUser;
    var closeOnEscKeyEvents = {};
    var componentIds = {};

    vm.data = {
      page: {
        icon: coyoConfig.entityTypes.page.icon,
        items: [],
        loading: false,
        currentPage: null,
        showFilter: false,
        searchTerm: null,
        empty: false
      },
      workspace: {
        icon: coyoConfig.entityTypes.workspace.icon,
        items: [],
        loading: false,
        currentPage: null,
        showFilter: false,
        searchTerm: null,
        empty: false
      }
    };

    vm.open = open;
    vm.loadMore = loadMore;
    vm.toggleFilter = toggleFilter;
    vm.softCloseFilter = softCloseFilter;
    vm.forceCloseFilter = forceCloseFilter;
    vm.getComponentId = getComponentId;

    function open(sender) {
      targetService.go(sender.target);
    }

    function loadMore(type, reset) {
      var data = vm.data[type];

      if (!data.showFilter) {
        data.searchTerm = null;
      }

      if (data.loading) {
        return;
      } else if (reset) {
        data.currentPage = null;
        data.items = [];
      }

      // perform search
      if (!data.currentPage || !data.currentPage.last) {
        data.loading = true;

        var term = data.searchTerm || null;
        var pageable = new Pageable((data.currentPage ? data.currentPage.number + 1 : 0), pageSize, 'displayName.sort');
        UserSubscriptionModel.searchWithFilter(currentUser.id, term, pageable, {type: [type]}, [], {}).then(function (page) {
          data.currentPage = page;
          data.items.push.apply(data.items, page.content);
          data.empty = page.totalElements === 0 && !data.searchTerm;
        }).finally(function () {
          data.loading = false;
        });
      }
    }

    function getComponentId(type) {
      componentIds[type] = componentIds[type] || 'search-filter-' + type + '-' + utilService.uuid();
      return componentIds[type];
    }

    function softCloseFilter(type) {
      var data = vm.data[type];
      if (!data.searchTerm && data.showFilter) {
        toggleFilter(type);
      }
    }

    function forceCloseFilter(type) {
      var data = vm.data[type];
      if (data.showFilter) {
        toggleFilter(type);
      }
    }

    function toggleFilter(type) {
      var data = vm.data[type];
      data.showFilter = !data.showFilter;
      if (data.showFilter) {
        $timeout(function () {
          $element.find('input.filter-' + type).focus();
        });
        registerCloseEvents(type);
      } else {
        if (data.searchTerm) {
          loadMore(type, true);
        }
        unregisterCloseEvents(type);
      }
    }

    function registerCloseEvents(type) {
      closeOnEscKeyEvents[type] = function () {
        forceCloseFilter(type);
      };
    }

    function unregisterCloseEvents(type) {
      _.unset(closeOnEscKeyEvents, type);
    }

    function onEscKeyUpEventListener() {
      _.forOwn(closeOnEscKeyEvents, function (handler) {
        if (_.isFunction(handler)) {
          handler();
        }
      });
      $scope.$digest();
    }

    (function _init() {
      authService.getUser().then(function (user) {
        currentUser = user;
        loadMore('page');
        loadMore('workspace');
      });
      var unsubscribeRootFn = $rootScope.$on('keyup:esc', onEscKeyUpEventListener);
      $scope.$on('$destroy', unsubscribeRootFn);
    })();
  }

})(angular);
