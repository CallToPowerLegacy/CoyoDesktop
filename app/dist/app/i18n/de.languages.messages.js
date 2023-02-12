(function (angular) {
  'use strict';

  angular
      .module('coyo.app')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('de', {
          "LANGUAGE.LANGUAGES.BG": "Bulgarisch",
          "LANGUAGE.LANGUAGES.CS": "Tschechisch",
          "LANGUAGE.LANGUAGES.DA": "Dänisch",
          "LANGUAGE.LANGUAGES.DE": "Deutsch",
          "LANGUAGE.LANGUAGES.EL": "Griechisch",
          "LANGUAGE.LANGUAGES.EN": "Englisch",
          "LANGUAGE.LANGUAGES.ES": "Spanisch",
          "LANGUAGE.LANGUAGES.ET": "Estnisch",
          "LANGUAGE.LANGUAGES.FI": "Finnisch",
          "LANGUAGE.LANGUAGES.FR": "Französisch",
          "LANGUAGE.LANGUAGES.HR": "Kroatisch",
          "LANGUAGE.LANGUAGES.HU": "Ungarisch",
          "LANGUAGE.LANGUAGES.HY": "Armenisch",
          "LANGUAGE.LANGUAGES.IS": "Isländisch",
          "LANGUAGE.LANGUAGES.IT": "Italienisch",
          "LANGUAGE.LANGUAGES.JA": "Japanisch",
          "LANGUAGE.LANGUAGES.LV": "Lettisch",
          "LANGUAGE.LANGUAGES.NL": "Niederländisch",
          "LANGUAGE.LANGUAGES.NO": "Norwegisch",
          "LANGUAGE.LANGUAGES.PL": "Polnisch",
          "LANGUAGE.LANGUAGES.PT": "Portugiesisch",
          "LANGUAGE.LANGUAGES.RO": "Rumänisch",
          "LANGUAGE.LANGUAGES.RU": "Russisch",
          "LANGUAGE.LANGUAGES.SK": "Slowakisch",
          "LANGUAGE.LANGUAGES.SL": "Slowenisch",
          "LANGUAGE.LANGUAGES.SR": "Serbisch",
          "LANGUAGE.LANGUAGES.SV": "Schwedisch",
          "LANGUAGE.LANGUAGES.TR": "Türkisch",
          "LANGUAGE.LANGUAGES.ZH": "Chinesisch"
        });
        /* eslint-enable quotes */
      });
})(angular);
