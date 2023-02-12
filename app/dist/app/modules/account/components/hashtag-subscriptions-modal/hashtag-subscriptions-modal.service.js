(function () {
  'use strict';

  angular
      .module('coyo.account')
      .factory('hashtagSubscriptionsModal', hashtagSubscriptionsModal)
      .controller('HashtagSubscriptionModalController', HashtagSubscriptionModalController);

  /**
   * @ngdoc service
   * @name coyo.account.hashtagSubscriptionsModal
   *
   * @description
   * Provides a modal to set the hashtag subscriptions
   *
   * @requires modalService
   */
  function hashtagSubscriptionsModal(modalService) {
    return {
      open: open
    };

    /**
     * @ngdoc method
     * @name coyo.account.hashtagSubscriptionsModal#open
     * @methodOf coyo.account.hashtagSubscriptionsModal
     *
     * @description
     * Opens the modal to set the hashtag subscriptions.
     *
     * @returns {object} promise contains the result of the saving dialog
     */
    function open() {
      return modalService.open({
        controller: 'HashtagSubscriptionModalController',
        templateUrl: 'app/modules/account/components/hashtag-subscriptions-modal/hashtag-subscriptions-modal.html'
      }).result;
    }
  }

  function HashtagSubscriptionModalController($uibModalInstance) {
    var vm = this;
    vm.save = save;

    function save() {
      $uibModalInstance.close();
    }
  }
})();
