(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name commons.ui.coyoFormSubmit
   * @scope
   * @restrict 'A'
   *
   * @description Directive for setting a 'loading' true/false flag on a form controller. You need to make sure that
   * your submit function returns a promise for this to work. Use this as a replacement for angular's 'ngSubmit' directive.
   *
   * @example <form coyo-form-submit="submitMyFormMethod">...</form>
   */
  angular
      .module('commons.ui')
      .directive('coyoFormSubmit', CoyoFormSubmit);

  function CoyoFormSubmit() {
    return {
      restrict: 'A',
      require: '^form',
      transclude: true,
      template: '<fieldset ng-disabled="_form.loading"><ng-transclude></ng-transclude></fieldset>',
      scope: {
        coyoFormSubmit: '&'
      },
      link: function (scope, element, attrs, formCtrl) {
        scope._form = formCtrl;
        element.on('submit', function () {
          var submitPromise = scope.coyoFormSubmit();
          if (submitPromise && angular.isFunction(submitPromise.finally)) {
            formCtrl.loading = true;
            submitPromise.finally(function () {
              formCtrl.loading = false;
            });
          }
        });
      }
    };
  }
})();
