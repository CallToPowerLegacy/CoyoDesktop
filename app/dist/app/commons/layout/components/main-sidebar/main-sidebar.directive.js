(function (angular) {
  'use strict';

  angular
      .module('commons.layout')
      .directive('oyocMainSidebar', mainSidebar)
      .controller('MainSidebarController', MainSidebarController);

  /**
   * @ngdoc directive
   * @name commons.layout.oyocMainSidebar:oyocMainSidebar
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description
   * Displays the sidebar navigation menu (only on mobile devices). The sidebar is registered to the sidebarService by
   * registering with its API.
   *
   * @requires $rootScope
   * @requires $localStorage
   * @requires $state
   * @requires commons.resource.Pageable
   * @requires coyo.domain.UserSubscriptionModel
   * @requires coyo.domain.UserNotificationSettingModel
   * @requires coyo.admin.adminStates
   * @requires commons.config.coyoConfig
   * @requires commons.auth.authService
   * @requires commons.ui.curtainService
   * @requires commons.ui.sidebarService
   * @requires commons.target.targetService
   * @requires commons.terms.termsService
   * @requires commons.tour.tourService
   * @requires commons.ui.userGuideService
   */
  function mainSidebar() {
    return {
      restrict: 'E',
      templateUrl: 'app/commons/layout/components/main-sidebar/main-sidebar.html',
      replace: true,
      scope: {},
      bindToController: {
        landingPages: '<'
      },
      controller: 'MainSidebarController',
      controllerAs: '$ctrl'
    };
  }

  function MainSidebarController($rootScope, $localStorage, $state, Pageable, UserSubscriptionModel,
                                 UserNotificationSettingModel, adminStates, coyoConfig, authService,
                                 sidebarService, targetService, termsService, tourService, userGuideService,
                                 aboutCoyoService) {
    var vm = this;
    vm.navState = {};
    vm.showSidebar = false;
    vm.allAdminPermissions = _.map(adminStates, 'globalPermission').join(',');

    vm.open = open;
    vm.close = close;
    vm.help = help;
    vm.about = about;
    vm.restartTour = restartTour;
    vm.hasTourSteps = hasTourSteps;
    vm.logout = authService.logout;
    vm.showTerms = termsService.showModal;
    vm.loadMoreSubscriptions = loadMoreSubscriptions;
    vm.openSender = openSender;
    vm.navCollapse = navCollapse;

    // ----------------------------------------------------------------

    function open() {
      vm.showSidebar = true;
      $rootScope.showBackdrop = true;
    }

    function close() {
      vm.showSidebar = false;
      $rootScope.showBackdrop = false;
    }

    function help() {
      close();

      if ($state.current && $state.current.data && $state.current.data.guide) {
        userGuideService.open($state.current.data.guide);
      } else {
        userGuideService.notFound();
      }
    }

    function about() {
      close();
      aboutCoyoService.open();
    }

    function hasTourSteps() {
      return tourService.getTopics().length > 0;
    }

    function restartTour() {
      close();
      tourService.restart('mobile');
    }

    function openSender(sender) {
      targetService.go(sender.target);
    }

    function navCollapse(section) {
      vm.navState[section] = !vm.navState[section];
      $localStorage.navState[section] = !$localStorage.navState[section];
    }

    // -------------------------
    // My Subscriptions
    // -------------------------

    var pageSize = 5;
    vm.mySubscriptions = {
      page: {
        icon: coyoConfig.entityTypes.page.icon,
        items: [],
        loading: false,
        currentPage: null
      },
      workspace: {
        icon: coyoConfig.entityTypes.workspace.icon,
        items: [],
        loading: false,
        currentPage: null
      }
    };

    function loadMoreSubscriptions(type) {
      var data = vm.mySubscriptions[type];
      if (data.loading) {
        return;
      }

      if (!data.currentPage || !data.currentPage.last) {
        data.loading = true;
        var pageable = new Pageable((data.currentPage ? data.currentPage.number + 1 : 0), pageSize, 'displayName.sort');
        UserSubscriptionModel.searchWithFilter(vm.user.id, '', pageable, {type: [type]}, [], {}).then(function (page) {
          data.currentPage = page;
          data.items.push.apply(data.items, page.content);
        }).finally(function () {
          data.loading = false;
        });
      }
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
      // register sidebar
      sidebarService.register({
        name: 'menu',
        open: open,
        close: close,
        isOpen: function () {
          return vm.showSidebar;
        }
      });

      // init navigation states
      if (angular.isUndefined($localStorage.navState)) {
        $localStorage.navState = {main: true};
      }
      vm.navState = angular.copy($localStorage.navState);

      // init user
      authService.getUser().then(function (user) {
        vm.user = user;
        _checkTermsActive();
        _checkNotificationSettings();
        loadMoreSubscriptions('page');
        loadMoreSubscriptions('workspace');
      });
    })();
  }

})(angular);
