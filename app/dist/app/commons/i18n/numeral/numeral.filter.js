(function () {
  'use strict';

  angular.module('commons.i18n')
      .filter('numeralFilter', numeralFilter);

  function numeralFilter(numeralGlobal) {
    return function (input, format) {
      if (input === null) {
        return input;
      }

      return numeralGlobal(input).format(format);
    };
  }
})();
