(function (angular) {
  'use strict';

  /**
   * @ngdoc directive
   * @name commons.ui.coyoComment:coyoComment
   * @scope
   * @restrict 'E'
   * @element OWN
   *
   * @description
   * Renders a single comment
   *
   * @param {object} ngModel The comment
   * @param {string} authorId Optional author id, e.g. selected in timeline item.
   */
  angular
      .module('commons.ui')
      .directive('coyoComment', comment);

  function comment() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/commons/ui/components/comment/comment.html',
      scope: {},
      bindToController: {
        ngModel: '<',
        authorId: '<?'
      },
      controller: 'CommentController',
      controllerAs: '$ctrl'
    };
  }

})(angular);
