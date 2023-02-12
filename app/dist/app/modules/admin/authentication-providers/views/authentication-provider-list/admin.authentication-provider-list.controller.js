(function (angular) {
  'use strict';

  angular.module('coyo.admin.authenticationProviders')
      .controller('AdminAuthenticationProviderListController', AdminAuthenticationProviderListController);

  function AdminAuthenticationProviderListController($rootScope, $scope, AuthenticationProviderModel, modalService, $sessionStorage, authenticationProviderTypeRegistry, $translate, filterFilter) {
    var vm = this;
    var authenticationProviders = [];
    var internalAuthenticationProviderName = $translate.instant('ADMIN.AUTHENTICATION.INTERNAL.INSTANCE.NAME');

    vm.authenticationProviders = null;
    vm.internalAuthenticationProvider = {
      id: 'INTERNAL',
      name: internalAuthenticationProviderName,
      displayName: internalAuthenticationProviderName,
      type: 'internal',
      active: true
    };
    vm.isMobile = $rootScope.screenSize.isXs || $rootScope.screenSize.isSm;
    vm.actions = _buildActions();

    vm.onChangeName = onChangeName;
    vm.getTypeName = getTypeName;
    vm.treeOptions = _buildOptions();

    function _buildOptions() {
      var cellWidths;
      return {
        dropped: function (event) {
          // persist new sort order
          if (event.source.index !== event.dest.index) {
            var withoutInternal = _.filter(vm.authenticationProviders, function (elem) {
              return elem.id !== 'INTERNAL';
            });

            AuthenticationProviderModel.order(_.map(withoutInternal, 'id'));
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
        },
        accept: function (source, dest, destIndex) {
          return destIndex !== 0;
        }
      };
    }

    function onChangeName(term) {
      vm.queryParams = $sessionStorage.authenticationProviderList = {name: term};
      vm.isFiltered = !!term;
      vm.authenticationProviders = term ? filterFilter(authenticationProviders, $sessionStorage.authenticationProviderList) : authenticationProviders;
    }

    function getTypeName(key) {
      return key === vm.internalAuthenticationProvider.type
        ? 'ADMIN.AUTHENTICATION.INTERNAL.NAME'
        : authenticationProviderTypeRegistry.get(key).name;
    }

    function _buildActions() {
      return {
        activate: function (authenticationProvider) {
          vm.userAction = true;
          authenticationProvider.activate().then(function () {
            authenticationProvider.active = true;
          }).finally(function () {
            vm.userAction = false;
          });
        },
        deactivate: function (authenticationProvider) {
          vm.userAction = true;
          authenticationProvider.deactivate().then(function () {
            authenticationProvider.active = false;
          }).finally(function () {
            vm.userAction = false;
          });
        },
        deleteAuthenticationProvider: function (authenticationProvider) {
          modalService.confirm({
            title: 'ADMIN.AUTHENTICATION.OPTIONS.DELETE.MODAL.TITLE',
            text: 'ADMIN.AUTHENTICATION.OPTIONS.DELETE.MODAL.TEXT',
            close: {title: 'YES'},
            dismiss: {title: 'NO'}
          }).result.then(function () {
            vm.userAction = true;
            authenticationProvider.delete().then(function () {
              _.remove(vm.authenticationProviders, {id: authenticationProvider.id});
            }).finally(function () {
              vm.userAction = false;
            });
          });
        }
      };
    }

    (function _init() {
      var unsubscribe = $rootScope.$on('screenSize:changed', function (event, screenSize) {
        vm.isMobile = screenSize.isXs || screenSize.isSm;
      });
      $scope.$on('$destroy', unsubscribe);

      vm.loading = true;
      vm.queryParams = angular.extend({name: ''}, $sessionStorage.authenticationProviderList);
      return AuthenticationProviderModel.query().then(function (result) {
        authenticationProviders = result;
        authenticationProviders.unshift(vm.internalAuthenticationProvider);
        onChangeName(vm.queryParams.name);
      }).finally(function () {
        vm.loading = false;
      });
    })();

  }
})(angular);
