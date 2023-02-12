(function (angular) {
  'use strict';

  /**
   * @ngdoc directive
   * @name coyo.events.coyoEventAvatar:coyoEventAvatar
   * @restrict 'E'
   * @element OWN
   *
   * @description
   * Displays an event avatar.
   *
   * @param {object} event
   * The event to render the avatar for.
   *
   * @param {boolean=} noLink
   * Can be set to 'true' if the avatar image should not link to the event itself (default: 'false').
   *
   * @param {string=} avatarSize
   * Desired size of the avatar. Possible values are xs, sm, md, lg and xl.
   *
   * @param {boolean=} showOverlay
   * Whether to show the date overlay on the avatar.
   *
   * @requires $scope
   * @requires $state
   * @requires commons.target.targetService
   */
  angular
      .module('coyo.events')
      .directive('coyoEventAvatar', eventAvatar)
      .controller('EventAvatarController', EventAvatarController);

  function eventAvatar() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/modules/events/components/event-avatar/event-avatar.html',
      scope: {},
      bindToController: {
        event: '<',
        noLink: '<?',
        avatarSize: '@?',
        showOverlay: '<?'
      },
      controller: 'EventAvatarController',
      controllerAs: '$ctrl'
    };
  }

  function EventAvatarController($scope, $state, targetService) {
    var vm = this;
    var canLinkToEvent = false;

    vm.open = open;
    vm.errorHandler = errorHandler;

    function open(event) {
      if (vm.isLink) {
        event.stopPropagation();
        $state.go('main.event.show', {idOrSlug: vm.event.slug}, {inherit: false, reload: 'main.event.show'});
      }
    }

    function errorHandler() {
      vm.loadError = true;
    }

    (function _init() {
      // check whether user has permission to link to event
      targetService.onCanLinkTo(vm.event.target, function (canLink) {
        canLinkToEvent = canLink;
        vm.isLink = !vm.noLink && canLinkToEvent;
      });

      // check whether no link parameter is set or changed
      $scope.$watch(function () {
        return vm.noLink;
      }, function (newValue, oldValue) {
        if (newValue !== oldValue) {
          vm.isLink = !newValue && canLinkToEvent;
        }
      });
    })();
  }

})(angular);
