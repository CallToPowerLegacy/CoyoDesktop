(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoFilterbox', filterbox)
      .controller('FilterboxController', FilterboxController);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoFilterbox:coyoFilterbox
   * @scope
   * @restrict 'E'
   *
   * @description
   * Renders a filter container with the following elements:
   * * list filters (dropdown on mobile) (optional),
   * * search text filter (optional),
   * * list count slot (optional) and
   * * additional actions slot (optional).
   *
   * @requires $transclude
   * @requires $timeout
   *
   * @param {boolean} filterActive Flag to indicate an active filter (colored icon)
   * @param {boolean} vertical Flag whether to display the box vertically instead of horizontally (only to be used with fb-filter and fb-search)
   * @param {boolean} hideActions Flag to hide the actions section / menu even if the transclusion slot is filled. Useful when the options are permission dependent and none may be visible.
   * @param {boolean} attached Flag whether the filterbox is directly attached
   * @param {boolean} noMobileContextMenu Flag that the action items itself instead of a context menu including the action items should be shown
   *
   * @example
   * <example module="example">
   *   <file name="index.html">
   *     <div>
   *       <coyo-filterbox filter-active="...">
   *         <fb-filter>
   *           <coyo-filter ...>...</coyo-filter>
   *         </fb-filter>
   *         <fb-search>
   *           <coyo-search-filter ...>...</coyo-search-filter>
   *         </fb-search>
   *         <fb-count>
   *           <coyo-counter ...></coyo-counter>
   *         </fb-count>
   *         <fb-actions>
   *           <li><a ...>Action</a></li>
   *         </fb-actions>
   *       </coyo-filterbox>
   *     </div>
   *   </file>
   *   <file name="script.js">
   *     angular
   *       .module('example', []);
   *   </file>
   * </example>
   *
   * @see coyo-filter
   * @see coyo-search-filter
   * @see coyo-counter
   * @see coyo-context-menu
   */
  function filterbox() {
    return {
      restrict: 'E',
      templateUrl: 'app/commons/ui/components/filterbox/filterbox.html',
      scope: {},
      bindToController: {
        filterActive: '=',
        vertical: '=',
        hideActions: '=?',
        attached: '=',
        noMobileContextMenu: '='
      },
      transclude: {
        'fb-filter': '?fbFilter',
        'fb-actions': '?fbActions',
        'fb-search': '?fbSearch',
        'fb-count': '?fbCount'
      },
      controller: 'FilterboxController',
      controllerAs: '$ctrl',
      link: function (scope, el) {
        el.find('.actions-vertical a').addClass('btn btn-primary btn-block mb-xs');
      }
    };
  }

  function FilterboxController($rootScope, $scope, $transclude, $timeout) {
    var vm = this;

    vm.attach = _.isUndefined(vm.attached) ? false : vm.attached;
    vm.showMobileContextMenu = _.isUndefined(vm.noMobileContextMenu) ? true : !vm.noMobileContextMenu;
    vm.showActions = $transclude.isSlotFilled('fb-actions') && !vm.hideActions;
    vm.showCount = $transclude.isSlotFilled('fb-count');
    vm.showFilter = $transclude.isSlotFilled('fb-filter');
    vm.showSearch = $transclude.isSlotFilled('fb-search');
    vm.filterOpen = false;
    vm.toggleFilter = toggleFilter;
    var unsubscribe = $rootScope.$on('screenSize:changed', function (event, screenSize) {
      vm.isMobile = screenSize.isXs || screenSize.isSm;
    });
    $scope.$on('$destroy', unsubscribe);

    vm.isMobile = $rootScope.screenSize.isXs || $rootScope.screenSize.isSm;

    function toggleFilter(value) {
      $timeout(function () { // delay opening to avoid firing click-outside event
        vm.filterOpen = angular.isDefined(value) ? value : !vm.filterOpen;
        var fn = vm.filterOpen ? 'addClass' : 'removeClass';
        angular.element('body')[fn]('filter-active');
      });
    }
  }

})(angular);
