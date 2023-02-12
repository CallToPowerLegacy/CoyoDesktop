(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.welcome')
      .directive('coyoWelcomeWidget', welcomeWidgetDirective)
      .controller('WelcomeWidgetController', WelcomeWidgetController);

  /**
   * @ngdoc directive
   * @name coyo.widgets.welcome.coyoWelcomeWidget:coyoWelcomeWidget
   * @scope
   * @restrict 'E'
   * @element OWN
   *
   * @description
   * Shows the user's avatar, cover image online status and a warm welcome to Coyo.
   */
  function welcomeWidgetDirective() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/widgets/welcome/welcome-widget.html',
      scope: {},
      bindToController: {
        widget: '<'
      },
      controller: 'WelcomeWidgetController',
      controllerAs: '$ctrl'
    };
  }

  function WelcomeWidgetController($rootScope, authService, backendUrlService) {
    var vm = this;

    vm.showCover = showCover;
    vm.getCoverStyle = getCoverStyle;

    function showCover() {
      return vm.widget.settings._showCover && !!_.get(vm, 'currentUser.imageUrls.cover');
    }

    function getCoverStyle() {
      if (showCover()) {
        var backendUrl = backendUrlService.getUrl();
        var coverUrl = _.get(vm, 'currentUser.imageUrls.cover');
        var size = $rootScope.screenSize.isRetina ? 'XXL' : 'XL';
        return {'background-image': 'url(' + backendUrl + coverUrl + '&imageSize=' + size + ')'};
      }
      return {};
    }

    (function _init() {
      authService.getUser().then(function (currentUser) {
        vm.currentUser = currentUser;
      });
    })();
  }

})(angular);
