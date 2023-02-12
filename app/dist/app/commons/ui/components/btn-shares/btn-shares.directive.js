(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoBtnShares', btnShares)
      .controller('BtnSharesController', BtnSharesController);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoBtnShares:coyoBtnShares
   * @scope
   * @restrict 'E'
   * @element OWN
   *
   * @description
   * Renders a share button from the perspective of the current user.
   *
   * @requires $log
   * @requires authService
   * @requires modalService
   *
   * @param {object} target The shares target.
   * @param {object[]} target.shares The shares of the target.
   */
  function btnShares() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/commons/ui/components/btn-shares/btn-shares.html',
      scope: {},
      bindToController: {
        target: '='
      },
      controller: 'BtnSharesController',
      controllerAs: '$ctrl'
    };
  }

  function BtnSharesController(authService, modalService, coyoNotification, shareService, $scope) {
    var vm = this;
    vm.count = _.get(vm.target, 'shares.length', 0);
    vm.share = share;
    vm.show = show;

    function share() {
      if (vm.isLoading) {
        return;
      }

      vm.isLoading = true;
      var parentIsPublic = vm.target.parentPublic;

      shareService.share(vm.currentUser.id, vm.target.id, vm.target.typeName, parentIsPublic).then(function (share) {
        coyoNotification.success('COMMONS.SHARES.SUCCESS');
        vm.count++;
        if (!vm.target.shares) {
          vm.target.shares = [share];
        } else {
          vm.target.shares.push(share);
        }
      }).finally(function () {
        vm.isLoading = false;
      });
    }

    function show() {
      if (vm.isLoading || vm.count === 0) {
        return;
      }

      modalService.open({
        templateUrl: 'app/commons/ui/components/btn-shares/btn-shares.modal.html',
        resolve: {
          target: function () {
            return vm.target;
          },
          shares: function () {
            return vm.target.getShares();
          }
        },
        controller: /*@ngInject*/ function (target, shares) {
          var vm = this;
          vm.target = target;
          vm.shares = shares;
        }
      });
    }

    $scope.$watch('$ctrl.target', function (oldVal, newVal) {
      if (oldVal !== newVal) {
        vm.count = _.get(vm.target, 'shares.length', 0);
      }
    });

    (function _init() {
      vm.isLoading = true;
      authService.getUser().then(function (user) {
        vm.currentUser = user;
      }).finally(function () {
        vm.isLoading = false;
      });
    })();
  }

})(angular);
