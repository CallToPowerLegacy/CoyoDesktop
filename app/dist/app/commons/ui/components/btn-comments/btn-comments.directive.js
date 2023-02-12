(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoBtnComments', btnComments)
      .controller('BtnCommentsController', BtnCommentsController);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoBtnComments:coyoBtnComments
   * @scope
   * @restrict 'E'
   * @element OWN
   *
   * @description
   * Renders a comments count button from the perspective of the current user.
   *
   * @requires commons.auth.authService
   * @requires coyo.domain.CommentsModel
   *
   * @param {object} target The like target.
   * @param {string} target.id The ID of the target.
   * @param {string} target.typeName The type of the target.
   */
  function btnComments() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/commons/ui/components/btn-comments/btn-comments.html',
      scope: true,
      bindToController: {
        target: '<',
        onClick: '&'
      },
      controller: 'BtnCommentsController',
      controllerAs: '$ctrl'
    };
  }

  function BtnCommentsController(authService, CommentModel) {
    var vm = this;

    vm.isLoading = true;

    (function _init() {
      authService.getUser().then(function (user) {
        vm.currentUser = user;
        return CommentModel.getInfo(vm.target.id, vm.target.typeName, vm.currentUser.id).then(function (info) {
          vm.count = info.count;
        });
      }).finally(function () {
        vm.isLoading = false;
      });
    })();
  }

})(angular);
