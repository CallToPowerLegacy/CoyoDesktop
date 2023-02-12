(function (angular) {
  'use strict';

  angular
      .module('coyo.pages')
      .directive('coyoPageAvatar', pageAvatar)
      .controller('PageAvatarController', PageAvatarController);

  /**
   * @ngdoc directive
   * @name coyo.pages.coyoPageAvatar:coyoPageAvatar
   * @restrict 'E'
   * @element OWN
   *
   * @description
   * Displays a page avatar.
   *
   * @param {object} page
   * The page to render the avatar for.
   *
   * @param {boolean=} noLink
   * Can be set to 'true' if the avatar image should not link to the page itself (default: 'false').
   *
   * @param {string=} avatarSize
   * Desired size of the avatar. Possible values are xs, sm, md, lg and xl.
   *
   * @requires $scope
   * @requires $state
   * @requires commons.target.targetService
   */
  function pageAvatar() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/modules/pages/components/page-avatar/page-avatar.html',
      scope: {},
      bindToController: {
        page: '=',
        noLink: '<?',
        avatarSize: '@?'
      },
      controller: 'PageAvatarController',
      controllerAs: '$ctrl'
    };
  }

  function PageAvatarController($scope, $state, targetService) {
    var vm = this;
    var canLinkToPage = false;

    vm.open = open;
    vm.errorHandler = errorHandler;

    function open(event) {
      if (vm.isLink) {
        event.stopPropagation();
        $state.go('main.page.show', {idOrSlug: vm.page.slug}, {inherit: false, reload: 'main.page.show'});
      }
    }

    function errorHandler() {
      vm.loadError = true;
    }

    (function _init() {
      // check whether user has permission to link to page
      targetService.onCanLinkTo(vm.page.target, function (canLink) {
        canLinkToPage = canLink;
        vm.isLink = !vm.noLink && canLinkToPage;
      });

      // check whether no link parameter is set or changed
      $scope.$watch(function () {
        return vm.noLink;
      }, function (newValue, oldValue) {
        if (newValue !== oldValue) {
          vm.isLink = !newValue && canLinkToPage;
        }
      });
    })();
  }

})(angular);
