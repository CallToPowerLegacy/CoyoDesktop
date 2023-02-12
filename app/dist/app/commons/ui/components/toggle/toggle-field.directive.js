(function () {
  'use strict';

  angular.module('commons.ui')
      .directive('coyoToggleField', CoyoToggleField);

  function CoyoToggleField($compile, $sanitize) {
    return {
      restrict: 'A',
      require: '^^coyoToggleForm',
      link: function (scope, elem, attrs) {
        elem.addClass('coyo-toggle-show');

        var content = $compile('<div class="form-control-static coyo-toggle-hide"></div>')(scope);
        elem.after(content);
        setContent();

        var toggleForm = scope.$on('coyoToggleForm:isEditable', function (event, isEditable) {
          if (!isEditable) {
            setContent();
          }
        });

        scope.$on('$destroy', toggleForm);

        function setContent() {
          if (attrs.coyoToggleField) {
            content.html($sanitize(scope.$eval(attrs.coyoToggleField)));
          } else {
            content.text(scope.$eval(attrs.ngModel));
          }
        }
      }
    };
  }
})();
