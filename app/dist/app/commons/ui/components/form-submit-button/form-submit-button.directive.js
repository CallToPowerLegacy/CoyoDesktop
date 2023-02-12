(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name commons.ui.coyoFormSubmitButton
   * @scope
   * @restrict 'E'
   * @element ANY
   *
   * @description Directive for a form submit button. When used in combination with the coyoFormSubmit directive,
   * the button will automatically toggle a loading state when the form is submitted and when processing is done.
   *
   * @example <coyo-form-submit-button label="LABEL" hide-icon-on-mobile="true" form-ctrl="formControllerName"></coyo-form-submit-button>
   */
  angular
      .module('commons.ui')
      .directive('coyoFormSubmitButton', CoyoFormSubmitButton);

  function CoyoFormSubmitButton() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/commons/ui/components/form-submit-button/form-submit-button.html',
      scope: {
        formCtrl: '=',
        disabled: '<',
        icon: '@',
        label: '@',
        hideIconOnMobile: '<?',
        hideTextOnMobile: '<?'
      }
    };
  }
})();
