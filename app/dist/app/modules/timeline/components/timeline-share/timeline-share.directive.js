(function (angular) {
  'use strict';

  angular
      .module('coyo.timeline')
      .directive('coyoTimelineShare', timelineShare)
      .controller('TimelineShareDirectiveController', TimelineShareDirectiveController);

  /**
   * @ngdoc directive
   * @name coyo.timeline.coyoTimelineShare:coyoTimelineShare
   * @restrict 'E'
   * @element OWN
   *
   * @description
   * Renders a timeline share.
   *
   * @param {object} ngModel The timeline share
   */
  function timelineShare() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/modules/timeline/components/timeline-share/timeline-share.html',
      scope: {},
      bindToController: {
        accessOriginalAuthor: '<',
        ngModel: '<'
      },
      controller: 'TimelineShareDirectiveController',
      controllerAs: 'tlShare'
    };
  }

  function TimelineShareDirectiveController($scope, TimelineShareModel, authService) {
    var vm = this;
    vm.originalAuthor = false;

    vm.$onInit = init;
    vm.toggleOriginalAuthor = toggleOriginalAuthor;

    function init() {
      var unregister = $scope.$watch(function () {
        return vm.ngModel;
      }, function () {
        setHeadline();
        $scope.$broadcast('timelineShare:refresh');
      });

      $scope.$on('$destroy', unregister);
      setHeadline();
    }

    // load current user and determine headline
    function setHeadline() {
      authService.getUser().then(function (user) {
        vm.currentUser = user;

        var authorPart = 'NONE';
        if (vm.ngModel.author) {
          authorPart = vm.ngModel.author.id === user.id ? 'YOU' : 'OTHER';
        }

        var recipientPart = 'NONE';
        if (vm.ngModel.recipient) {
          recipientPart = vm.ngModel.recipient.id === user.id ? 'YOU' : 'OTHER';
        }

        vm.headline = 'MODULE.TIMELINE.SHARE.HEADLINE.' + authorPart + '_WITH_' + recipientPart;
        vm.headlineSuffix = vm.headline + '.SUFFIX';
      });
    }

    function toggleOriginalAuthor() {
      if (!vm.originalAuthor) {
        new TimelineShareModel(vm.ngModel).getOriginalAuthor().then(function (originalAuthor) {
          vm.originalAuthor = originalAuthor;
          vm.showOriginalAuthor = !vm.showOriginalAuthor;
        });
      } else {
        vm.showOriginalAuthor = !vm.showOriginalAuthor;
      }
    }
  }

})(angular);
