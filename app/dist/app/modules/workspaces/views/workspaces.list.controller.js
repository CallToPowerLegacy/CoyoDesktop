(function (angular) {
  'use strict';

  angular
      .module('coyo.workspaces')
      .controller('WorkspacesListController', WorkspacesListController);

  function WorkspacesListController($rootScope, $scope, $q, $sessionStorage, $state, $stateParams, $timeout,
                                    WorkspaceModel, WorkspaceCategoryModel, Pageable, currentUser, categories,
                                    authService, modalService, workspacesConfig) {
    var vm = this;

    vm.filterStatus = {
      ALL: 'ALL',
      ACTIVE: 'ACTIVE',
      ARCHIVED: 'ARCHIVED'
    };
    vm.currentUser = currentUser;
    vm.treeOptions = _buildTreeOptions();
    vm.categories = categories;
    vm.editingCategory = null;
    vm.savingCategory = false;

    vm.$onInit = onInit;
    vm.showWorkspaceActions = showWorkspaceActions;
    vm.search = search;
    vm.getTotalCount = getTotalCount;
    vm.getStatusCount = getStatusCount;
    vm.isCategoryActive = isCategoryActive;
    vm.isCategoryEdited = isCategoryEdited;
    vm.isStatus = isStatus;
    vm.toggleCategory = toggleCategory;
    vm.setFilterStatus = setFilterStatus;
    vm.addCategory = addCategory;
    vm.editCategory = editCategory;
    vm.saveCategory = saveCategory;
    vm.onCategoryKeypress = onCategoryKeypress;
    vm.onCategoryClickOutside = onCategoryClickOutside;
    vm.deleteCategory = deleteCategory;

    function showWorkspaceActions(currentWorkspace) {
      return ((currentWorkspace.visibility === 'PUBLIC' || currentWorkspace.visibility === 'PROTECTED')
          || (currentWorkspace.visibility === 'PRIVATE' && currentWorkspace.membershipStatus !== 'NONE'));
    }

    function search(searchTerm) {
      if (!vm.editingCategory) {
        vm.query.term = searchTerm;
        vm.query.filters = {categories: [], status: _getQueryFilterStatus()};
        _loadWorkspaces();
      }
    }

    function getTotalCount() {
      return _.sumBy(vm.categories, 'count') + (vm.missingCount || 0);
    }

    function getStatusCount(status) {
      var activeCount = _.get(vm.active, 'count', 0);
      var archivedCount = _.get(vm.archived, 'count', 0);
      switch (status) {
        case vm.filterStatus.ALL:
          return activeCount + archivedCount;
        case vm.filterStatus.ACTIVE:
          return activeCount;
        case vm.filterStatus.ARCHIVED:
          return archivedCount;
      }

      return 0;
    }

    function isCategoryActive(category) {
      var active = _.get(vm.query, 'filters.categories', []);
      return category ? active.indexOf(category.id) !== -1 : active.length === 0;
    }

    function isCategoryEdited(category) {
      return vm.editingCategory && (vm.editingCategory.isNew() ? category.isNew() : vm.editingCategory.id === category.id);
    }

    function isStatus(status) {
      return status === _getQueryFilterStatus();
    }

    function toggleCategory(category) {
      if (!vm.editingCategory) {
        _.set(vm.query, 'filters.categories', category ? [category.id] : []);
        _loadWorkspaces();
      }
    }

    function setFilterStatus(status) {
      _setStatus(status);
      _loadWorkspaces();
    }

    function addCategory($event) {
      if (vm.editingCategory || vm.savingCategory) {
        return;
      }
      vm.editingCategory = new WorkspaceCategoryModel();
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
        title: 'WORKSPACE.CATEGORY.DELETE.MODAL.TITLE',
        text: 'WORKSPACE.CATEGORY.DELETE.MODAL.TEXT',
        translationContext: {category: category.name},
        close: {icon: 'delete', title: 'DELETE', style: 'btn-danger'},
        dismiss: {title: 'CANCEL'}
      }).result.then(function () {
        vm.savingCategory = true;
        return category.delete().then(function (result) {
          _.remove(vm.categories, {id: category.id});
          if (category.id === _.get(vm.query, 'filters.categories[0]', null)) {
            _.set(vm.query, 'filters.categories', []);
            _loadWorkspaces();
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
            WorkspaceCategoryModel.order(_.map(vm.categories, 'id'));
          }
        }
      };
    }

    function _loadWorkspaces() {
      if (vm.loading) {
        return;
      }

      // write params to URL
      var params = {
        term: _.get(vm.query, 'term', ''),
        'categories[]': _.get(vm.query, 'filters.categories', []),
        'status': _getQueryFilterStatus()
      };
      $state.transitionTo('main.workspace', _.omitBy(params, _.isEmpty), {notify: false});

      // perform search
      $sessionStorage.workspaceQuery = vm.query;
      vm.loading = true;

      var term = vm.query.term;
      var sort = term ? ['_score,DESC', 'displayName.sort'] : 'displayName.sort';
      var pageable = new Pageable(0, workspacesConfig.list.paging.pageSize, sort);
      var aggregations = {categories: 0, archived: 0};
      var filters = _getFiltersForQuery();
      WorkspaceModel.searchWithFilter(term, pageable, filters, null, aggregations, true).then(function (page) {
        vm.currentPage = page;
        _.forEach(vm.categories, function (category) {
          var data = _.find(page.aggregations.categories, {key: category.id});
          category.count = _.get(data, 'count', 0);
        });
        var missingData = _.find(page.aggregations.categories, {key: 'N/A'});
        vm.missingCount = _.get(missingData, 'count', null);
        var archived = _.get(page, 'aggregations.archived');
        vm.active = _.find(archived, {key: '0'});
        vm.archived = _.find(archived, {key: '1'});
      }).finally(function () {
        vm.loading = false;
      });
    }

    function _getQueryFilterStatus() {
      var status = _.get(vm.query, 'filters.status');
      return !_.isUndefined(status) ? status : vm.filterStatus.ACTIVE;
    }

    function _getFilterStatusForQuery(status) {
      switch (status) {
        case vm.filterStatus.ACTIVE:
          return false;
        case vm.filterStatus.ARCHIVED:
          return true;
        default:
          break;
      }

      return undefined;
    }

    function _getFiltersForQuery() {
      var filters = _.clone(_.get(vm.query, 'filters'));
      if (filters && filters.status) {
        filters.archived = _getFilterStatusForQuery(filters.status);
        delete filters.status;
      }

      return filters;
    }

    function _setStatus(status) {
      $sessionStorage.workspaceStatusFilter = status;
      _.set(vm.query, 'filters.status', status);
    }

    function onInit() {
      vm.query = $sessionStorage.workspaceQuery || {};
      if ($stateParams.term || $stateParams['categories[]']) {
        angular.extend(vm.query, {
          term: $stateParams.term,
          filters: {
            categories: $stateParams['categories[]']
          }
        });
      }
      if (_.isUndefined(vm.query.filters)) {
        _.set(vm.query, 'filters', {});
      }
      var status = $sessionStorage.workspaceStatusFilter || vm.filterStatus.ACTIVE;
      _setStatus(!_.isUndefined($stateParams.status) ? $stateParams.status : status);

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
      authService.onGlobalPermissions('MANAGE_WORKSPACE_CATEGORIES', function (canManage) {
        vm.canManageWorkspaceCategories = canManage;
      });

      $timeout(function () {
        _loadWorkspaces();
      });

      // unregister callbacks on $scope death
      $scope.$on('$destroy', function () {
        unsubscribeEscFn();
      });
    }
  }

})(angular);
