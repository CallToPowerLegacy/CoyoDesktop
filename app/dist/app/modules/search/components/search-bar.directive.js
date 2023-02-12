(function (angular) {
  'use strict';

  angular
      .module('coyo.search')
      .directive('oyocSearchBar', searchBar)
      .controller('SearchBarController', SearchBarController);

  /**
   * @ngdoc directive
   * @name coyo.search.oyocSearchBar:oyocSearchBar
   * @restrict 'E'
   * @element OWN
   * @scope
   *
   * @description
   * Displays and handles the search box in the main nav bar.
   *
   * While the search box is always visible in mobile view, it can be expanded and hidden in desktop view.
   *
   * @requires $rootScope
   * @requires $element
   * @requires $state
   */
  function searchBar() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/modules/search/components/search-bar.html',
      controller: 'SearchBarController',
      controllerAs: 'searchBar'
    };
  }

  function SearchBarController($rootScope, $element, $state, $transitions, $scope) {
    var vm = this;
    vm.$onInit = onInit;

    function setIsSearchResult() {
      if ($state.is('main.search')) {
        vm.isSearchResult = true;
      }
    }

    function toggle() {
      $rootScope.search = angular.extend($state.is('main.search') ? $rootScope.search : {}, {
        visible: !$rootScope.search.visible
      });
      if ($rootScope.search.visible) {
        $element.find('input').focus();
      }
    }

    function search(force) {
      if (!$rootScope.search.visible) {
        toggle();
      }
      if (force || $rootScope.search.term) {
        $state.transitionTo('main.search', angular.extend({
          term: $rootScope.search.term
        }, _.mapKeys($rootScope.search.filter, function (value, key) {
          return key + '[]';
        })));
      }
    }

    function onInit() {
      vm.toggle = toggle;
      vm.search = search;
      vm.isSearchResult = false;

      if (!$rootScope.search) {
        $rootScope.search = {};
      }

      var deregisterHook = $transitions.onSuccess({}, setIsSearchResult);
      $scope.$on('$destroy', deregisterHook);
      setIsSearchResult();
    }
  }

})(angular);
