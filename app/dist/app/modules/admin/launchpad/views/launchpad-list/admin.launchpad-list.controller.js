(function (angular) {
  'use strict';

  angular.module('coyo.admin.launchpad')
      .controller('AdminLaunchpadListController', AdminLaunchpadListController);

  function AdminLaunchpadListController($state, LaunchpadCategoryModel, settings, SettingsModel, modalService, coyoNotification) {
    var vm = this;

    vm.categories = [];
    vm.actions = _buildActions();
    vm.treeOptions = _buildOptions();
    vm.settings = settings;
    vm.save = save;
    vm.isActive = (settings.launchpadActive === 'true');

    // ----------

    function _buildActions() {
      return {
        deleteCategory: function (category) {
          modalService.confirm({
            title: 'ADMIN.LAUNCHPAD.OPTIONS.DELETE.MODAL.TITLE',
            text: 'ADMIN.LAUNCHPAD.OPTIONS.DELETE.MODAL.TEXT',
            close: {title: 'YES'},
            dismiss: {title: 'NO'}
          }).result.then(function () {
            category.delete().then(function () {
              _.remove(vm.categories, {id: category.id});
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
            LaunchpadCategoryModel.order(_.map(vm.categories, 'id'));
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

    function save() {
      return settings.update().then(function (data) {
        SettingsModel.retrieve(true); // reset settings cache
        coyoNotification.success('ADMIN.SETTINGS.SAVE.SUCCESS');
        vm.isActive = (data.launchpadActive === 'true');
      });
    }

    // ----------

    (function _init() {
      vm.loading = true;
      return LaunchpadCategoryModel.query({admin: true}).then(function (result) {
        vm.categories = result;
      }).finally(function () {
        vm.loading = false;
      });
    })();
  }

})(angular);
