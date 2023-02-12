(function (angular) {
  'use strict';

  angular.module('commons.ui')
      .config(function ($provide) {
        var replaceTemplate = function (directive, templateUrl) {
          $provide.decorator(directive, function ($delegate) {
            $delegate[0].templateUrl = templateUrl;
            return $delegate;
          });
        };

        replaceTemplate('uibDaypickerDirective', 'app/commons/ui/components/datepicker/datepicker-day.html');
        replaceTemplate('uibMonthpickerDirective', 'app/commons/ui/components/datepicker/datepicker-month.html');
        replaceTemplate('uibYearpickerDirective', 'app/commons/ui/components/datepicker/datepicker-year.html');
        replaceTemplate('uibTimepickerDirective', 'app/commons/ui/components/datepicker/timepicker.html');
      })

      .config(function (uibDatepickerConfig) {
        uibDatepickerConfig.showWeeks = false;
        uibDatepickerConfig.startingDay = 1;
      })

      .config(function (uibTimepickerConfig) {
        uibTimepickerConfig.showMeridian = false;
        uibTimepickerConfig.showSeconds = false;
      })

      .constant('uiDatetimePickerConfig', {
        dateFormat: 'yyyy-MM-dd HH:mm',
        defaultTime: '09:00:00',
        html5Types: {
          date: 'yyyy-MM-dd',
          'datetime-local': 'yyyy-MM-ddTHH:mm:ss.sss',
          'month': 'yyyy-MM'
        },
        initialPicker: 'date',
        reOpenDefault: false,
        enableDate: true,
        enableTime: true,
        buttonBar: {
          show: false
        },
        closeOnDateSelection: true,
        closeOnTimeNow: true,
        appendToBody: true,
        altInputFormats: [],
        ngModelOptions: {},
        saveAs: false,
        readAs: false
      });

})(angular);
