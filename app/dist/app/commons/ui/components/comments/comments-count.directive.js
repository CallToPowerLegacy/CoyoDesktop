(function () {
  'use strict';

  angular
      .module('commons.ui')
      .component('coyoCommentsCount', coyoCommentsCount())
      .controller('commentsCountController', commentsCountController);

  function coyoCommentsCount() {
    return {
      templateUrl: 'app/commons/ui/components/comments/comments-count.html',
      bindings: {
        target: '<'
      },
      controller: 'commentsCountController',
      controllerAs: '$ctrl'
    };
  }

  function commentsCountController(commentsService) {
    var vm = this;
    vm.count = 0;
    vm.$onInit = init;

    function init() {
      commentsService.getCommentInfo(vm.target.id, vm.target.typeName).then(function (result) {
        vm.count = result.count;
      });
    }

  }
})();
