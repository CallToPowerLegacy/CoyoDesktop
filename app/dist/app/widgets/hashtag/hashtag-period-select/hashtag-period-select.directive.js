(function () {
  'use strict';

  angular
      .module('coyo.widgets.hashtag')
      .component('oyocHashtagPeriodSelect', hashtagPeriodSelect())
      .controller('HashtagPeriodSelectController', HashtagPeriodSelectController);

  /**
   * @ngdoc directive
   * @name coyo.widgets.hashtag.oyocHashtagPeriodSelect:oyocHashtagPeriodSelect
   * @element OWN
   * @restrict E
   * @scope
   *
   * @description Renders a select-component to pick a period for the hashtag cloud.
   *
   * @param {object} setting the settings for the notification-channel
   *
   */
  function hashtagPeriodSelect() {
    return {
      templateUrl: 'app/widgets/hashtag/hashtag-period-select/hashtag-period-select.html',
      bindings: {
        ngModel: '='
      },
      controller: 'HashtagPeriodSelectController'
    };
  }

  function HashtagPeriodSelectController() {
    var vm = this;

    vm.items = [
      {value: 'ONE_DAY', name: 'WIDGET.HASHTAG.SETTINGS.PERIOD.ONE_DAY'},
      {value: 'ONE_WEEK', name: 'WIDGET.HASHTAG.SETTINGS.PERIOD.ONE_WEEK'},
      {value: 'TWO_WEEKS', name: 'WIDGET.HASHTAG.SETTINGS.PERIOD.TWO_WEEKS'},
      {value: 'ONE_MONTH', name: 'WIDGET.HASHTAG.SETTINGS.PERIOD.ONE_MONTH'},
      {value: 'TWO_MONTHS', name: 'WIDGET.HASHTAG.SETTINGS.PERIOD.TWO_MONTHS'},
      {value: 'THREE_MONTHS', name: 'WIDGET.HASHTAG.SETTINGS.PERIOD.THREE_MONTHS'},
      {value: 'SIX_MONTHS', name: 'WIDGET.HASHTAG.SETTINGS.PERIOD.SIX_MONTHS'},
      {value: 'ONE_YEAR', name: 'WIDGET.HASHTAG.SETTINGS.PERIOD.ONE_YEAR'},
      {value: '', name: 'WIDGET.HASHTAG.SETTINGS.PERIOD.UNLIMITED'}
    ];
  }

})();
