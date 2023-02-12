(function (angular) {
  'use strict';

  angular.module('commons.ui')
      .factory('dateRangePickerModalService', dateRangePickerModalService)
      .controller('DateRangePickerModalController', DateRangePickerModalController);

  /**
   * @ngdoc service
   * @name commons.ui.dateRangePickerModalService
   *
   * @description
   * Displays a date range picker within a modal. The modal can only be saved if a valid date range was selected. After
   * closing the modal returns the selected date in a promise.
   *
   * @requires coyo.base.modalService
   */
  function dateRangePickerModalService(modalService) {

    return {
      open: open
    };

    /**
     * @ngdoc method
     * @name commons.ui.dateRangePickerModalService#open
     * @methodOf commons.ui.dateRangePickerModalService
     *
     * @description
     * Opens the modal containing the date range picker.
     *
     * @returns {promise} Returns a promise which resolves in the newly chose date range.
     */
    function open(dateRange) {
      return modalService.open({
        templateUrl: 'app/commons/ui/components/date-range-picker/date-range-picker-modal.html',
        controller: 'DateRangePickerModalController',
        resolve: {
          dateRange: function () {
            return dateRange;
          }
        }
      }).result;
    }
  }

  function DateRangePickerModalController(dateRange) {
    var vm = this;
    vm.dateRange = dateRange;
  }

})(angular);
