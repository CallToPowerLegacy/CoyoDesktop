(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoSelectTimeZone', selectTimeZone);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoSelectTimeZone:coyoSelectTimeZone
   * @restrict E
   * @scope
   *
   * @description
   * Renders a UI select field for time zone selection.
   *
   * @param {string} placeholder The placeholder for the input field
   * @param {boolean} ngDisabled Marks this field as disabled
   * @param {boolean} allowClear Marks this field as clearable
   *
   * @requires $rootScope
   * @requires $translate
   * @requires timeZones
   */
  function selectTimeZone($rootScope, $translate, timeZones) {
    return {
      restrict: 'E',
      require: 'ngModel',
      templateUrl: 'app/commons/ui/components/select-timezone/select-timezone.html',
      scope: {
        placeholder: '@?',
        ngDisabled: '<?',
        allowClear: '<?'
      },
      link: function (scope, elem, attrs, ctrl) {
        scope.data = {
          timeZones: [],
          selected: null
        };

        function _toUTCString(offset) {
          var sgn = offset >= 0 ? '+' : '';
          var hrs = sgn + Math.floor(offset / 60);
          var mns = _.padStart(Math.abs(offset % 60), 2, 0);
          return 'UTC' + hrs + ':' + mns;
        }

        function _translate() {
          var prefix = 'TIMEZONES.LOCATIONS.';
          return $translate(_.chain(timeZones).keys().map(function (timeZone) {
            return prefix + timeZone;
          }).value()).then(function (data) {
            scope.data.timeZones = _.map(data, function (locations, i18nKey) {
              return {
                key: i18nKey.substring(prefix.length),
                utc: _toUTCString(timeZones[i18nKey.substring(prefix.length)]),
                loc: locations
              };
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
