(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.completeprofile')
      .directive('coyoCompleteProfileWidget', CompleteProfileWidget)
      .controller('CompleteProfileWidgetController', CompleteProfileWidgetController);

  /**
   * @ngdoc directive
   * @name coyo.widgets.completeprofile:coyoCompleteProfileWidget
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Renders the widget to display user profile information, which should be completed by the user.
   *
   * @param {object} widget
   * The widget configuration
   */
  function CompleteProfileWidget() {
    return {
      restrict: 'E',
      templateUrl: 'app/widgets/complete-profile/complete-profile-widget.html',
      scope: {},
      bindToController: {
        widget: '<',
        showWidget: '=',
        editMode: '<'
      },
      controller: 'CompleteProfileWidgetController',
      controllerAs: '$ctrl'
    };
  }

  function CompleteProfileWidgetController(CompleteProfileWidgetModel, authService) {
    var vm = this;

    vm.loadCompleteProfile = loadCompleteProfile;

    function loadCompleteProfile() {
      return CompleteProfileWidgetModel.getCompleteProfileInfo().then(function (completeInfo) {

        // checks if required user information has already been completed
        vm.showWidget.show = !(completeInfo.profileFields && completeInfo.avatar && completeInfo.cover && completeInfo.followingUser
            && completeInfo.pageMember && completeInfo.createdPost);

        vm.completeInfo = {
          'profileFields': {
            'msg': 'WIDGET.COMPLETEPROFILE.PROFILEFIELDS',
            'checked': completeInfo.profileFields
          },
          'avatar': {
            'msg': 'WIDGET.COMPLETEPROFILE.AVATAR',
            'checked': completeInfo.avatar
          },
          'cover': {
            'msg': 'WIDGET.COMPLETEPROFILE.COVER',
            'checked': completeInfo.cover
          },
          'followingUser': {
            'msg': 'WIDGET.COMPLETEPROFILE.FOLLOWINGUSER',
            'checked': completeInfo.followingUser,
            'href': 'main.colleagues'
          },
          'pageMember': {
            'msg': 'WIDGET.COMPLETEPROFILE.PAGEMEMBER',
            'checked': completeInfo.pageMember,
            'href': 'main.page'
          },
          'createdPost': {
            'msg': 'WIDGET.COMPLETEPROFILE.CREATEDPOST',
            'checked': completeInfo.createdPost
          }
        };

        return authService.getUser().then(function (user) {
          // adds href's, which are depending on the user's id
          vm.completeInfo.profileFields.href = 'main.profile.info({ userId : "' + user.slug + '"})';
          vm.completeInfo.createdPost.href = 'main.profile.activity({ userId : "' + user.slug + '"})';
          vm.completeInfo.avatar.href = vm.completeInfo.createdPost.href;
          vm.completeInfo.cover.href = vm.completeInfo.createdPost.href;

          return completeInfo;
        });
      });
    }
  }

})(angular);
