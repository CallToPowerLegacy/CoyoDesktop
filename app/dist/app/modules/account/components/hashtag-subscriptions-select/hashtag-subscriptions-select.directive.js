(function () {
  'use strict';

  angular
      .module('coyo.account')
      .component('oyocHashtagSubscriptionsSelect', hashtagSubscriptionsSelect())
      .controller('HashtagSubscriptionsSelectController', HashtagSubscriptionsSelectController);

  function hashtagSubscriptionsSelect() {
    return {
      templateUrl: 'app/modules/account/components/hashtag-subscriptions-select/hashtag-subscriptions-select.html',
      controller: 'HashtagSubscriptionsSelectController',
      controllerAs: '$ctrl'
    };
  }

  function HashtagSubscriptionsSelectController(authService, hashtagSubscriptionsService, HASHTAG_REGEX_PATTERN_CONCLUDED) {
    var vm = this;

    vm.$onInit = _init;
    vm.hashtags = [];

    var _currentUser = {};

    vm.onTagAdding = onTagAdding;
    vm.onTagAdded = onTagAdded;
    vm.onTagRemoved = onTagRemoved;
    vm.onInvalidTag = onInvalidTag;
    vm.onChange = onChange;

    function onTagAdding(tag) {
      return new RegExp(HASHTAG_REGEX_PATTERN_CONCLUDED).test(tag.text);
    }

    function onTagAdded(tag) {
      hashtagSubscriptionsService.subscribe(_currentUser.id, tag.text).catch(_processFailedResponse);
    }

    function onTagRemoved(tag) {
      hashtagSubscriptionsService.unsubscribe(_currentUser.id, tag.text).catch(_processFailedResponse);
    }

    function _processFailedResponse() {
      _init();
    }

    function onChange() {
      vm.hashtagsForm.$setValidity('invalid-syntax', true);
      vm.hashtagsForm.$setValidity('already-added', true);
    }

    function onInvalidTag(tag) {
      if (_.some(vm.hashtags, tag)) {
        vm.hashtagsForm.$setValidity('already-added', false);
      } else {
        vm.hashtagsForm.$setValidity('invalid-syntax', false);
      }
    }

    function _init() {
      authService.getUser().then(function (user) {
        _currentUser = user;
        return hashtagSubscriptionsService.getSubscriptions(_currentUser.id);
      }).then(function (results) {
        vm.hashtags = results;
      });
    }
  }
})();
