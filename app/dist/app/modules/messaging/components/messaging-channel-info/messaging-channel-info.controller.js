(function (angular) {
  'use strict';

  angular
      .module('coyo.messaging')
      .controller('MessagingChannelInfoController', MessagingChannelInfoController);

  function MessagingChannelInfoController(MessageAttachmentModel, MessageChannelMemberModel, Pageable,
                                          backendUrlService) {
    var vm = this;

    vm.memberLimit = 10;
    vm.attachmentData = {
      attachments: [],
      currentPage: null
    };
    vm.backendUrl = backendUrlService.getUrl();

    loadMoreAttachments();

    vm.loadMoreAttachments = loadMoreAttachments;
    vm.deleteMember = deleteMember;
    vm.toggleMemberRole = toggleMemberRole;

    // ------------------------------------------------------------------------------------------------------

    function loadMoreAttachments() {
      if (!vm.loading && (!vm.attachmentData.currentPage || !vm.attachmentData.currentPage.last)) {
        vm.loading = true;

        var nextPage = (vm.attachmentData.currentPage ? vm.attachmentData.currentPage.number + 1 : 0);

        MessageAttachmentModel.pagedQuery(new Pageable(nextPage, 20, 'created,desc'), {}, {
          channelId: vm.channel.id
        }).then(function (page) {
          vm.attachmentData.currentPage = page;
          vm.attachmentData.attachments.push.apply(vm.attachmentData.attachments, page.content);
        }).finally(function () {
          vm.loading = false;
        });
      }
    }

    function deleteMember(userId) {
      new MessageChannelMemberModel({
        channelId: vm.channel.id,
        id: userId
      }).delete();
    }

    function toggleMemberRole(member) {
      new MessageChannelMemberModel({
        channelId: vm.channel.id,
        id: member.user.id,
        role: member.role === 'MEMBER' ? 'ADMIN' : 'MEMBER'
      }).update();
    }

  }
})(angular);
