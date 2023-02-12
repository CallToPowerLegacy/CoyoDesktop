(function () {
  'use strict';

  angular
      .module('coyo.apps.list.fields')
      .directive('fileFieldModel', FileFieldModel);


  /**
   * @ngdoc directive
   * @name coyo.apps.list.fields.fileFieldModel:fileFieldModel
   * @element ANY
   * @restrict AE
   * @scope
   *
   * @description
   * Transforms the file-chooser returntype to an array of files
   *
   * @requires ngModel
   *
   */
  function FileFieldModel() {
    return {
      require: 'ngModel',
      link: function (scope, element, attr, ngModel) {

        // convert to single object for display
        ngModel.$formatters.push(function (value) {
          if (scope.$ctrl.fileLibraryOptions && scope.$ctrl.fileLibraryOptions.selectMode === 'single') {
            return _.isArray(value) && value.length > 0 ? value[0] : undefined;
          } else {
            return value;
          }
        });

        // convert to array for storage
        ngModel.$parsers.push(function (value) {
          return value && !_.isArray(value) ? [value] : value;
        });
      }
    };
  }
})();
