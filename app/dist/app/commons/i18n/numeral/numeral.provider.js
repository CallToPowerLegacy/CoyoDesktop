(function () {
  'use strict';

  angular.module('commons.i18n')
      .provider('$numeral', numberFormatter);

  function numberFormatter(numeralGlobal) {
    var $numeral = {};

    function locale(lang) {
      if (containsLocale(numeralGlobal, lang)) {
        return numeralGlobal.locale(lang);
      } else if (lang !== numeralGlobal.locale()) {
        return numeralGlobal.locale('en');
      } else {
        return lang;
      }
    }

    function containsLocale(numeral, lang) {
      return numeral.locales[lang];
    }

    function registerLocale(lang, def) {
      if (!containsLocale(numeralGlobal, lang)) {
        numeralGlobal.register('locale', lang, def);
      }
    }

    $numeral.registerLocale = registerLocale;

    $numeral.$get = function () {
      return {
        locale: locale,
        locales: numeralGlobal.locales
      };
    };

    return $numeral;
  }



})();
