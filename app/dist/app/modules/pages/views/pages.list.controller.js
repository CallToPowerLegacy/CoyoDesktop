(function (angular) {
  'use strict';

  angular
      .module('coyo.pages')
      .controller('PagesListController', PagesListController);

  function PagesListController($rootScope, $scope, $q, $sessionStorage, $state, $stateParams, $timeout, PageModel,
                               PageCategoryModel, Pageable, currentUser, categories, appService, authService,
                               modalService, subscriptionsService, pagesConfig) {
    var vm = this;

    vm.filterStatus = {
      ALL: 'ALL',
      ADMIN: 'ADMIN',
      SUBSCRIBED: 'SUBSCRIBED'
    };
    vm.currentUser = currentUser;
    vm.treeOptions = _buildTreeOptions();
    vm.categories = categories;
    vm.subscriptions = [];
    vm.subscriptionsLoaded = false;
    vm.languages = {};

    vm.openPage = openPage;
    vm.openApp = openApp;
    vm.isAutoSubscribe = isAutoSubscribe;
    vm.search = search;
    vm.getTotalCount = getTotalCount;
    vm.isCategoryActive = isCategoryActive;
    vm.isCategoryEdited = isCategoryEdited;
    vm.toggleCategory = toggleCategory;
    vm.addCategory = addCategory;
    vm.editCategory = editCategory;
    vm.saveCategory = saveCategory;
    vm.onCategoryKeypress = onCategoryKeypress;
    vm.onCategoryClickOutside = onCategoryClickOutside;
    vm.deleteCategory = deleteCategory;
    vm.setFilterStatus = setFilterStatus;
    vm.isStatus = isStatus;
    vm.getStatusCount = getStatusCount;

    function openPage(page) {
      $state.go('main.page.show', {idOrSlug: page.slug}, {inherit: false});
    }

    function openApp(page, app) {
      appService.redirectToApp(page, app);
    }

    function _loadPages() {
      if (vm.loading) {
        return;
      }
      vm.subscriptionsLoaded = false;

      // write params to URL
      $state.transitionTo('main.page', _.omitBy({
        term: _.get(vm.query, 'term', ''),
        'categories[]': _.get(vm.query, 'filters.categories', [])
      }, _.isEmpty), {notify: false});

      // perform search
      $sessionStorage.pageQuery = vm.query;
      vm.loading = true;

      var term = vm.query.term;
      var sort = term ? ['_score,DESC', 'displayName.sort'] : 'displayName.sort';
      var pageable = new Pageable(0, pagesConfig.paging.pageSize, sort);
      var filters = vm.query.filters;
      var aggregations = {categories: 0};
      PageModel.searchWithFilter(term, pageable, filters, null, aggregations).then(function (page) {
        vm.currentPage = page;

        _.forEach(vm.categories, function (category) {
          var data = _.find(page.aggregations.categories, {key: category.id});
          category.count = _.get(data, 'count', 0);
        });
        var missingData = _.find(page.aggregations.categories, {key: 'N/A'});
        vm.missingCount = _.get(missingData, 'count', null);
        vm.admin = _.find(page.aggregations.status, {key: 'admin'});
        vm.subscribed = _.find(page.aggregations.status, {key: 'subscribed'});

        // fetch subscriptions to check for auto subscribe
        subscriptionsService.getSubscriptions(vm.currentUser.id, _.map(page.content, 'id')).then(function (subscriptions) {
          vm.subscriptions.push.apply(vm.subscriptions, subscriptions);
          vm.subscriptionsLoaded = true;
        });

      }).finally(function () {
        vm.loading = false;
      });
    }

    function isAutoSubscribe(page) {
      return _.some(vm.subscriptions, {targetId: page.id, autoSubscribe: true}) || undefined;
    }

    function search(searchTerm) {
      if (!vm.editingCategory) {
        vm.query.term = searchTerm;
        vm.query.filters = {categories: []};
        _loadPages();
      }
    }

    function setFilterStatus(status) {
      _setStatus(status);
      _loadPages();
    }

    function _setStatus(status) {
      $sessionStorage.pageStatusFilter = status;
      _.set(vm.query, 'filters.status', status);
    }

    function isStatus(status) {
      return status === _getQueryFilterStatus();
    }

    function _getQueryFilterStatus() {
      var status = _.get(vm.query, 'filters.status');
      return !_.isUndefined(status) ? status : vm.filterStatus.ALL;
    }

    function getStatusCount(status) {
      var adminCount = 0; // _.get(vm.admin, 'count', 0); // temporary disabled
      var subscribedCount = 0; // _.get(vm.subscribed, 'count', 0); // temporary disabled
      switch (status) {
        case vm.filterStatus.ALL:
          return getTotalCount();
        case vm.filterStatus.ADMIN:
          return adminCount;
        case vm.filterStatus.SUBSCRIBED:
          return subscribedCount;
      }
      return 0;
    }

    /* ===== Categories ===== */

    vm.editingCategory = null;
    vm.savingCategory = false;

    function getTotalCount() {
      return _.sumBy(vm.categories, 'count') + (vm.missingCount || 0);
    }

    function isCategoryActive(category) {
      var active = _.get(vm.query, 'filters.categories', []);
      return category ? active.indexOf(category.id) !== -1 : active.length === 0;
    }

    function isCategoryEdited(category) {
      return vm.editingCategory && (vm.editingCategory.isNew() ? category.isNew() : vm.editingCategory.id === category.id);
    }

    function toggleCategory(category) {
      if (!vm.editingCategory) {
        var status = _.get(vm.query, 'filters.status');
        vm.query.filters = {
          categories: category ? [category.id] : [],
          status: status
        };
        _loadPages();
      }
    }

    function addCategory($event) {
      if (vm.editingCategory || vm.savingCategory) {
        return;
      }
      vm.editingCategory = new PageCategoryModel();
      vm.categories.push(vm.editingCategory);

      $timeout(function () {
        var target = angular.element($event.currentTarget);
        target.parent().find('input').select();
      });
    }

    function editCategory(category, $event) {
      $event.preventDefault();
      $event.stopImmediatePropagation();

      if (vm.editingCategory || vm.savingCategory) {
        return;
      }
      vm.editingCategory = angular.copy(category);

      $timeout(function () {
        var target = angular.element($event.currentTarget);
        target.parent().parent().find('input').select();
      });
    }

    function saveCategory(category, $event) {
      $event.preventDefault();
      $event.stopImmediatePropagation();

      if (!category.name || vm.savingCategory) {
        return $q.reject();
      }

      vm.savingCategory = true;
      return category.save().then(function (result) {
        vm.categories.splice(_.findIndex(vm.categories, {id: category.id}), 1, result);
      }).finally(function () {
        vm.savingCategory = false;
        vm.editingCategory = null;
      });
    }

    function onCategoryKeypress(category, $event) {
      if ($event.keyCode === 13) {
        saveCategory(category, $event);
      }
    }

    function onCategoryClickOutside(category) {
      if (!vm.editingCategory || !category) {
        return; // not in edit mode
      }

      if (category.isNew()) {
        vm.categories.pop();
      } else {
        category.name = vm.editingCategory.name;
      }
      vm.editingCategory = null;
    }

    function deleteCategory(category, $event) {
      $event.preventDefault();
      $event.stopImmediatePropagation();

      if (vm.editingCategory || vm.savingCategory) {
        return $q.reject();
      }

      return modalService.confirm({
        title: 'PAGE.CATEGORY.DELETE.MODAL.TITLE',
        text: 'PAGE.CATEGORY.DELETE.MODAL.TEXT',
        translationContext: {category: category.name},
        close: {icon: 'delete', title: 'DELETE', style: 'btn-danger'},
        dismiss: {title: 'CANCEL'}
      }).result.then(function () {
        vm.savingCategory = true;
        return category.delete().then(function (result) {
          _.remove(vm.categories, {id: category.id});
          if (category.id === _.get(vm.query, 'filters.categories[0]', null)) {
            vm.query.filters = {categories: []};
            _loadPages();
          }
          return result;
        });
      }).finally(function () {
        vm.savingCategory = false;
      });
    }

    /* ==================== */

    function _buildTreeOptions() {
      return {
        dropped: function (event) {
          // persist new sort order
          if (event.source.index !== event.dest.index) {
            PageCategoryModel.order(_.map(vm.categories, 'id'));
          }
        }
      };
    }

    (function _init() {
      // extract search from URL / storage
      vm.query = $sessionStorage.pageQuery || {};
      if ($stateParams.term || $stateParams['categories[]']) {
        angular.extend(vm.query, {
          term: $stateParams.term,
          filters: {categories: $stateParams['categories[]']}
        });
      }

      // register ESC callback
      var unsubscribeEscFn = $rootScope.$on('keyup:esc', function () {
        if (vm.editingCategory) {
          var category = _.find(vm.categories, isCategoryEdited);
          $timeout(function () {
            onCategoryClickOutside(category);
          });
        }
      });

      // register permission callback
      authService.onGlobalPermissions('MANAGE_PAGE_CATEGORIES', function (canManage) {
        vm.canManagePageCategories = canManage;
      });

      // unregister callbacks on $scope death
      $scope.$on('$destroy', function () {
        unsubscribeEscFn();
      });

      $timeout(function () {
        _loadPages();
      });
    })();
  }

})(angular);
