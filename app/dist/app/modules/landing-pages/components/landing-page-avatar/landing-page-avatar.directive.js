(function (angular) {
  'use strict';

  /**
   * @ngdoc directive
   * @name coyo.landingPages.coyoLandingPageAvatar:coyoLandingPageAvatar
   * @restrict 'E'
   * @element OWN
   *
   * @description
   * Displays a landing page avatar.
   *
   * @param {object} landingPage
   * The landing page to render the avatar for.
   *
   * @param {boolean=} noLink
   * Can be set to 'true' if the avatar image should not link to the landing page itself (default: 'false').
   *
   * @param {string=} avatarSize
   * Desired size of the avatar. Possible values are xs, sm, md, lg and xl.
   *
   * @requires $scope
   * @requires $state
   * @requires commons.target.targetService
   */
  angular
      .module('coyo.landing-pages')
      .directive('coyoLandingPageAvatar', landingPageAvatar)
      .controller('LandingPageAvatarController', LandingPageAvatarController);

  function landingPageAvatar() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/modules/landing-pages/components/landing-page-avatar/landing-page-avatar.html',
      scope: {},
      bindToController: {
        landingPage: '<',
        noLink: '<?',
        avatarSize: '@?'
      },
      controller: 'LandingPageAvatarController',
      controllerAs: '$ctrl'
    };
  }

  function LandingPageAvatarController($scope, $state, targetService) {
    var vm = this;
    var canLinkToLandingPage = false;

    vm.open = open;

    function open(event) {
      if (vm.isLink) {
        event.stopPropagation();
        $state.go('main.landing-page.show', {idOrSlug: vm.landingPage.slug}, {reload: 'main.landing-page.show'});
      }
    }

    (function _init() {
      // check whether user has permission to link to landing page
      targetService.onCanLinkTo(vm.landingPage.target, function (canLink) {
        canLinkToLandingPage = canLink;
        vm.isLink = !vm.noLink && canLinkToLandingPage;
      }).then(function (deregisterFn) {
        $scope.$on('$destroy', deregisterFn);
      });

      // check whether no link parameter is set or changed
      $scope.$watch(function () {
        return vm.noLink;
      }, function (newValue, oldValue) {
        if (newValue !== oldValue) {
          vm.isLink = !newValue && canLinkToLandingPage;
        }
      });
    })();
  }

})(angular);
