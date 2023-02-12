(function (angular) {
  'use strict';

  angular
      .module('coyo.admin.themes')
      .controller('AdminThemeListController', AdminThemeListController);

  function AdminThemeListController($rootScope, $scope, $sessionStorage, ThemeModel, UserModel, GroupModel, modalService, filterFilter, themes) {
    var vm = this;

    vm.themes = themes;
    vm.isMobile = $rootScope.screenSize.isXs || $rootScope.screenSize.isSm;
    vm.actions = _buildActions();
    vm.treeOptions = _buildOptions();

    vm.onChangeName = onChangeName;

    vm.users = {};
    vm.loadUsers = _loadCached(vm.users, 'userIds', 5, function (userIds) {
      return UserModel.query({userIds: userIds});
    });
    vm.groups = {};
    vm.loadGroups = _loadCached(vm.groups, 'userGroupIds', 5, function (groupIds) {
      return GroupModel.query({groupIds: groupIds});
    });

    // ----------

    function onChangeName(term) {
      $sessionStorage.themeList = {displayName: term};
      vm.isFiltered = !!term;
      vm.themes = term ? filterFilter(themes, $sessionStorage.themeList) : themes;
    }

    // ----------

    function _buildActions() {
      return {
        deleteTheme: function (theme) {
          modalService.confirm({
            title: 'ADMIN.THEMES.OPTIONS.DELETE.MODAL.TITLE',
            text: 'ADMIN.THEMES.OPTIONS.DELETE.MODAL.TEXT',
            close: {icon: 'delete', title: 'DELETE', style: 'btn-danger'},
            dismiss: {title: 'CANCEL'}
          }).result.then(function () {
            vm.userAction = true;
            theme.delete().then(function () {
              _.remove(themes, {id: theme.id});
              _.remove(vm.themes, {id: theme.id});
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
            if (event.dest.index === vm.themes.length - 1) {
              var theme = vm.themes[vm.themes.length - 1];
              vm.themes[vm.themes.length - 1] = vm.themes[vm.themes.length - 2];
              vm.themes[vm.themes.length - 2] = theme;
            }
            ThemeModel.order(_.map(vm.themes, 'id'));
          }
        },
        beforeDrag: function (scope) {
          // save original cell widths
          cellWidths = [];
          scope.$element.children().each(function () {
            cellWidths.push(angular.element(this).width()); // eslint-disable-line angular/controller-as-vm
          });
          return !scope.theme.default;
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
        accept: function (sourceNodeScope, destNodesScope, destIndex) {
          return destIndex < themes.length - 1;
        }
      };
    }

    function _loadCached(cache, attr, limit, resolver) {
      return function (theme) {
        if (!cache[theme.id]) {
          cache[theme.id] = true;
          var ids = _.get(theme, attr, []).slice(0, limit + 1);
          if (!ids.length) {
            cache[theme.id] = [];
          } else {
            resolver(ids).then(function (result) {
              cache[theme.id] = _.map(result, 'displayName');
            }).catch(function () {
              cache[theme.id] = false;
            });
          }
        }
      };
    }

    // ----------

    (function _init() {
      var unsubscribe = $rootScope.$on('screenSize:changed', function (event, screenSize) {
        vm.isMobile = screenSize.isXs || screenSize.isSm;
      });
      $scope.$on('$destroy', unsubscribe);

      vm.queryParams = angular.extend({displayName: ''}, $sessionStorage.themeList);
      onChangeName(vm.queryParams.displayName);
    })();
  }

})(angular);
