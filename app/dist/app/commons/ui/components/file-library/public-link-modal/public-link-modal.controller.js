(function () {
  'use strict';

  angular
      .module('commons.ui')
      .controller('PublicLinkModalController', PublicLinkModalController);

  function PublicLinkModalController(FilePublicLinkModel, senderId, fileId, link) {
    var vm = this;

    vm.loading = false;
    vm.link = link;

    vm.createOrRecreate = createOrRecreate;
    vm.toggleActivate = toggleActivate;

    function createOrRecreate(link) {
      vm.loading = true;
      return (link
        ? FilePublicLinkModel.recreate(vm.link)
        : FilePublicLinkModel.create(senderId, fileId)
      ).then(_onSuccess).finally(_onFinally);
    }

    function toggleActivate() {
      vm.loading = true;
      return FilePublicLinkModel[vm.link.active ? 'deactivate' : 'activate'](vm.link)
          .then(_onSuccess).finally(_onFinally);
    }

    function _onSuccess(link) {
      vm.link = link;
    }

    function _onFinally() {
      vm.loading = false;
    }
  }

})();
