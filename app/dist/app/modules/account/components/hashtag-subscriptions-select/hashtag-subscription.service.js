(function () {
  'use strict';

  angular
      .module('coyo.account')
      .factory('hashtagSubscriptionsService', hashtagSubscriptionsService);

  function hashtagSubscriptionsService($http, coyoEndpoints) {

    return {
      subscribe: subscribe,
      unsubscribe: unsubscribe,
      getSubscriptions: getSubscriptions
    };

    function subscribe(userId, hashtag) {
      return $http.post(_createHashtagSubscriptionsUrl(userId), {hashtag: hashtag});
    }

    function unsubscribe(userId, hashtag) {
      var url = _createHashtagSubscriptionsUrl(userId);
      url += '/' + encodeURIComponent(hashtag);
      return $http.delete(url);
    }

    function getSubscriptions(userId) {

      return $http.get(_createHashtagSubscriptionsUrl(userId))
          .then(processSuccessfullyResponse);

      function processSuccessfullyResponse(response) {
        return _(response.data).map('hashtag').value();
      }
    }

    function _createHashtagSubscriptionsUrl(userId) {
      return coyoEndpoints.user.hashtagSubscriptions.replace('{id}', userId);
    }
  }

})();
