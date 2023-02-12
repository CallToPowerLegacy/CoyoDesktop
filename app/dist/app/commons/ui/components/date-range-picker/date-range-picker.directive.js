(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .constant('kalendae', Kalendae) // eslint-disable-line no-undef
      .directive('coyoDateRangePicker', dateRangePicker);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoDateRangePicker:coyoDateRangePicker
   * @scope
   * @restrict 'AE'
   * @param {object[]} ngModel the array of selected dates
   * @param {object} options the options of the date picker (see https://github.com/ChiperSoft/Kalendae)
   * @param {boolean} fullRange applies a validator to enforce a full date range consisting of two valid dates
   *
   * @description
   * Displays calendar where user can define a date-range. The calendar can be used inline (as a standalone directive)
   * or as a dropdown (applied to an input field).
   *
   * @requires $rootScope
   * @requires $timeout
   * @requires kalendae
   * @requires moment
   */
  function dateRangePicker($rootScope, $timeout, kalendae, moment) {
    return {
      restrict: 'AE',
      require: 'ngModel',
      link: function (scope, elem, attrs, ngModelCtrl) {
        var Picker = angular.isDefined(attrs.coyoDateRangePicker) ? kalendae.Input : kalendae;

        function getDelimiter() {
          return datePicker.settings.mode === 'range'
            ? datePicker.settings.rangeDelimiter
            : datePicker.settings.multipleDelimiter;
        }

        function isValid(date) {
          return date.isValid();
        }

        function toStr(input) {
          return _.map(input, function (date) {
            return date.format(datePicker.settings.format);
          }).join(getDelimiter());
        }

        function fromStr(input) {
          var parts = input ? input.split(getDelimiter()) : [];
          var dates = _.map(parts, function (part) {
            return moment(part, datePicker.settings.format);
          });
          return _.every(dates, isValid) ? dates : undefined;
        }

        var datePicker = new Picker(elem[0], angular.extend({
          format: _.get($rootScope, 'dateFormat.short', 'M/D/YYYY'),
          mode: 'range',
          weekStart: 1
        }, scope.$eval(attrs.options), {
          subscribe: {
            change: function () {
              $timeout(function () {
                var newVal = toStr(datePicker.getSelectedRaw());
                if (ngModelCtrl.$viewValue !== newVal) {
                  ngModelCtrl.$setViewValue(newVal);
                }
              });
            }
          }
        }));

        // view -> model
        ngModelCtrl.$parsers.push(fromStr);

        // model -> view
        ngModelCtrl.$formatters.push(toStr);

        // validator
        if (angular.isDefined(attrs.fullRange)) {
          ngModelCtrl.$validators.range = function (modelValue) {
            return _.isArray(modelValue) && modelValue.length === 2;
          };
        }

        // outside change
        scope.$watch(attrs.ngModel, function (newVal) {
          datePicker.setSelected(newVal);
        });

        // translate column headers
        var startDay = moment().day(datePicker.settings.weekStart);
        elem.find('.k-header span').each(function (i, e) {
          angular.element(e).text(startDay.format(datePicker.settings.columnHeaderFormat));
          startDay.add(1, 'days');
        });
      }
    };
  }

})(angular);
