(function (angular) {
  'use strict';

  angular
      .module('coyo.timeline')
      .directive('coyoTimelineItem', timelineItem)
      .controller('TimelineItemDirectiveController', TimelineItemDirectiveController);

  /**
   * @ngdoc directive
   * @name coyo.timeline.coyoTimelineItem:coyoTimelineItem
   * @restrict 'E'
   * @element OWN
   *
   * @description
   * Renders a timeline item.
   *
   * @param {object}  ngModel The timeline item
   * @param {string}  contextSenders Optionally, the ID of the context senders, that determine if a post is displayed as a share.
   * @param {boolean} isNew Show the new ribbon
   */
  function timelineItem() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/modules/timeline/components/timeline-item/timeline-item.html',
      scope: {},
      bindToController: {
        ngModel: '<',
        contextSenders: '@',
        isNew: '<'
      },
      controller: 'TimelineItemDirectiveController',
      controllerAs: 'tlItem'
    };
  }

  function TimelineItemDirectiveController($scope, authService, backendUrlService, coyoEndpoints,
                                           reportService, timelineEditModalService, $translate, socketService) {
    var vm = this,
        TRANSLATION_POST_AS = $translate.instant('MODULE.TIMELINE.FORM.LIKE_COMMENT_AS');

    vm.backendUrl = backendUrlService.getUrl();
    vm.preview = coyoEndpoints.timeline.preview;
    vm.tplPrefix = 'app/modules/timeline/components/timeline-item/types/';
    vm.showOriginalAuthor = false;
    vm.originalAuthor = null;
    vm.hasShares = false;

    vm.edit = edit;
    vm.report = _.partial(reportService.report, vm.ngModel.id, vm.ngModel.typeName);
    vm.remove = remove;
    vm.markAsRead = markAsRead;
    vm.toggleOriginalAuthor = toggleOriginalAuthor;
    vm.getTooltip = getTooltip;
    vm.selectSenderOptionGroups = selectSenderOptionGroups;
    vm.$onInit = init;

    function remove() {
      vm.ngModel.remove();
    }

    function edit() {
      timelineEditModalService.open(vm.ngModel).then(function (updatedItem) {
        angular.extend(vm.ngModel, updatedItem);
      });
    }

    function markAsRead() {
      vm.loadingMarkAsRead = true;
      vm.ngModel.markAsRead().then(function (item) {
        vm.ngModel.unread = item.unread;
      }).finally(function () {
        vm.loadingMarkAsRead = false;
      });
    }

    function toggleOriginalAuthor() {
      if (!vm.originalAuthor) {
        vm.ngModel.getOriginalAuthor().then(function (originalAuthor) {
          vm.originalAuthor = originalAuthor;
          vm.showOriginalAuthor = !vm.showOriginalAuthor;
        });
      } else {
        vm.showOriginalAuthor = !vm.showOriginalAuthor;
      }
    }

    function getTooltip(recipient) {
      return $translate.instant('MODULE.TIMELINE.TOOLTIP.' + recipient.typeName.toUpperCase(),
          {displayName: recipient.displayName}, null, null, null);
    }

    function onUpdate(event) {
      $scope.$apply(function () {
        vm.ngModel.data = event.content.data;
        vm.ngModel.modified = event.content.modified;
        $scope.$broadcast('timeline-item:refresh');
      });
    }

    function selectSenderOptionGroups() {
      return TRANSLATION_POST_AS;
    }

    function init() {
      authService.getUser().then(function (user) {
        vm.currentUser = user;
        vm.author = angular.copy(user);
        vm.staticSenderOptions = [user];
      });

      // calculate share information for header display
      $scope.$watch(function () {
        return vm.ngModel.shares;
      }, function (newVal) {
        vm.hasShares = (newVal !== null) && (newVal.length > 0);
        vm.publicShare = _.includes(_.map(newVal, function (s) {
          return s.recipient !== null ? s.recipient.public : false;
        }), true);
        vm.share = _.chain(newVal).filter(function (share) {
          return share.recipient && (_.includes(vm.contextSenders, share.recipient.id) || vm.contextSenders === null);
        }).orderBy(['created'], ['desc']).head().value();
      });

      // calculate recipients for header display
      $scope.$watch(function () {
        return vm.ngModel.recipients;
      }, function (newVal) {
        var authorId = vm.ngModel.author && vm.ngModel.author.id;
        vm.recipients = _.chain(newVal)
            .reject({id: authorId})
            .slice(0, 3).value();
      });

      // watch global permissions
      authService.onGlobalPermissions('CREATE_REPORTS', function (canCreateReports) {
        vm.canCreateReports = canCreateReports;
        $scope.$broadcast('timeline-item:refresh');
      });
      authService.onGlobalPermissions('DELETE_TIMELINE_ITEM', function (canDeletePosts) {
        vm.canDeletePost = canDeletePosts && vm.ngModel._permissions.delete;
        $scope.$broadcast('timeline-item:refresh');
      });
      authService.onGlobalPermissions('ACT_AS_SENDER', function (canActAsSender) {
        vm.selectSenderDisplayed = canActAsSender;
        $scope.$broadcast('timeline-item:refresh');
      });

      var unsubscribeUpdateFn = socketService.subscribe('/topic/timeline.item.' + vm.ngModel.id, onUpdate, 'updated');
      $scope.$on('$destroy', unsubscribeUpdateFn);
    }
  }

})(angular);
