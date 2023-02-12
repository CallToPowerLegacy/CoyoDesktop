(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .constant('HASHTAG_REGEX_PATTERN', getHashtagRegexPattern())
      .constant('HASHTAG_REGEX_PATTERN_CONCLUDED', getHashtagRegexPatternConcluded());

  /**
   * @description The rules for hash-tagging are addressed to the twitter rules
   * @see https://support.twitter.com/articles/511696.
   *
   * @returns {string}
   */
  function getHashtagRegexPattern() {
    return '#[a-zA-ZäöüßÄÖÜ][a-zA-Z0-9äöüßÄÖÜ]*|#[0-9]+[a-zA-ZäöüßÄÖÜ]+[a-zA-Z0-9äöüßÄÖÜ]*';
  }

  function getHashtagRegexPatternConcluded() {
    return '^#[a-zA-ZäöüßÄÖÜ][a-zA-Z0-9äöüßÄÖÜ]*$|^#[0-9]+[a-zA-ZäöüßÄÖÜ]+[a-zA-Z0-9äöüßÄÖÜ]*$';
  }

})(angular);
