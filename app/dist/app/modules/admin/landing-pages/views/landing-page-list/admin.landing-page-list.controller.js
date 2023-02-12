(function (angular) {
  'use strict';

  angular.module('coyo.admin.landingPages')
      .controller('AdminLandingPageListController', AdminLandingPageListController);

  function AdminLandingPageListController($rootScope, $scope, $sessionStorage, $state, LandingPageModel, modalService, filterFilter) {
    var vm = this;
    var landingPages = [];

    vm.landingPages = null;
    vm.baseUrl = $state.href('main.landing-page', {}) + '/';
    vm.isMobile = $rootScope.screenSize.isXs || $rootScope.screenSize.isSm;
    vm.actions = _buildActions();
    vm.treeOptions = _buildOptions();

    vm.onChangeName = onChangeName;

    function onChangeName(term) {
      $sessionStorage.landingPageList = {displayName: term};
      vm.isFiltered = !!term;
      vm.landingPages = term ? filterFilter(landingPages, $sessionStorage.landingPageList) : landingPages;
    }

    // ----------

    function _buildActions() {
      return {
        deletePage: function (page) {
          modalService.confirm({
            title: 'ADMIN.LANDING_PAGES.OPTIONS.DELETE.MODAL.TITLE',
            text: 'ADMIN.LANDING_PAGES.OPTIONS.DELETE.MODAL.TEXT',
            close: {title: 'YES'},
            dismiss: {title: 'NO'}
          }).result.then(function () {
            vm.userAction = true;
            page.delete().then(function () {
              _.remove(landingPages, {id: page.id});
              _.remove(vm.landingPages, {id: page.id});
            }).finally(function () {
              vm.userAction = false;
            });
          });
        }
      };
    }

    function _buildOptions() {
      var cellWidths;
      return {
        dropped: function (event) {
          // persist new sort order
          if (event.source.index !== event.dest.index) {
            LandingPageModel.order(_.map(vm.landingPages, 'id'));
          }
        },
        beforeDrag: function (scope) {
          // save original cell widths
          cellWidths = [];
          scope.$element.children().each(function () {
            cellWidths.push(angular.element(this).width()); // eslint-disable-line angular/controller-as-vm
          });
          return true;
        },
        dragStart: function (event) {
          // set dragging cell widths
          event.elements.dragging.find('td').each(function (i) {
            angular.element(this).width(cellWidths[i]); // eslint-disable-line angular/controller-as-vm
          });
        },
        beforeDrop: function (event) {
          // remove dragging cell widths
          event.elements.dragging.find('td').each(function () {
            angular.element(this).width(''); // eslint-disable-line angular/controller-as-vm
          });
        }
      };
    }

    // ----------

    (function _init() {
      var unsubscribe = $rootScope.$on('screenSize:changed', function (event, screenSize) {
        vm.isMobile = screenSize.isXs || screenSize.isSm;
      });
      $scope.$on('$destroy', unsubscribe);

      vm.loading = true;
      vm.queryParams = angular.extend({displayName: ''}, $sessionStorage.landingPageList);
      return LandingPageModel.query({admin: true}).then(function (result) {
        landingPages = result;
        onChangeName(vm.queryParams.displayName);
      }).finally(function () {
        vm.loading = false;
      });
    })();
  }

})(angular);
