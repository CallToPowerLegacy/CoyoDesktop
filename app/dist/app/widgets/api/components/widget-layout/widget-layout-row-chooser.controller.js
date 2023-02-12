(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.api')
      .controller('WidgetLayoutRowChooserController', WidgetLayoutRowChooserController);

  function WidgetLayoutRowChooserController(layout, index, utilService, $uibModalInstance) {
    var vm = this;

    vm.layout = layout;
    vm.index = index;

    vm.rowTypes = [
      {slots: [12]},
      {slots: [6, 6]},
      {slots: [3, 9]},
      {slots: [9, 3]},
      {slots: [4, 8]},
      {slots: [8, 4]},
      {slots: [4, 4, 4]},
      {slots: [3, 6, 3]},
      {slots: [3, 3, 3, 3]}
    ];

    vm.save = save;

    // ------------------------------------------------------------------------------------------------------------

    function save(rowType) {
      if (!layout.settings.rows) {
        layout.settings.rows = [];
      }

      var row = {name: utilService.uuid(), slots: []};

      angular.forEach(rowType.slots, function (cols) {
        row.slots.push({
          name: utilService.uuid(),
          cols: cols
        });
      });

      layout.settings.rows.splice(index, 0, row);
      $uibModalInstance.close();
    }
  }
})(angular);
