(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoContextMenu', contextMenu)
      .controller('ContextMenuController', ContextMenuController);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoContextMenu:coyoContextMenu
   * @restrict 'E'
   *
   * @description
   * Renders a context menu.
   *
   * The context menu is a bootstrap dropdown in desktop view and a slide-up menu in mobile view.
   *
   * @param {boolean} alignRight
   * If true the menu will be right-aligned (useful when the menu is placed at the right side of the screen)
   *
   * @param {string=} toggleElement
   * jqLite selector of the element that is used to toggle the menu. If set, no icon will be rendered.
   *
   * @param {string} title
   * Translation key of the menu title.
   *
   * @param {boolean=} titleDesktop
   * If true, the menu title will be displayed on desktop as well at the top of the menu (defaults to only show on mobile).
   *
   * @require $scope
   * @require $timeout
   * @require commons.ui.utilService
   *
   * @example
   * <example module="example">
   *   <file name="index.html">
   *     <div>
   *       <coyo-context-menu title="Title above mobile menu">
   *         <li>Item 1</li>
   *         <li>Item 2</li>
   *       </coyo-context-menu>
   *     </div>
   *   </file>
   *   <file name="script.js">
   *     angular
   *       .module('example', []);
   *   </file>
   * </example>
   */
  function contextMenu() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/commons/ui/components/context-menu/context-menu.html',
      scope: {},
      bindToController: {
        alignRight: '<',
        toggleElement: '@',
        title: '@',
        titleDesktop: '<?'
      },
      transclude: true,
      controller: 'ContextMenuController',
      controllerAs: '$ctrl'
    };
  }

  function ContextMenuController($scope, $rootScope, $timeout, utilService) {
    var vm = this;

    vm.open = false;
    vm.id = 'context-menu-' + utilService.uuid();

    vm.toggleMenu = toggleMenu;

    $rootScope.$on('screenSize:changed', function (event, screenSize, oldScreenSize) {
      if ((oldScreenSize.isSm || oldScreenSize.isXs) && (screenSize.isMd || screenSize.isLg) && vm.open) {
        $rootScope.showBackdrop = false;
      } else if ((screenSize.isSm || screenSize.isXs) && (oldScreenSize.isMd || oldScreenSize.isLg) && vm.open) {
        $rootScope.showBackdrop = true;
      }
    });

    function toggleMenu(value) {
      $timeout(function () { // delay opening to avoid firing click-outside event
        vm.open = angular.isDefined(value) ? value : !vm.open;

        if ($rootScope.screenSize.isSm || $rootScope.screenSize.isXs || $rootScope.showBackdrop) {
          $rootScope.showBackdrop = vm.open;
        }
      });
    }

    function onClick() {
      vm.toggleMenu();
      $scope.$apply(); // native event handling
    }

    if (vm.toggleElement) {
      $timeout(function () {
        var toggle = angular.element(vm.toggleElement);
        toggle.on('click', onClick);

        $scope.$on('$destroy', function () {
          toggle.off('click', onClick);
        });
      });
    }
  }

})(angular);
