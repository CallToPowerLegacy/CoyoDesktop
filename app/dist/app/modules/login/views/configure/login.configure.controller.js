(function (angular) {
  'use strict';

  angular
      .module('coyo.login')
      .controller('LoginConfigureController', LoginConfigureController);

  /**
   * Controller for entering a dynamic backend URL if none is available in the config.js.
   */
  function LoginConfigureController($state, backendUrlService, curtainService, versionCheckService) {
    var vm = this;

    vm.save = save;

    function save() {
      vm.error = null;

      // remove trailing slash
      vm.url = _.trimEnd(vm.url, '/');

      // Auto-add https://
      var theUrl = vm.url.toLowerCase();
      if (!_.startsWith(theUrl, 'http://') && !_.startsWith(theUrl, 'https://')) {
        vm.url = 'https://' + vm.url;
      }

      versionCheckService.check(vm.url).then(function (code) {
        switch (code) {
          case 1: {
            vm.error = '';
            backendUrlService.setUrl(vm.url);
            $state.transitionTo('setup');
            break;
          }
          case -1: {
            vm.error = 'MODULE.LOGIN.CONFIGURE.ERROR.GENERAL';
            break;
          }
          case -2: {
            vm.error = 'MODULE.LOGIN.CONFIGURE.ERROR.SERVER_VERSION_TOO_OLD';
            break;
          }
          case 2: {
            vm.error = 'MODULE.LOGIN.CONFIGURE.ERROR.SERVER_VERSION_TOO_NEW';
            break;
          }
        }
      }).catch(function () {
        vm.error = 'MODULE.LOGIN.CONFIGURE.ERROR.GENERAL';
      });
    }

    (function _init() {
      if (backendUrlService.isSet()) {
        $state.transitionTo('front.login');
        return;
      }

      curtainService.hide();
    })();
  }

})(angular);
