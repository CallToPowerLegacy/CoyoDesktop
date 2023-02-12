(function (angular) {
  'use strict';

  angular
      .module('coyo.events')
      .controller('EventsCreateController', EventsCreateController);

  function EventsCreateController($q, $state, EventModel, coyoNotification, moment, currentUser, host) {
    var vm = this;

    vm.sender = host;

    vm.changeStart = changeStart;
    vm.changeEnd = changeEnd;
    vm.back = back;
    vm.next = next;
    vm.cancel = cancel;

    function changeStart() {
      var start = vm.event.startDate ? moment(vm.event.startDate) : null;
      var end = vm.event.endDate ? moment(vm.event.endDate) : null;

      if (vm.event.fullDay) {
        start.hour(12).minute(0).seconds(0);
        end.hour(12).minute(0).seconds(0);
      }

      checkDateValidity();
    }

    function changeEnd() {
      var start = vm.event.startDate ? moment(vm.event.startDate) : null;
      var end = vm.event.endDate ? moment(vm.event.endDate) : null;

      if (vm.event.fullDay) {
        start.hour(12).minute(0).seconds(0);
        end.hour(12).minute(0).seconds(0);
      }

      checkDateValidity();
    }

    function isValidDate() {
      var start = vm.event.startDate ? moment(vm.event.startDate) : undefined;
      var end = vm.event.endDate ? moment(vm.event.endDate) : undefined;

      return (_.isUndefined(start) || _.isUndefined(end)) ? true : start.isBefore(end) && end.isAfter(start);
    }

    function checkDateValidity() {
      if (vm.eventsForm2.eventEnd) {
        vm.eventsForm2.eventEnd.$setValidity('endDateNotAfterStartDate', isValidDate());
      }
    }

    function back() {
      vm.wizard.active = Math.max(0, vm.wizard.active - 1);
    }

    function next(form) {
      if (form && form.$valid) {
        if (vm.wizard.active < vm.wizard.states.length - 1) {
          return $q.resolve(vm.wizard.active++);
        } else {
          vm.event.senderId = vm.sender ? vm.sender.id : currentUser.id;
          vm.event.startDate = moment(vm.event.startDate).format('YYYY-MM-DDTHH:mm:ss');
          vm.event.endDate = moment(vm.event.endDate).format('YYYY-MM-DDTHH:mm:ss');

          return vm.event.create().then(function (response) {
            $state.go('main.event.show', {idOrSlug: response.event.slug});
            coyoNotification.success('MODULE.EVENTS.CREATE.SUCCESS');
          });
        }
      }
      return $q.reject();
    }

    function cancel() {
      var state = _.get($state, 'previous.name', 'main.event');
      var params = _.get($state, 'previous.params', {});
      $state.go(state, params);
    }

    (function _init() {
      vm.wizard = {
        states: [
          'MODULE.EVENTS.CREATE.GENERAL',
          'MODULE.EVENTS.CREATE.TIME',
          'MODULE.EVENTS.CREATE.HOST',
          'MODULE.EVENTS.CREATE.PARTICIPANTS'],
        active: 0
      };

      var startDate = moment().add(1, 'hour').startOf('hour');
      var endDate = startDate.clone().add(1, 'hour');
      vm.event = new EventModel({
        startDate: startDate.toDate(),
        endDate: endDate.toDate(),
        adminIds: [currentUser.id],
        memberIds: [],
        adminGroupIds: [],
        memberGroupIds: []
      });
    })();
  }

})(angular);
