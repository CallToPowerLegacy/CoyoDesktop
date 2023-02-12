(function (angular) {
  'use strict';

  angular
      .module('coyo.app')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('en', {
          "LANGUAGE.LANGUAGES.BG": "Bulgarian",
          "LANGUAGE.LANGUAGES.CS": "Czech",
          "LANGUAGE.LANGUAGES.DA": "Danish",
          "LANGUAGE.LANGUAGES.DE": "German",
          "LANGUAGE.LANGUAGES.EL": "Greek",
          "LANGUAGE.LANGUAGES.EN": "English",
          "LANGUAGE.LANGUAGES.ES": "Spanish",
          "LANGUAGE.LANGUAGES.ET": "Estonian",
          "LANGUAGE.LANGUAGES.FI": "Finnish",
          "LANGUAGE.LANGUAGES.FR": "French",
          "LANGUAGE.LANGUAGES.HR": "Croatian",
          "LANGUAGE.LANGUAGES.HU": "Hungarian",
          "LANGUAGE.LANGUAGES.HY": "Armenian",
          "LANGUAGE.LANGUAGES.IS": "Icelandic",
          "LANGUAGE.LANGUAGES.IT": "Italian",
          "LANGUAGE.LANGUAGES.JA": "Japanese",
          "LANGUAGE.LANGUAGES.LV": "Latvian",
          "LANGUAGE.LANGUAGES.NL": "Dutch",
          "LANGUAGE.LANGUAGES.NO": "Norwegian",
          "LANGUAGE.LANGUAGES.PL": "Polish",
          "LANGUAGE.LANGUAGES.PT": "Portuguese",
          "LANGUAGE.LANGUAGES.RO": "Romanian",
          "LANGUAGE.LANGUAGES.RU": "Russian",
          "LANGUAGE.LANGUAGES.SK": "Slovakian",
          "LANGUAGE.LANGUAGES.SL": "Slovenian",
          "LANGUAGE.LANGUAGES.SR": "Serbian",
          "LANGUAGE.LANGUAGES.SV": "Swedish",
          "LANGUAGE.LANGUAGES.TR": "Turkish",
          "LANGUAGE.LANGUAGES.ZH": "Chinese"
        });
        /* eslint-enable quotes */
      });
})(angular);
