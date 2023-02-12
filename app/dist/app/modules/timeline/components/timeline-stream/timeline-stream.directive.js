(function (angular) {
  'use strict';

  angular
      .module('coyo.timeline')
      .directive('coyoTimelineStream', timelineStream)
      .controller('TimelineStreamDirectiveController', TimelineStreamDirectiveController);

  /**
   * @ngdoc directive
   * @name coyo.timeline.coyoTimelineStream:coyoTimelineStream
   * @restrict 'E'
   * @element OWN
   *
   * @description
   * Creates a stream of timeline items (i.e. posts).
   *
   * @param {string} type The type of stream to render
   * @param {string} contextId The ID of the sender from whose perspective the stream should be rendered (the context)
   */
  function timelineStream() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/modules/timeline/components/timeline-stream/timeline-stream.html',
      scope: {},
      bindToController: {
        type: '@',
        contextId: '@',
        canPost: '<'
      },
      controller: 'TimelineStreamDirectiveController',
      controllerAs: '$ctrl'
    };
  }

  function TimelineStreamDirectiveController($scope, $filter, TimelineItemModel, Pageable, socketService, authService, modalService, subscriptionsService, errorService) {
    var vm = this;

    var pageSize = 8;
    var pageOffset = 0;
    var currentUser;
    var currentPage;
    var newItemIds = [];
    var lastRefreshDate;

    vm.loadMore = loadMore;
    vm.loadNew = loadNew;
    vm.openFormModal = openFormModal;

    var permission = _isPersonal() ? 'ACCESS_PERSONAL_TIMELINE' : 'ACCESS_SENDER_TIMELINE';
    authService.onGlobalPermissions(permission, _init);
    $scope.$on('$destroy', function () {
      _unsubscribeItemsCreated();
      _unsubscribeItemsDeleted();
      _unsubscribeItemsShared();
    });

    // --------------------------------------------------------------------------------------------------------

    function loadMore() {
      if (vm.loading) {
        return;
      }

      if (!currentPage || !currentPage.last) {
        vm.loading = true;

        var offset = (currentPage ? currentPage.offset + pageSize : 0) + pageOffset;
        var pageable = new Pageable(null, pageSize, null, offset);
        var params = {type: vm.type, contextId: vm.contextId};
        TimelineItemModel.pagedQueryWithPermissions(pageable, params, {}, ['manage', 'delete', 'accessoriginalauthor', 'like', 'comment', 'share'])
            .then(function (page) {
              currentPage = page;
              currentPage.offset = offset;
              pageOffset = 0;
              vm.items = _setNew(_.concat(vm.items, page.content));
              vm.itemsLast = page.last;
              _.forEach(page.content, _subscribeItemDeleted);
            }).finally(function () {
              vm.loading = false;
            });
      }
    }

    function loadNew() {
      if (vm.loadingNew) {
        return;
      }
      vm.loadingNew = true;

      var pageable = new Pageable(0, pageSize);
      var params = {type: vm.type, contextId: vm.contextId};
      TimelineItemModel.pagedQueryWithPermissions(
          pageable, params, {}, ['manage', 'delete', 'accessoriginalauthor', 'like', 'comment', 'share'], 'new', 'page'
      ).then(function (richPage) {
        newItemIds = [];
        vm.newItemsCount = 0;

        if (!angular.isNumber(lastRefreshDate)) {
          lastRefreshDate = richPage.data.lastRefreshDate;
        }

        var page = richPage.page;
        if (page.last) {
          var removed = _.remove(vm.items, function (item) {
            return _.some(page.content, {id: item.id});
          });
          _.forEach(removed, function (item) {
            _unsubscribeItemDeleted(item.id);
          });

          pageOffset += page.numberOfElements;
          vm.items = _orderItems(_.concat(_setNew(page.content), vm.items));
        } else {
          currentPage = page;
          currentPage.offset = 0;
          pageOffset = 0;
          vm.items = _setNew(page.content);
          vm.itemsLast = page.last;
        }

        _.forEach(page.content, _subscribeItemDeleted);
      }).finally(function () {
        vm.loadingNew = false;
      });
    }

    function openFormModal() {
      modalService.open({
        templateUrl: 'app/modules/timeline/components/timeline-form/timeline-form-modal-wrapper.html',
        controller: /*@ngInject*/ function (contextId, timelineType) {
          var vm = this;
          vm.contextId = contextId;
          vm.timelineType = timelineType;
        },
        resolve: {
          contextId: function () {
            return vm.contextId;
          },
          timelineType: function () {
            return vm.type;
          }
        }
      });
    }

    // --------------------------------------------------------------------------------------------------------

    function _isPersonal() {
      return vm.type === 'personal';
    }

    function _getSortDate(item) {
      return _.chain(item.shares).filter(function (share) {
        return share.recipient && _.includes(vm.contextSenders, share.recipient.id);
      }).map('created').max().value() || item.created;
    }

    function _orderItems(items) {
      return $filter('orderBy')(items, ['-unread', function (item) {
        return -1 * _getSortDate(item);
      }]);
    }

    function _isNew(item) {
      return angular.isNumber(lastRefreshDate) && lastRefreshDate < _getSortDate(item);
    }

    function _setNew(items) {
      return _.map(items, function (item) {
        item.isNew = _isNew(item);
        return item;
      });
    }

    var unsubscribeItemsCreatedFn;
    function _subscribeItemsCreated() {
      var route = '/topic/timeline.' + vm.type + '.' + vm.contextId + '.item.created';
      unsubscribeItemsCreatedFn = socketService.subscribe(route, function (event) {
        _addItem(event.content);
      });
    }

    var unsubscribeItemsSharedFn;
    function _subscribeItemsShared() {
      var route = '/topic/timeline.' + vm.type + '.' + vm.contextId + '.item.shared';
      unsubscribeItemsSharedFn = socketService.subscribe(route, function (event) {
        if (_isPersonal()) {
          if (!_.includes(vm.contextSenders, event.content.recipient)) {
            var existing = _.findIndex(vm.items, {id: event.content.id});
            if (existing !== -1) {
              TimelineItemModel.get(event.content.id).then(function (item) {
                item.isNew = false;
                vm.items[existing] = item;
              });
            }
          } else {
            _addItem(event.content);
          }
        } else if (event.content.recipient === vm.contextId || _.some(vm.items, {id: event.content.id})) {
          _addItem(event.content);
        }
      });
    }

    var unsubscribeItemDeletedFns = {};
    function _subscribeItemDeleted(item) {
      var route = '/topic/timeline.item.' + item.id;
      unsubscribeItemDeletedFns[item.id] = socketService.subscribe(route, function (event) {
        $scope.$apply(function () {
          _removeItem(event.content);
        });
      }, 'deleted');
    }

    function _unsubscribeItemsCreated() {
      if (angular.isFunction(unsubscribeItemsCreatedFn)) {
        unsubscribeItemsCreatedFn();
        unsubscribeItemsCreatedFn = undefined;
      }
    }

    function _unsubscribeItemsShared() {
      if (angular.isFunction(unsubscribeItemsSharedFn)) {
        unsubscribeItemsSharedFn();
        unsubscribeItemsSharedFn = undefined;
      }
    }

    function _unsubscribeItemDeleted(itemId) {
      var unsubscribe = unsubscribeItemDeletedFns[itemId];
      if (angular.isFunction(unsubscribe)) {
        unsubscribe();
        delete unsubscribeItemDeletedFns[itemId];
      }
    }

    function _unsubscribeItemsDeleted() {
      _.forEach(unsubscribeItemDeletedFns, function (unsubscribeFn, itemId) {
        _unsubscribeItemDeleted(itemId);
      });
    }

    function _addItem(item) {
      if (!_isPersonal()) {
        // show new posts directly on sender timelines
        TimelineItemModel.getWithPermissions(item.id, {}, ['manage', 'delete', 'accessoriginalauthor', 'like', 'comment', 'share'])
            .then(function (newItem) {
              var wasOnTimeline = _.remove(vm.items, {id: newItem.id}).length > 0;
              if (wasOnTimeline) {
                _unsubscribeItemDeleted(newItem.id);
              } else {
                ++pageOffset;
              }
              vm.items.unshift(_.set(newItem, 'isNew', item.recipient === vm.contextId));
              vm.items = _orderItems(vm.items);
              _subscribeItemDeleted(newItem);
            })
            .catch(function (errorResponse) {
              if (_.get(errorResponse, 'data.errorStatus') === 'NOT_FOUND') {
                errorService.suppressNotification(errorResponse);
              }
            });
      } else if (currentUser.id === _.get(item, 'authorId')) {
        // show new posts directly on personal timeline if current user is author
        loadNew();
      } else if (!_.includes(newItemIds, item.id)) {
        $scope.$apply(function () {
          newItemIds.push(item.id);
          ++vm.newItemsCount;
          _subscribeItemDeleted(item);
        });
      }
    }

    function _removeItem(itemId) {
      _unsubscribeItemDeleted(itemId);

      // update new button
      vm.newItemsCount -= _.remove(newItemIds, {id: itemId}).length;

      // remove post from list
      _.remove(vm.items, {id: itemId});
      --pageOffset;
    }

    function _loadContext(user) {
      if (_isPersonal()) {
        subscriptionsService.getSubscriptionsByType(user.id, ['user', 'workspace', 'page'])
            .then(function (subscriptions) {
              vm.contextSenders = _.concat(_.map(subscriptions, 'targetId'), user.id);
            });
      } else {
        vm.contextSenders = [vm.contextId];
      }
    }

    function _defineCanPost(user) {
      if (_.isNil(vm.canPost)) {
        vm.canPost = user.hasGlobalPermissions('CREATE_TIMELINE_ITEM');
      }
    }

    function _init(canAccess) {
      vm.visible = canAccess;
      _unsubscribeItemsCreated();
      _unsubscribeItemsDeleted();

      if (canAccess) {
        authService.getUser().then(function (user) {
          currentUser = user;
          _loadContext(user);
          _defineCanPost(user);
          _subscribeItemsCreated();
          _subscribeItemsShared();
        });

        pageOffset = 0;
        currentPage = undefined;

        vm.items = [];
        vm.itemsLast = false;
        vm.newItemsCount = 0;

        if (_isPersonal()) {
          var params = {type: vm.type};
          TimelineItemModel.get('new/count', params).then(function (cnt) {
            vm.newItemsCount = cnt;
          });
        }

        loadMore();
      }
    }
  }

})(angular);
