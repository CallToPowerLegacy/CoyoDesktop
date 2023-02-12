(function (angular) {
  'use strict';

  angular
      .module('coyo.workspaces')
      .controller('WorkspaceSettingsController', WorkspaceSettingsController);

  function WorkspaceSettingsController($state, workspace, WorkspaceModel, coyoNotification, modalService, $scope) {
    var vm = this;

    vm.save = save;
    vm.delete = deleteWorkspace;

    function save() {
      vm.workspace.categoryIds = _.map(vm.workspace.categories, 'id');
      return vm.workspace.update().then(function (workspace) {
        coyoNotification.success('MODULE.WORKSPACES.EDIT.SUCCESS');

        if ($state.is('main.workspace.show.settings')) {
          $state.go('main.workspace.show', {idOrSlug: workspace.slug}, {reload: 'main.workspace.show'});
        }
      });
    }

    function _watchVisibilityChanges() {
      $scope.$watch('$ctrl.workspace.visibility', function (newValue, oldValue) {
        if (newValue !== oldValue && newValue !== workspace.visibility && !vm.warningShown) {
          modalService.confirm({
            title: 'WORKSPACE.VISIBILITY.CHANGE',
            text: 'WORKSPACE.VISIBILITY.CHANGE.TEXT',
            close: {title: 'YES'},
            dismiss: {title: 'NO'}
          }).result.then(function () {
            vm.warningShown = true;
          }).catch(function () {
            vm.warningShown = false;
            vm.workspace.visibility = workspace.visibility;
          });
        }
      });
    }

    function deleteWorkspace() {
      modalService.confirm({title: 'WORKSPACE.DELETE', text: 'WORKSPACE.DELETE.CONFIRM'}).result.then(function () {
        vm.workspace.delete().then(function () {
          $state.go('main.workspace');
          coyoNotification.success('WORKSPACE.DELETE.SUCCESS');
        });
      });
    }

    (function _init() {
      vm.baseUrl = $state.href('main.workspace', {}) + '/';
      vm.oldName = workspace.displayName;
      vm.oldSlug = workspace.slug;

      vm.workspace = new WorkspaceModel(workspace);
      _.forEach(vm.workspace.categories, function (category) {
        category.displayName = category.name;
      });
      _watchVisibilityChanges();
    })();
  }

})(angular);
