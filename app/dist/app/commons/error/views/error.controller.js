(function (angular) {
  'use strict';

  angular
      .module('commons.error')
      .controller('ErrorController', ErrorController);

  function ErrorController($stateParams, $state, $injector, coyoUrls) {
    var vm = this;

    var emojis = {
      403: '&#x1F46E;',
      404: '&#x1F47B;',
      default: '&#x1F622;'
    };

    var predefinedButtons = {
      'CONFIGURE_BACKEND': {
        title: 'ERRORS.BUTTON.CONFIGURE_BACKEND',
        action: /*@ngInject*/ function (backendUrlService, $state) {
          backendUrlService.clearUrl();
          $state.go('front.configure');
        }
      },
      'RETRY': {
        title: 'ERRORS.BUTTON.RETRY',
        action: /*@ngInject*/ function ($window) {
          $window.location.reload(); // $state.reload would reload the error page, we want the original url
        }
      },
      'CUSTOMER_CENTER': {
        title: 'ERRORS.BUTTON.CUSTOMER_CENTER',
        action: /*@ngInject*/ function ($window) {
          $window.location.href = coyoUrls.customerCenter;
        }
      },
      default: {
        title: 'ERRORS.BACK'
      }
    };

    vm.message = $stateParams.message;
    vm.emoji = emojis[$stateParams.status] || emojis.default;
    vm.buttons = $stateParams.buttons ? _.map($stateParams.buttons, function (button) {
      if (angular.isString(button)) {
        return predefinedButtons[button];
      }
      return button;
    }) : [predefinedButtons.default];
    vm.buttonAction = buttonAction;

    function buttonAction(button) {
      if (button.action) {
        $injector.invoke(button.action);
      } else {
        $state.go('main', {}, {reload: true});
      }
    }
  }

})(angular);
