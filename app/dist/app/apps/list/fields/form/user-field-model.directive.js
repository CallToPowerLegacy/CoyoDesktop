(function () {
  'use strict';

  angular
      .module('coyo.apps.list.fields')
      .directive('userFieldModel', UserFieldModel);

  /**
   * @ngdoc directive
   * @name coyo.apps.list.fields.userFieldModel:userFieldModel
   * @element ANY
   * @restrict AE
   * @scope
   *
   * @description
   * Transforms the users model
   *
   * @requires ngModel
   *
   */
  function UserFieldModel() {
    return {
      require: 'ngModel',
      link: function (scope, element, attr, ngModel) {

        ngModel.$formatters.push(function (model) {
          if (!model) {
            model = {};
          }

          model.value = (_.isArray(model.value) && model.value.length > 0) ? model.value : [];
          var hasObjectElements = model.value.length > 0 && model.value[0] instanceof Object;
          if (hasObjectElements) {
            model.value = model.value.map(_toId);
          }
          return model;
        });

      }
    };

    function _toId(value) {
      return value.id;
    }
  }
})();
