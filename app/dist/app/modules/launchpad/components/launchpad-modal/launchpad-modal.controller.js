(function () {
  'use strict';

  angular
      .module('coyo.launchpad')
      .controller('LaunchpadModalController', LaunchpadModalController);

  function LaunchpadModalController(tempUploadService, LaunchpadCategoryModel, LaunchpadLinkModel, backendUrlService, coyoEndpoints) {
    var vm = this;

    vm.toEdit;
    vm.toggleEdit = toggleEdit;
    vm.changeIcon = changeIcon;
    vm.addNew = addNew;
    vm.getIconUrl = getIconUrl;
    vm.deleteLink = deleteLink;
    vm.saveLink = saveLink;

    vm.loading = true;
    vm.categories = [];

    function toggleEdit(link, event) {
      event.preventDefault();
      vm.toEdit = link;
    }

    function saveLink() {
      var category = _.find(vm.categories, function (c) { return _.includes(c.links, vm.toEdit); });
      vm.toEdit.saveOrUpdate(category).then(function () {
        vm.toEdit = null;
      });
    }

    function changeIcon(link) {
      tempUploadService.upload(link.iconToUpload, 300).then(function (blob) {
        link.newIconUid = blob.uid;
        link.newIconContentType = blob.contentType;
      });
    }

    function addNew(category) {
      var link = new LaunchpadLinkModel({ownerId: category.id});
      category.links.push(link);
      vm.toEdit = link;
    }

    function getIconUrl(link) {
      var category = _.find(vm.categories, function (c) { return _.includes(c.links, link); });
      return backendUrlService.getUrl() + coyoEndpoints.launchpad.icons.replace('{owner}', category.id)
          .replace('{id}', link.id) + '?modified=' + link.modified;
    }

    function deleteLink() {
      var category = _.find(vm.categories, function (c) { return _.includes(c.links, vm.toEdit); });
      if (vm.toEdit.id) {
        vm.toEdit.delete(category).then(function () {
          _removeLink(vm.toEdit, category);
        });
      } else {
        _removeLink(vm.toEdit, category);
      }
    }

    function _removeLink(link, category) {
      _.remove(category.links, link);
      vm.toEdit = null;
    }

    (function init() {
      LaunchpadCategoryModel.getWithPermissions(null, null, ['manage']).then(function (data) {
        vm.categories = data;
        vm.loading = false;
      });
    })();
  }
})();
