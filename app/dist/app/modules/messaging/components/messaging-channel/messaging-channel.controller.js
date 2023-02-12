(function (angular) {
  'use strict';

  angular
      .module('coyo.messaging')
      .controller('MessagingChannelController', MessagingChannelController);

  function MessagingChannelController($scope, socketService, MessageModel, Pageable, tempUploadService,
                                      backendUrlService, coyoEndpoints) {
    var vm = this;

    vm.messages = [];
    vm.saving = false;
    vm.backendUrl = backendUrlService.getUrl();
    vm.previewUrl = coyoEndpoints.messaging.preview;

    var unsubscribeFn = socketService.subscribe('/user/topic/messaging', _handleNewMessage, 'messageCreated');

    $scope.$on('$destroy', unsubscribeFn);
    $scope.$on('$destroy', _sendReadPing);

    _resetNewMessage();

    loadMore();

    vm.isUploading = isUploading;
    vm.submitMessage = submitMessage;
    vm.messageFormFieldKeyDown = messageFormFieldKeyDown;
    vm.loadMore = loadMore;
    vm.addAttachments = addAttachments;
    vm.removeAttachment = removeAttachment;

    // ------------------------------------------------------------------------

    /**
     * Resets the new message form.
     */
    function _resetNewMessage() {
      vm.newMessage = new MessageModel({
        userId: vm.currentUser.id,
        channelId: vm.channel.id,
        attachments: [],
        data: {
          message: ''
        },
        animate: true // triggers animation when item is rendered
      });
      vm.newMessageAttachments = [];
    }

    /**
     * Handles a new incoming message via socket.
     *
     * @param {object} event Socket event
     */
    function _handleNewMessage(event) {
      if (event.content.channelId === vm.channel.id) {
        $scope.$apply(function () {
          event.content.animate = true;
          vm.messages.push(new MessageModel(event.content));
          _sendReadPing();
        });
      }
    }

    /**
     * Informs the backend via socket that the user has read in the channel.
     */
    function _sendReadPing() {
      socketService.sendTo('/app/user.' + vm.currentUser.id + '.messaging.channel.' + vm.channel.id + '.read');
    }

    /**
     * Saves the new message
     */
    function _saveMessage(setFocus) {
      if (!vm.newMessage.data.message && !vm.newMessageAttachments.length && !vm.isUploading()) {
        return;
      }

      vm.focusMessageFormField = false;
      vm.saving = true;

      vm.newMessage.attachments = _.map(_.filter(vm.newMessageAttachments, {
        uploading: false,
        progress: 100
      }), function (attachment) {
        return {
          name: attachment.name,
          uid: attachment.uid,
          contentType: attachment.contentType
        };
      });

      vm.newMessage.create().then(_resetNewMessage).finally(function () {
        vm.saving = false;
        if (setFocus) {
          vm.focusMessageFormField = true;
        }

        // Scroll to bottom of messages container
        // additional angular-scroll-glue scrolling to the bottom of chat on first init
        var objDiv = document.getElementById('message-scrolling-container');  // eslint-disable-line angular/document-service
        if (objDiv) {
          objDiv.scrollTop = objDiv.scrollHeight;
        }
      });
    }

    // ------------------------------------------------------------------------

    function isUploading() {
      if (!vm.newMessageAttachments.length) {
        return false;
      }

      return _.some(vm.newMessageAttachments, {uploading: true});
    }

    function submitMessage(event) {
      event.preventDefault();
      _saveMessage(false);
    }

    function messageFormFieldKeyDown($event) {
      if ($event.keyCode === 13 && !$event.shiftKey) {
        $event.preventDefault();
        if (!vm.saving && !$event.ctrlKey && !$event.shiftKey) {
          _saveMessage(true);
        }
      }
    }

    function loadMore() {
      if (!vm.loading && (!vm.currentPage || vm.messages.length < vm.currentPage.totalElements)) {
        vm.loading = true;

        var pageSize = (_.isEmpty(vm.messages)) ? 30 : 10;
        var pageable = new Pageable(0, pageSize, 'created,desc', vm.messages.length);

        MessageModel.pagedQuery(pageable, {}, {
          channelId: vm.channel.id,
          userId: vm.currentUser.id
        }).then(function (page) {
          if (!vm.currentPage) {
            vm.focusMessageFormField = true;
          }
          vm.currentPage = page;
          vm.messages.unshift.apply(vm.messages, page.content.reverse());
          _sendReadPing();
        }).finally(function () {
          vm.loading = false;
        });
      }
    }

    function addAttachments(files) {
      vm.newMessageAttachments.push.apply(vm.newMessageAttachments, files);

      angular.forEach(files, function (file) {
        tempUploadService.upload(file, 300).then(function (blob) {
          angular.extend(file, blob);
        }).catch(function () {
          removeAttachment(file);
        });
      });
      vm.focusMessageFormField = true;
    }

    function removeAttachment(file) {
      vm.newMessageAttachments = _.reject(vm.newMessageAttachments, file);
      vm.focusMessageFormField = true;
    }
  }
})(angular);
