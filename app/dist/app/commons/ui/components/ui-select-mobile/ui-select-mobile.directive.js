(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('uiSelectMobile', uiSelectMobile);

  /**
   * @ngdoc directive
   * @name commons.ui:uiSelectMobile
   * @scope
   * @restrict 'A'
   * @require 'uiSelect'
   *
   * @description
   * Converts ui-select elements into mobile friendly selection lists.
   *
   * @param {string} uiSelectMobile The title of the mobile selection menu.
   */
  function uiSelectMobile($compile) {
    return {
      restrict: 'A',
      require: 'uiSelect',
      link: function (scope, elem, attrs, ctrl) {
        var vm = scope;
        vm.close = ctrl.close;

        var tHead = '<div class="ui-select-mobile-head">'
            + '<h3>' + attrs.uiSelectMobile + '</h3>'
            + '<i class="zmdi zmdi-close" ng-click="close()"></i>'
            + '</div>';
        var eHead = $compile(tHead)(scope);

        elem.addClass('ui-select-mobile');
        elem.prepend(eHead);
      }
    };
  }

})(angular);
