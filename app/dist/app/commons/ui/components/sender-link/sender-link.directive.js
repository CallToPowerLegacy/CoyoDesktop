(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoSenderLink', senderLink);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoSenderLink:coyoSenderLink
   * @scope
   * @restrict 'A'
   * @element ANY
   *
   * @description
   * Adds a click handler to an element and opens supplied sender when clicked.
   *
   * @requires targetService
   *
   * @param {object} coyoSenderLink The sender
   */
  function senderLink(targetService) {
    return {
      scope: {
        sender: '=coyoSenderLink'
      },
      link: function (scope, element) {
        function clickHandler() {
          targetService.go(scope.sender.target);
        }

        targetService.onCanLinkTo(scope.sender.target, function (canLink) {
          element[canLink ? 'on' : 'off']('click', clickHandler);
          element[canLink ? 'removeClass' : 'addClass']('no-link');
        });
      }
    };
  }

})(angular);
