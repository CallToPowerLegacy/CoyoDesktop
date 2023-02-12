(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoSenderAvatar', senderAvatar);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoSenderAvatar:coyoSenderAvatar
   * @scope
   * @restrict 'E'
   * @element OWN
   *
   * @description
   * Renders the avatar of given sender. Delegates rendering to specific sub-directives.
   *
   * @param {object} sender
   * The sender to display the avatar for
   *
   * @param {boolean=} noLink
   * Can be set to 'true' if the avatar image should not link to the sender's detail page (default: 'false').
   *
   * @param {string=} avatarSize
   * Desired size of the avatar. Possible values are xs, sm, md, lg and xl. Default: md;
   *
   * @requires $compile
   */
  function senderAvatar($compile) {
    return {
      scope: {
        sender: '<',
        noLink: '<?',
        avatarSize: '@?'
      },
      replace: true,
      template: '<span></span>',
      link: function (scope, element) {
        var unregisterWatch;
        unregisterWatch = scope.$watch(function () {
          return scope.sender.id;
        }, function () {
          var typeName = scope.sender.typeName;
          var childDirective = angular.element('<coyo-' + typeName + '-avatar ' + typeName + '="::sender" ></coyo-' + typeName + '-avatar>');

          if (scope.noLink) {
            childDirective.attr('no-link', scope.noLink);
          }

          if (scope.avatarSize) {
            childDirective.attr('avatar-size', scope.avatarSize);
          }

          element.html(childDirective).show();
          $compile(element.contents())(scope);
        });

        scope.$on('$destroy', unregisterWatch);
      }
    };
  }

})(angular);
