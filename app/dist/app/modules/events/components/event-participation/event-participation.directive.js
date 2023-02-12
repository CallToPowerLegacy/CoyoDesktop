(function (angular) {
  'use strict';

  angular
      .module('coyo.events')
      .directive('coyoEventParticipation', EventParticipation)
      .controller('EventParticipationController', EventParticipationController);

  /**
   * @ngdoc directive
   * @name coyo.events.coyoEventParticipation:coyoEventParticipation
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Renders component where the current participation status for an event is shown and can be selected via a
   * drop-down-box.
   *
   * @param {object} event
   * The event to show/set the participation status for.
   *
   * @param {boolean} disableChange
   * Set to 'true' if the participation status is to be shown only without the possibility to change it.
   *
   * @requires $rootScope
   */
  function EventParticipation() {
    return {
      require: 'ngModel',
      restrict: 'E',
      replace: true,
      templateUrl: 'app/modules/events/components/event-participation/event-participation.html',
      scope: {},
      bindToController: {
        event: '<',
        disableChange: '<?'
      },
      controller: 'EventParticipationController',
      controllerAs: '$ctrl'
    };
  }

  function EventParticipationController($rootScope) {
    var vm = this;
    vm.statuses = ['PENDING', 'ATTENDING', 'MAYBE_ATTENDING', 'NOT_ATTENDING'];
    vm.allowedChoices = [];
    vm.onStatusChanged = onStatusChanged;
    vm.isChoiceDisabled = isChoiceDisabled;

    function onStatusChanged() {
      vm.event.setStatus(vm.event.status).then(function () {
        $rootScope.$emit('onMemberStatusChange');
      });
    }

    function isChoiceDisabled(choice) {
      return vm.allowedChoices.indexOf(choice) < 0;
    }

    (function _init() {
      vm.allowedChoices = vm.event.requestDefiniteAnswer
        ? ['ATTENDING', 'NOT_ATTENDING'] : ['ATTENDING', 'MAYBE_ATTENDING', 'NOT_ATTENDING'];
    })();
  }

})(angular);
