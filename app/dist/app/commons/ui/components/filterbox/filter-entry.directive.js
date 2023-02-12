(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoFilterEntry', filterEntry);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoFilterEntry:coyoFilterEntry
   * @scope
   * @restrict 'E'
   *
   * @description
   * Renders a single entry for a filter
   *
   * @param {string?} text the display text (if unset, textKey must be set)
   * @param {string?} textKey translation key for the display text (if unset, text must be set)
   * @param {string?} icon icon class
   * @param {string?} iconColor color value for the icon (if set, icon must be set as well)
   * @param {string?} badge content for the badge (usually a number)
   * @param {function} onClick click handler for when the filter entry is selected
   * @param {string} active expression to evaluate if the entry is active
   *
   * @see commons.ui.coyoFilter:coyoFilter
   */
  function filterEntry() {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      templateUrl: 'app/commons/ui/components/filterbox/filter-entry.html',
      scope: {},
      require: ['^coyoFilter', 'coyoFilterEntry'],
      bindToController: {
        text: '@',
        textKey: '@',
        icon: '@',
        iconColor: '@',
        badge: '<?',
        onClick: '&',
        active: '<'
      },
      controller: function () {},
      controllerAs: '$ctrl',
      link: function (scope, element, attributes, controllers) {
        var filterController = controllers[0];
        var vm = controllers[1];

        vm.iconStyle = vm.iconColor ? 'color: ' + vm.iconColor + ';' : '';
        vm.clickHandler = function () {
          if (vm.loading) {
            return;
          }
          var promise = vm.onClick();
          if (promise) {
            vm.loading = true;
            filterController.loading = true;
            promise.finally(function () {
              vm.loading = false;
              filterController.loading = false;
            });
          }
        };
      }
    };
  }

})(angular);
