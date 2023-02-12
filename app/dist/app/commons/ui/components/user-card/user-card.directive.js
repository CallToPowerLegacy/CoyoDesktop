(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoUserCard', userCard)
      .controller('UserCardController', UserCardController);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoUserCard:coyoUserCard
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Displays a user card. The card shows the name, a given subtitle and the user's avatar. If set, the card can be
   * clicked and references to the user's profile. One can use the two slots `cardHeader` and `cardBody` to add
   * additional information or options to the card.
   *
   * @param {object} user
   * The user to display the card for.
   *
   * @param {object} currentUser
   * It is necessary to pass the current user to the directive in order to evaluate permissions. For example whether
   * the current user can see the given user's profile or follow the given user.
   *
   * @param {string=} subtitle
   * The string to display as subtitle.
   *
   * @param {boolean=} showFollowButton
   * Determines whether the a button to follow the user should be displayed or not.
   *
   * @param {string=} showMessagingButton
   * Can be set to 'true' if a messaging button (start new chat) should be shown.
   *
   * @requires $scope
   * @requires $state
   * @requires $transclude
   * @requires authService
   */
  function userCard() {
    return {
      restrict: 'E',
      transclude: {
        header: '?cardHeader',
        body: '?cardBody'
      },
      templateUrl: 'app/commons/ui/components/user-card/user-card.html',
      scope: {},
      bindToController: {
        user: '<',
        currentUser: '<',
        subtitle: '@',
        showFollowButton: '<?',
        showMessagingButton: '<?'
      },
      controller: 'UserCardController',
      controllerAs: '$ctrl'
    };
  }

  function UserCardController($scope, $state, $transclude, authService) {
    var vm = this;

    vm.bodySlotPresent = $transclude.isSlotFilled('body');

    vm.canOpen = canOpen;
    vm.open = open;

    function canOpen(user) {
      return user.id === vm.currentUser.id ? vm.canAccessOwnProfile : vm.canAccessOtherProfile;
    }

    function open(user) {
      if (canOpen(user)) {
        $state.go('main.profile', {userId: user.slug});
      }
    }

    (function _init() {
      authService.onGlobalPermissions('ACCESS_OTHER_USER_PROFILE', function (permission) {
        vm.canAccessOtherProfile = permission;
      });
      authService.onGlobalPermissions('ACCESS_OWN_USER_PROFILE', function (permission) {
        vm.canAccessOwnProfile = permission;
      });
    })();
  }

})(angular);
