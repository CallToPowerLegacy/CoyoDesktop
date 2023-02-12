(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .component('coyoComments', comments());

  /**
   * @ngdoc directive
   * @name commons.ui.coyoComments:coyoComments
   * @scope
   * @restrict 'E'
   * @element OWN
   *
   * @description
   * Renders comments as a panel-footer element.
   *
   * @param {object} target The comment target.
   * @param {string} target.id The target ID.
   * @param {string} target.typeName The target type.
   * @param {string} [init] Initial comment data.
   * @param {string} authorId Optional author id, e.g. selected in timeline item.
   */
  function comments() {
    return {
      templateUrl: 'app/commons/ui/components/comments/comments.html',
      bindings: {
        target: '<',
        init: '<',
        authorId: '<?'
      },
      controller: 'CommentsController'
    };
  }

})(angular);
