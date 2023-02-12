(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.poll')
      .controller('PollWidgetVotersController', PollWidgetVotersController);

  function PollWidgetVotersController(PollWidgetModel, Pageable, widget, optionId) {
    var vm = this;
    vm.voters = [];
    vm.loadMore = loadMore;
    vm.$onInit = _init;

    function loadMore() {
      if (!vm.currentPage || !vm.currentPage.last) {
        vm.loading = true;

        var pageable = new Pageable((vm.currentPage ? vm.currentPage.number + 1 : 0), 20, 'created,desc');
        PollWidgetModel.loadVoters(widget._id, optionId, pageable).then(function (page) {
          vm.currentPage = page;
          vm.voters = vm.voters.concat(page.content);
        }).finally(function () {
          vm.loading = false;
        });
      }
    }

    function _init() {
      loadMore();
    }
  }
})(angular);
