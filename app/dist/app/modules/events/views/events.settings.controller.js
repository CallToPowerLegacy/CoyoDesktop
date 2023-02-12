(function (angular) {
  'use strict';

  angular
      .module('coyo.events')
      .controller('EventsSettingsController', EventsSettingsController);

  function EventsSettingsController($state, event, currentUser, moment, EventModel, coyoNotification) {
    var vm = this;

    vm.currentUser = currentUser;

    vm.changeStart = changeStart;
    vm.changeEnd = changeEnd;
    vm.saveEvent = saveEvent;
    vm.deleteEvent = deleteEvent;

    function changeStart() {
      var start = vm.event.startDate ? moment(vm.event.startDate) : null;
      var end = vm.event.endDate ? moment(vm.event.endDate) : null;
      if (start && start.isAfter(end)) {
        vm.event.endDate = null;
      }
    }

    function changeEnd() {
      var start = vm.event.startDate ? moment(vm.event.startDate) : null;
      var end = vm.event.endDate ? moment(vm.event.endDate) : null;
      if (end && end.isBefore(start)) {
        vm.event.startDate = null;
      }
    }

    function saveEvent() {
      vm.event.startDate = moment(vm.event.startDate).format('YYYY-MM-DDTHH:mm:ss');
      vm.event.endDate = moment(vm.event.endDate).format('YYYY-MM-DDTHH:mm:ss');
      return vm.event.updateEvent().then(function () {
        coyoNotification.success('MODULE.EVENTS.EDIT.SUCCESS');
        $state.go('main.event.show.timeline', {idOrSlug: vm.event.slug}, {reload: true});
      });
    }

    function deleteEvent() {
      event.deleteEvent().then(function () {
        $state.go('main.event');
      });
    }

    (function _init() {
      vm.baseUrl = $state.href('main.event', {}) + '/';
      vm.oldSlug = event.slug;

      vm.event = new EventModel(event);
      vm.event.startDate = moment(event.startDate).toDate();
      vm.event.endDate = moment(event.endDate).toDate();
    })();
  }

})(angular);
