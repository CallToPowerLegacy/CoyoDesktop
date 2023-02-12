(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoBtnLikes', btnLikes)
      .controller('BtnLikeController', BtnLikeController)
      .controller('BtnLikeModalController', BtnLikeModalController);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoBtnLikes:coyoBtnLikes
   * @scope
   * @restrict 'E'
   * @element OWN
   *
   * @description
   * Renders a like button from the perspective of the current user. The button is rendered in a condensed style if the
   * directive defines a condensed attribute.
   *
   * @requires $scope
   * @requires $log
   * @requires authService
   * @requires LikeModel
   * @requires modalService
   *
   * @param {object} target The like target.
   * @param {string} target.id The ID of the target.
   * @param {string} target.typeName The type of the target.
   * @param {string} [init] Initial like data.
   * @param {string} authorId Optional author id, e.g. selected in timeline item.
   */
  function btnLikes() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: function (elem, attrs) {
        var isCondensed = angular.isDefined(attrs.condensed);
        return 'app/commons/ui/components/btn-likes/btn-likes' + (isCondensed ? '.condensed.html' : '.html');
      },
      scope: {},
      bindToController: {
        target: '<',
        init: '<',
        authorId: '<?'
      },
      controller: 'BtnLikeController',
      controllerAs: '$ctrl'
    };
  }

  function BtnLikeController($scope, $log, authService, modalService, LikeModel, likesService) {
    var vm = this;

    vm.tooltipUrl = 'app/commons/ui/components/btn-likes/btn-likes.tooltip.html';
    vm.tooltipUrlCondensed = 'app/commons/ui/components/btn-likes/btn-likes.tooltip.condensed.html';

    vm.$onInit = init;
    vm.like = like;
    vm.show = show;

    function init() {
      authService.onGlobalPermissions('LIKE', _initWithPermission);
    }

    function like() {
      if (_isCurrentlyLoading()) {
        return; // currently loading
      }

      vm.isLoading = true;
      var request = vm.likeData.self
        ? LikeModel.unlike(vm.target.id, vm.target.typeName, vm.authorId)
        : LikeModel.like(vm.target.id, vm.target.typeName, vm.authorId);
      request.then(_set).finally(function () {
        vm.isLoading = false;
        $scope.$broadcast('like:refresh');
      });
    }

    function show() {
      if (_isCurrentlyLoading()) {
        return; // currently loading
      }

      modalService.open({
        templateUrl: 'app/commons/ui/components/btn-likes/btn-likes.modal.html',
        controller: 'BtnLikeModalController',
        resolve: {
          target: function () {
            return vm.target;
          }
        }
      });
    }

    function _isCurrentlyLoading() {
      return vm.isLoading || !vm.currentUser || !vm.likeData;
    }

    function _set(likeInfo) {
      vm.likeData = {
        self: likeInfo.likedBySender,
        total: likeInfo.latest,
        totalCount: likeInfo.count,
        others: _.reject(likeInfo.latest, {id: vm.authorId}),
        othersCount: likeInfo.count - likeInfo.likedBySender
      };
    }

    function _initWithPermission(permission, currentUser) {
      vm.visible = permission;
      vm.currentUser = currentUser;
      if (angular.isUndefined(vm.authorId)) {
        vm.authorId = currentUser.id;
      }

      // load like info
      if (vm.init) {
        _set(vm.init);
      } else {
        loadLikes();
      }

      $scope.$watch(function () {
        return vm.authorId;
      }, function (newValue, oldValue) {
        if (newValue !== oldValue) {
          loadLikes();
        }
      });
    }

    function loadLikes() {
      vm.isLoading = true;
      likesService.getLikes(vm.target.id, vm.target.typeName, vm.authorId)
          .then(_set)
          .catch(function () {
            $log.error('[Likes] Could not load likes for target with id [' + vm.target.id + ']');
          })
          .finally(function () {
            vm.isLoading = false;
            $scope.$broadcast('like:refresh');
          });
    }
  }

  function BtnLikeModalController(LikeModel, Pageable, target) {
    var vm = this;

    vm.target = target;
    vm.likes = [];

    vm.$onInit = init;
    vm.loadMore = loadMore;

    function init() {
      loadMore();
    }

    function loadMore() {
      if (!vm.currentPage || !vm.currentPage.last) {
        vm.loading = true;

        var pageable = new Pageable((vm.currentPage ? vm.currentPage.number + 1 : 0), 20, 'created,desc');
        LikeModel.pagedQuery(pageable, {}, {
          targetId: vm.target.id,
          targetType: vm.target.typeName
        }).then(function (page) {
          vm.currentPage = page;
          vm.likes = vm.likes.concat(page.content);
        }).finally(function () {
          vm.loading = false;
        });
      }
    }
  }

})(angular);
