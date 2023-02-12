(function () {
  'use strict';

  // --------------------
  // Lodash extensions
  // --------------------

  /**
   * Tries to get the specified element of a given object.
   *
   * If the result is null or undefined, returns a given default value.
   *
   * @param {object} obj The object to search in
   * @param {string} str The string to search for, e.g. 'user.name'
   * @param {string} defaultValue The default value to return if no value could be found
   */
  function getNullUndefined(obj, str, defaultValue) {
    var val = _.get(obj, str, defaultValue);
    return val === null ? defaultValue : val;
  }

  _.mixin({
    getNullUndefined: getNullUndefined
  });

})();
