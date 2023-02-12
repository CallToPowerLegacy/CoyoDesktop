(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.userprofile')
      .directive('coyoUserProfileWidget', userProfileWidgetDirective)
      .controller('UserProfileWidgetController', UserProfileWidgetController);

  /**
   * @ngdoc directive
   * @name coyo.widgets.userprofile:coyoUserProfileWidget
   * @scope
   * @restrict 'E'
   * @element OWN
   *
   * @description
   * Renders a summary of a user's profile.
   *
   */
  function userProfileWidgetDirective() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/widgets/user-profile/user-profile-widget.html',
      scope: {},
      bindToController: {
        widget: '<'
      },
      controller: 'UserProfileWidgetController',
      controllerAs: '$ctrl'
    };
  }

  function UserProfileWidgetController(UserModel, $scope, widgetStatusService) {
    var vm = this;
    vm.loadUser = loadUser;

    widgetStatusService.refreshOnSettingsChange($scope);

    function loadUser() {
      delete vm.user;
      return UserModel.get(vm.widget.settings._selectedUser[0]).then(function (user) {
        vm.user = user;
        return user;
      }).finally(function () {
        vm.lastUpdate = new Date().getTime();
      });
    }
  }

})(angular);
