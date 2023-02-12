(function () {
  'use strict';

  angular.module('commons.ui')
      .directive('coyoToggleForm', CoyoToggleForm);

  function CoyoToggleForm() {
    return {
      restrict: 'A',
      require: 'form',
      controller: angular.noop,
      link: function (scope, elem, attrs) {
        scope.$watch(attrs.coyoToggleForm, function (isEditable) {
          scope.$broadcast('coyoToggleForm:isEditable', isEditable);
          if (isEditable) {
            elem.addClass('coyo-toggle-active');
            elem.removeClass('coyo-toggle-inactive');
          } else {
            elem.addClass('coyo-toggle-inactive');
            elem.removeClass('coyo-toggle-active');
          }
        });
      }
    };
  }
})();
