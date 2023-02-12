(function () {
  'use strict';

  angular
      .module('coyo.apps.list.fields')
      .directive('optionsFieldModel', OptionsFieldModel);

  /**
   * @ngdoc directive
   * @name coyo.apps.list.fields.optionsFieldModel:optionsFieldModel
   * @element ANY
   * @restrict AE
   * @scope
   *
   * @description
   * Transforms the option model
   *
   * @requires ngModel
   *
   */
  function OptionsFieldModel() {
    return {
      require: 'ngModel',
      link: function (scope, element, attr, ngModel) {
        // convert to single object for display
        ngModel.$formatters.push(function (value) {
          return _.isArray(value) && value.length > 0 ? value[0] : undefined;
        });

        // convert to array for storage
        ngModel.$parsers.push(function (value) {
          return value ? [value] : [];
        });
      }
    };
  }
})();
