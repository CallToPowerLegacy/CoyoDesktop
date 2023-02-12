(function (angular) {
  'use strict';

  angular
      .module('coyo.events')
      .controller('EventsShowController', EventsShowController);

  function EventsShowController($q, $scope, $rootScope, moment, event, senderService, currentUser, Pageable, EventModel,
                                userChooserModalService) {
    var vm = this;

    vm.currentUser = currentUser;
    vm.event = event;
    vm.currentPage;
    vm.hosts = [];

    vm.search = search;
    vm.changeAvatar = changeAvatar;
    vm.isOngoing = isOngoing;
    vm.hasStarted = hasStarted;
    vm.currentUser = currentUser;
    vm.changeCover = senderService.changeCover({title: 'MODULE.EVENTS.MODALS.CHANGE_BG_IMAGE.TITLE'});
    vm.clearParticipationStatus = clearParticipationStatus;
    vm.toggleParticipationStatus = toggleParticipationStatus;
    vm.inviteMembers = inviteMembers;
    vm.removeMember = removeMember;
    vm.getTotalCount = getTotalCount;

    vm.params = angular.extend({
      searchTerm: undefined,
      status: []
    });

    function changeAvatar(sender) {
      senderService.changeAvatar({title: 'MODULE.EVENTS.MODALS.CHANGE_AVATAR.TITLE'})(sender).then(function () {
        $scope.$broadcast('eventAvatar:changed');
      });
    }

    function clearParticipationStatus() {
      vm.params.status = [];
      return _loadMemberships();
    }

    function toggleParticipationStatus(aggregation, key) {
      var idx = vm.params[aggregation].indexOf(key);
      if (idx >= 0) {
        vm.params[aggregation].splice(idx, 1);
      } else {
        vm.params[aggregation].push(key);
      }
      return _loadMemberships();
    }

    function search(term) {
      vm.params.searchTerm = term;
      vm.params.status = [];
      return _loadMemberships();
    }

    function getTotalCount() {
      return _.sumBy(vm.status, 'count');
    }

    function inviteMembers() {
      userChooserModalService.open({}, {}).then(function (selected) {
        event.inviteMembers(selected).then(function () {
          _loadMemberships();
        });
      });
    }

    function removeMember(userId) {
      if (vm.loading) {
        $q.reject();
      }
      vm.loading = true;
      return event.removeMember(userId).then(function () {
        vm.event.memberCount--;
      }).finally(function () {
        vm.loading = false;
        _init();
      });
    }

    function _loadMemberships() {
      if (vm.loading) {
        return $q.reject();
      }
      vm.loading = true;

      var sort = vm.params.searchTerm ? ['_score,DESC', 'displayName'] : 'displayName';
      var pageable = new Pageable(0, 20, sort);
      var filter = _.omit(vm.params, 'searchTerm');
      var searchFields = ['displayName'];
      var aggregations = {status: ''};
      return EventModel.getMembershipsWithFilter(vm.params.searchTerm, pageable, filter, searchFields, aggregations,
          vm.event.slug).then(function (page) {
        vm.currentPage = page;

        // sort departments by:
        //   1. status count descending
        //   2. status name ascending
        if (page.aggregations) {
          vm.status = _.orderBy(page.aggregations.status,
              ['count', 'key'],
              ['desc', 'asc']);
        } else {
          vm.status = [];
        }

        // set active state for every status
        vm.participationStatusFilterAllActive = vm.params.status.length === 0;
        vm.status.forEach(function (status) {
          status.active = vm.params.status.indexOf(status.key) >= 0;
        });
      }).finally(function () {
        vm.loading = false;
      });
    }

    function _loadHosts() {
      event.getHosts().then(function (hosts) {
        vm.hosts = hosts;
      });
    }

    function _init() {
      var handleMembershipStatusChange = $rootScope.$on('onMemberStatusChange', _loadMemberships);
      $scope.$on('$destroy', handleMembershipStatusChange);
      _loadMemberships();
      _loadHosts();
      vm.shouldShowParticipants = _shouldShowParticipants();
      vm.canManage = _canManage();
    }

    _init();

    function isOngoing() {
      var now = moment();
      return now.isSameOrAfter(vm.event.startDate) && now.isBefore(vm.event.endDate);
    }

    function hasStarted() {
      return moment().isSameOrAfter(vm.event.startDate);
    }

    function _shouldShowParticipants() {
      return vm.event.showParticipants || _canManage();
    }

    function _canManage() {
      return vm.event.canManage();
    }
  }

})(angular);
