(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoFilter', filter);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoFilter:coyoFilter
   * @restrict 'E'
   * @scope
   *
   * @description
   * Renders a search filter.
   *
   * @param {string} titleKey translation key for the title
   *
   * @example
   * <example module="example">
   *   <file name="index.html">
   *     <div>
   *       <coyo-filter title-key="TITLE">
   *         <coyo-filter-entry ...></coyo-filter-entry>
   *       </coyo-filter>
   *     </div>
   *   </file>
   *   <file name="script.js">
   *     angular
   *       .module('example', []);
   *   </file>
   * </example>
   */
  function filter() {
    return {
      restrict: 'E',
      templateUrl: 'app/commons/ui/components/filterbox/filter.html',
      scope: {},
      bindToController: {
        titleKey: '@',
        expand: '&',
        noIcons: '<?'
      },
      transclude: true,
      controller: function () {},
      controllerAs: '$ctrl'
    };
  }

})(angular);
