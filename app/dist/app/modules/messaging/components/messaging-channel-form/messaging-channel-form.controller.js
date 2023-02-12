(function (angular) {
  'use strict';

  angular
      .module('coyo.messaging')
      .controller('MessagingChannelFormController', MessagingChannelFormController);

  /**
   * Controller for creating or editing a message channel.
   */
  function MessagingChannelFormController(MessageChannelModel, UserModel, Pageable) {
    var vm = this;

    vm.userSearchTerm = '';
    vm.userOptions = [];
    vm.focusUserSearchTerm = true;
    vm.focusSubject = true;

    if (vm.channel) {
      if (vm.channel.type !== 'GROUP') {
        vm.msgSidebar.home();
      }

      vm.channel.members = _.filter(vm.channel.members, function (member) { return member.deleted !== true; });

      vm.userOptionsVisible = false;
    } else {
      vm.channel = new MessageChannelModel({
        creatorId: vm.currentUser.id,
        type: 'SINGLE',
        name: '',
        members: []
      });

      vm.userOptionsVisible = true;
      loadUserOptions();
    }

    vm.loadUserOptions = loadUserOptions;
    vm.addUser = addUser;
    vm.removeUser = removeUser;
    vm.isMember = isMember;
    vm.toggleMembership = toggleMembership;
    vm.showUserOptions = showUserOptions;
    vm.hideUserOptions = hideUserOptions;
    vm.createChannel = createChannel;
    vm.nameKeyDown = nameKeyDown;
    vm.addCurrentUser = addCurrentUser;

    // ------------------------------------------------------------------------------------------------

    function loadUserOptions() {
      vm.loading = true;
      vm.userOptionsVisible = true;

      // TODO: Load subscribed users of current user initially
      UserModel.searchWithFilter(vm.userSearchTerm, new Pageable(0, 50, 'lastname.sort,firstname.sort')).then(function (page) {
        vm.userOptions = _.differenceBy(_.reject(page.content, {'id': vm.currentUser.id}), vm.channel.members, 'id');
      }).finally(function () {
        vm.loading = false;
      });
    }

    function toggleMembership(user) {
      if (isMember(user)) {
        removeUser(user);
      } else {
        addUser(user);
      }
    }

    function addUser(user) {
      if (!isMember(user)) {
        vm.channel.members.push({user: user});
      }

      if (vm.channel.type === 'SINGLE') {
        createChannel();
      } else {
        hideUserOptions(true);
      }
    }

    function removeUser(user) {
      vm.channel.members = _.reject(vm.channel.members, {user: {id: user.id}});
      vm.focusUserSearchTerm = true;
      if (!vm.channel.members.length) {
        loadUserOptions();
      }
      hideUserOptions(true);
    }

    function isMember(user) {
      return _.some(vm.channel.members, {user: {id: user.id}});
    }

    function showUserOptions() {
      vm.userOptionsVisible = true;
      if (!vm.userOptions.length) {
        loadUserOptions();
      }
    }

    function hideUserOptions(clearSearch) {
      vm.userOptionsVisible = false;

      if (clearSearch) {
        vm.userSearchTerm = '';
        vm.focusUserSearchTerm = true;
        vm.userOptions = [];
      }
    }

    function createChannel() {
      if (vm.channel.type === 'GROUP' && (_.isEmpty(vm.channel.name) || !vm.channel.members.length)) {
        return;
      }

      vm.saving = true;
      vm.channel.memberIds = _.map(vm.channel.members, 'user.id');
      vm.channel.save(true).then(function (channel) {
        vm.channel = channel;
        vm.msgSidebar.openChannel(channel);
      }).finally(function () {
        vm.saving = false;
      });
    }

    function nameKeyDown($event) {
      if ($event.keyCode === 13) {
        createChannel();
      }
    }

    function addCurrentUser($event) {
      if ($event.keyCode === 13 && !!vm.userOptions.length) {
        addUser(vm.userOptions[0]);
      }
    }
  }

})(angular);
