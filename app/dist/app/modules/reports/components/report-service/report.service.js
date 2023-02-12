(function (angular) {
  'use strict';

  angular
      .module('coyo.reports')
      .factory('reportService', reportService);

  /**
   * @ngdoc service
   * @name coyo.reports.reportService
   *
   * @description
   * Service to report entities.
   */
  function reportService(modalService, coyoNotification, ReportModel) {
    var isLoading = false;

    return {
      report: report
    };

    /**
     * @ngdoc method
     * @name coyo.reports.reportService#report
     * @methodOf coyo.reports.reportService
     *
     * @description
     * Reports the given entity.
     *
     * @param {string} entityId The entity ID of the target.
     * @param {string} entityType The entity type name of the target.
     */
    function report(entityId, entityType) {
      if (isLoading) {
        return;
      }

      modalService.open({
        size: 'md',
        templateUrl: 'app/modules/reports/components/report-service/report.modal.html',
        controller: 'ReportServiceModalController',
        controllerAs: '$ctrl'
      }).result.then(function (result) {
        isLoading = true;

        new ReportModel({
          targetId: entityId,
          targetType: entityType,
          message: result.message,
          anonymous: result.anonymous
        }).create().then(function () {
          coyoNotification.success('MODULE.REPORT.SUCCESS');
        }).finally(function () {
          isLoading = false;
        });
      });
    }
  }

})(angular);
