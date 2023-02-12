(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoSearchFilter', SearchFilter)
      .controller('SearchFilterController', SearchFilterController);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoSearchFilter:coyoSearchFilter
   * @scope
   * @restrict 'E'
   *
   * @description
   * Renders a filter in a panel-heading.
   *
   * Add the class <em>'panel-heading-search-filter'</em> to your panel-heading element to get mobile support.
   *
   * @example
   * <example module="example">
   *   <file name="index.html">
   *     <div ng-controller="ExampleCtrl">
   *       <coyo-search-filter change="onChange()" placeholder="PLACEHOLDER"></coyo-search-filter>
   *     </div>
   *   </file>
   *   <file name="script.js">
   *     angular
   *       .module('example', [])
   *       .controller('ExampleCtrl', ExampleCtrl);
   *
   *     function ExampleCtrl($scope) {
   *       $scope.onChange = function() {};
   *     }
   *   </file>
   * </example>
   */
  function SearchFilter() {
    return {
      restrict: 'E',
      require: 'ngModel',
      templateUrl: 'app/commons/ui/components/filterbox/search-filter.html',
      scope: {},
      bindToController: {
        placeholder: '@',
        change: '=',
        searchTerm: '@'
      },
      controller: 'SearchFilterController',
      controllerAs: '$ctrl'
    };
  }

  function SearchFilterController($element, $scope) {
    var vm = this;

    vm.searchTerm = vm.searchTerm || '';

    vm.search = search;

    function search() {
      vm.change(vm.searchTerm);
    }

    function _clickHandler() {
      $element.find('input').focus();
    }

    (function _init() {
      var icon = $element.find('.zmdi');
      icon.on('click', _clickHandler);
      $scope.$on('$destroy', function () {
        icon.off('click', _clickHandler);
      });
    })();
  }

})(angular);
