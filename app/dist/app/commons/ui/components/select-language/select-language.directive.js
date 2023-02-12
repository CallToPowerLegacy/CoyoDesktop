(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoSelectLanguage', selectLanguage);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoSelectLanguage:coyoSelectLanguage
   * @restrict E
   * @scope
   *
   * @description
   * Renders a UI select field for language selection.
   *
   * @param {string} placeholder The placeholder for the input field
   * @param {boolean} ngDisabled Marks this field as disabled
   * @param {boolean} allowClear Marks this field as clearable
   *
   * @requires $rootScope
   * @requires $translate
   * @requires LanguagesModel
   */
  function selectLanguage($rootScope, $translate, LanguagesModel) {
    return {
      restrict: 'E',
      require: 'ngModel',
      templateUrl: 'app/commons/ui/components/select-language/select-language.html',
      scope: {
        placeholder: '@?',
        ngDisabled: '<?',
        allowClear: '<?'
      },
      link: function (scope, elem, attrs, ctrl) {
        scope.data = {
          languages: [],
          selected: null
        };

        function _translate() {
          var prefix = 'LANGUAGE.LANGUAGES.';
          LanguagesModel.retrieve().then(function (languages) {
            $translate(_.map(languages, function (language) {
              return prefix + language.language;
            })).then(function (data) {
              scope.data.languages = _.map(data, function (language, i18nKey) {
                return {
                  key: i18nKey.substring(prefix.length),
                  name: language
                };
              });
            });
          });
        }

        // ----- init

        _translate();

        // translate on language change
        $rootScope.$on('$translateChangeSuccess', function () {
          _translate();
        });

        // model -> select
        ctrl.$render = function () {
          scope.data.selected = ctrl.$viewValue;
        };

        // select -> model
        scope.$watch('data.selected', function (newVal, oldVal) {
          if (newVal !== oldVal) {
            ctrl.$setViewValue(newVal);
          }
        });
      }
    };
  }

})(angular);
