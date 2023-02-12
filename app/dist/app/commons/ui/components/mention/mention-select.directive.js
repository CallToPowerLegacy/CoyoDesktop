(function (angular) {
  'use strict';

  angular
      .module('commons.ui')
      .directive('coyoMentionSelect', mentionSelect)
      .controller('MentionSelectController', MentionSelectController);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoMentionSelect:coyoMentionSelect
   * @restrict 'A'
   * @element ANY
   *
   * @description
   * Adds a mention dropdown to any input or textarea. The selected sender will be inserted into the ng-model using its
   * sender slug, prefixed with an at (@).
   *
   * @requires $compile
   */
  function mentionSelect($compile) {
    return {
      restrict: 'A',
      require: 'ngModel',
      controller: 'MentionSelectController',
      controllerAs: '$mentionSelectCtrl',
      compile: function (tElem) {
        tElem.removeAttr('coyo-mention-select');
        tElem.attr('mentio', '');
        tElem.attr('mentio-trigger-char', '\'@\'');
        tElem.attr('mentio-typed-text', 'query');
        tElem.attr('mentio-require-leading-space', 'true');
        tElem.attr('mentio-select', '$mentionSelectCtrl.select(item)');
        tElem.attr('mentio-search', '$mentionSelectCtrl.search(term)');
        tElem.attr('mentio-template-url', 'app/commons/ui/components/mention/mention-select.html');
        tElem.attr('mentio-items', '$mentionSelectCtrl.data');
        tElem.attr('ng-trim', 'false');

        return function (scope) {
          $compile(tElem)(scope);
        };
      }
    };
  }

  function MentionSelectController(UserModel, UserSubscriptionModel, Pageable, authService) {
    var vm = this;

    vm.data = [];

    vm.search = search;
    vm.select = select;

    function search(term) {
      var pageable = new Pageable(0, 8, 'displayName.sort');
      var searchFields = ['displayName'];
      var aggregations = [];

      var promise, filters;
      if (term) {
        filters = [];
        promise = UserModel.searchWithFilter(term.toLowerCase(), pageable, filters, searchFields, aggregations);
      } else {
        filters = {type: ['user']};
        promise = authService.getUser().then(function (user) {
          return UserSubscriptionModel.searchWithFilter(user.id, term, pageable, filters, searchFields, aggregations);
        });
      }

      promise.then(function (result) {
        vm.data = result.content;
      });
    }

    function select(item) {
      return '@' + item.slug;
    }
  }

})(angular);
