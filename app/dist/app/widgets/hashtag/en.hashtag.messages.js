(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.hashtag')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('en', {
          "WIDGET.HASHTAG.DESCRIPTION": "Shows a hashtag cloud of the most popular hashtags of the last days, weeks or months.",
          "WIDGET.HASHTAG.NAME": "Trending Hashtags",
          "WIDGET.HASHTAG.TITLE": "Trending Hashtags",
          "WIDGET.HASHTAG.EMPTY": "There are no hashtags, yet.",
          "WIDGET.HASHTAG.SETTINGS.PERIOD": "Time Period",
          "WIDGET.HASHTAG.SETTINGS.PERIOD.UNLIMITED": "Ever",
          "WIDGET.HASHTAG.SETTINGS.PERIOD.ONE_YEAR": "12 months",
          "WIDGET.HASHTAG.SETTINGS.PERIOD.SIX_MONTHS": "6 months",
          "WIDGET.HASHTAG.SETTINGS.PERIOD.THREE_MONTHS": "3 months",
          "WIDGET.HASHTAG.SETTINGS.PERIOD.TWO_MONTHS": "2 months",
          "WIDGET.HASHTAG.SETTINGS.PERIOD.ONE_MONTH": "1 months",
          "WIDGET.HASHTAG.SETTINGS.PERIOD.TWO_WEEKS": "2 weeks",
          "WIDGET.HASHTAG.SETTINGS.PERIOD.ONE_WEEK": "1 week",
          "WIDGET.HASHTAG.SETTINGS.PERIOD.ONE_DAY": "1 day",
          "WIDGET.HASHTAG.SETTINGS.PERIOD.HELP": "Only the hashtags that were posted in the select time period will be considered for the displayed hashtag cloud."
        });
        /* eslint-enable quotes */
      });

})(angular);
