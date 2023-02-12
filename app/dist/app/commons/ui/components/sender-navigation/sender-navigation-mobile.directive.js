(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoSenderNavigationMobile', senderNavigationMobile)
      .controller('SenderNavigationMobileController', SenderNavigationMobileController);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoSenderNavigationMobile:coyoSenderNavigationMobile
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Renders the mobile navigation for senders showing the senders' apps and options. If more than three apps are
   * available those apps are shown within a dropdown menu. The dropdown menu shows options for adding and editing
   * apps. Further options can be included via multislot transclusion. Three slots `nav-top`, `nav-middle` and
   * `nav-bottom` are available to place those options.
   *
   * ```
   * <coyo-sender-navigation-mobile sender="workspace" apps="apps" current-app="currentApp">
   *   <nav-middle>
   *     <li>
   *       <a ui-sref="main.workspace.show.members">
   *         <i class="zmdi zmdi-accounts"></i> Members
   *       </a>
   *     </li>
   *   </nav-middle>
   * </coyo-sender-navigation-mobile>
   * ```
   *
   * @param {object} sender
   * The sender to display the navigation for.
   *
   * @param {object[]} apps
   * The apps of the given sender.
   *
   * @param {object} currentApp
   * The currently selected app. This is important to display the correct button for "Edit App".
   *
   * @requires appRegistry
   * @requires senderService
   * @requires appSettingsModalService
   *
   */
  function senderNavigationMobile() {
    return {
      restrict: 'E',
      transclude: {
        top: '?navTop',
        middle: '?navMiddle',
        bottom: '?navBottom'
      },
      templateUrl: 'app/commons/ui/components/sender-navigation/sender-navigation-mobile.html',
      scope: {},
      bindToController: {
        apps: '=',
        sender: '=',
        currentApp: '<'
      },
      controller: 'SenderNavigationMobileController',
      controllerAs: '$ctrl'
    };
  }

  function SenderNavigationMobileController($transclude, appRegistry, appService, appSettingsModalService) {
    var vm = this;

    vm.slotFilled = $transclude.isSlotFilled('middle', 'top', 'bottom');
    vm.getIcon = appRegistry.getIcon;
    vm.addApp = appService.addApp;
    vm.appLength = vm.apps.length;
    vm.apps = _getSortedApps();

    vm.getRootState = getRootState;
    vm.editApp = editApp;

    function getRootState(app) {
      return appRegistry.getRootStateName(app.key, vm.sender.typeName) + '({appIdOrSlug: app.slug })';
    }

    function editApp() {
      if (vm.currentApp) {
        appSettingsModalService.open(vm.currentApp);
      }
    }

    function _getSortedApps() {
      return _.chain(vm.sender.appNavigation)
          .flatMap(function (o) {
            return o.apps ? o.apps : [];
          })
          .map(function (appId) {
            return _.find(vm.apps, {id: appId});
          })
          .filter(angular.isDefined)
          .value();
    }
  }

})(angular);
