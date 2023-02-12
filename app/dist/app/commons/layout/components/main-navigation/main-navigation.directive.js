(function (angular) {
  'use strict';

  angular
      .module('commons.layout')
      .config(registerToCurtain)
      .directive('oyocMainNavigation', mainNavigation)
      .controller('MainNavigationController', MainNavigationController);

  function registerToCurtain(curtainServiceProvider) {
    curtainServiceProvider.register('mainNavigation');
  }

  /**
   * @ngdoc directive
   * @name commons.layout.oyocMainNavigation:oyocMainNavigation
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Displays the main navigation menu including the search bar.
   *
   * @requires $scope
   * @requires $state
   * @requires commons.ui.sidebarService
   * @requires commons.layout.curtainService
   * @requires commons.auth.authService
   * @requires coyo.admin.adminStates
   * @requires commons.resource.backendUrlService
   * @requires commons.ui.userGuideService
   * @requires commons.terms.termsService
   */
  function mainNavigation() {
    return {
      restrict: 'E',
      scope: {},
      bindToController: {},
      templateUrl: 'app/commons/layout/components/main-navigation/main-navigation.html',
      replace: true,
      controller: 'MainNavigationController',
      controllerAs: '$ctrl'
    };
  }

  function MainNavigationController($scope, $state, sidebarService, curtainService, authService, adminStates,
                                    backendUrlService, userGuideService, tourService, tourSelectionModal, termsService,
                                    UserNotificationSettingModel, aboutCoyoService) {
    var vm = this;

    vm.searchVisible = false;
    vm.accessLandingPages = false;
    vm.allAdminPermissions = _.map(adminStates, 'globalPermission').join(',');
    vm.backendUrl = backendUrlService.getUrl();

    vm.openMenu = openMenu;
    vm.help = help;
    vm.about = about;
    vm.restartTour = restartTour;
    vm.hasTourSteps = hasTourSteps;
    vm.logout = authService.logout;
    vm.showTerms = termsService.showModal;

    // ----------------------------------------------------------------

    function openMenu() {
      sidebarService.open('menu');
    }

    function help() {
      if ($state.current && $state.current.data && $state.current.data.guide) {
        userGuideService.open($state.current.data.guide);
      } else {
        userGuideService.notFound();
      }
    }

    function about() {
      aboutCoyoService.open();
    }

    function restartTour() {
      tourSelectionModal.open(tourService.getTopics());
    }

    function hasTourSteps() {
      return tourService.getTopics().length > 0;
    }

    // ----------------------------------------------------------------

    function _checkNotificationSettings() {
      UserNotificationSettingModel.query({}, {userId: vm.user.id}).then(function (result) {
        vm.hasNotificationSettings = result.length > 0;
      });
    }

    function _checkTermsActive() {
      termsService.termsActive().then(function (active) {
        vm.termsActive = active;
      });
    }

    (function _init() {
      authService.onGlobalPermissions('ACCESS_LANDING_PAGES', function (permission, user) {
        vm.user = user;
        curtainService.loaded('mainNavigation');
        vm.accessLandingPages = permission;
        _checkTermsActive();
        _checkNotificationSettings();
      });
    })();
  }

})(angular);
