(function () {
  'use strict';

  angular
      .module('coyo.base')
      .factory('utilService', utilService);

  /**
   * @ngdoc service
   * @name coyo.base.utilService
   *
   * @description
   *     Provides basic utility functions.
   */
  function utilService() {
    return {
      hash: hash,
      uuid: uuid,
      matchTextLinks: matchTextLinks
    };

    /**
     * @ngdoc method
     * @name coyo.base.utilService#hash
     * @methodOf coyo.base.utilService
     *
     * @description
     *     A simple string hashing function using the {@link http://www.cse.yorku.ca/~oz/hash.html djb2}.
     * @param {string} str
     *     The input string.
     * @returns {number}
     *     The absolute numeric hash of the input string.
     */
    function hash(str) {
      if (!str) {
        return -1;
      }

      var h = 5381;
      for (var i = 0; i < str.length; i++) {
        h = ((h << 5) + h) + str.charCodeAt(i);
      }
      return Math.abs(h);
    }

    /**
     * @ngdoc method
     * @name coyo.base.utilService#uuid
     * @methodOf coyo.base.utilService
     *
     * @description
     *     Generates a new UUID.
     * @returns {string}
     *     A UUID string, e.g. *4f87322d-f337-996f-8a9b-1ad08b82853c*.
     */
    function uuid() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
      }

      return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    /**
     * @ngdoc method
     * @name coyo.base.utilService#matchTextLinks
     * @methodOf coyo.base.utilService
     *
     * @description
     *     Finds all links in the provided text.
     * @param {string} text
     *     The input text.
     * @returns {Array}
     *     An array of the matched links or an empty array.
     */
    function matchTextLinks(text) {
      var regex = /https?:\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/g;
      return text.match(regex) || [];
    }
  }
})();
