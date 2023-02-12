(function (angular) {
  'use strict';

  angular
      .module('coyo.timeline')
      .controller('TimelineItemController', TimelineItemController);

  /**
   * Controller for showing a single timeline item.
   */
  function TimelineItemController($state, $scope, socketService, coyoNotification, item) {
    var vm = this;
    vm.item = item;

    // subscribe to socket events
    var unsubscribeFn = socketService.subscribe('/topic/timeline.item.' + item.id, onRemove, 'deleted');
    $scope.$on('$destroy', unsubscribeFn);

    function onRemove() {
      coyoNotification.warning('MODULE.TIMELINE.ITEM.DELETED');
      $state.go('main');
    }
  }

})(angular);
