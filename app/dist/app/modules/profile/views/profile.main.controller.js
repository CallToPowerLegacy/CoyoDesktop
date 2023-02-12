(function (angular) {
  'use strict';

  angular
      .module('coyo.profile')
      .controller('ProfileMainController', ProfileMainController);

  /**
   * Controller for the users profile
   */
  function ProfileMainController($rootScope, $scope, authService, messagingService, coyoNotification, senderService, userService, UserModel,
                                 currentUser, user, profileFieldGroups, linkPattern, emailPattern, phonePattern) {
    var vm = this;
    vm.currentUser = currentUser;
    vm.linkPattern = linkPattern;
    vm.emailPattern = emailPattern;
    vm.phonePattern = phonePattern;

    vm.onSubmit = onSubmit;
    vm.onCancel = onCancel;
    vm.changeAvatar = function (sender) {
      senderService.changeAvatar({title: 'MODULE.PROFILE.MODALS.CHANGE_AVATAR.TITLE', areaType: 'circle'})(sender).then(function () {
        if (sender.id === currentUser.id) {
          authService.getUser(true);
        }
      });
    };

    vm.changeCover = senderService.changeCover({title: 'MODULE.PROFILE.MODALS.CHANGE_BG_IMAGE.TITLE'});
    vm.startConversation = messagingService.start;

    // ---------------------- PUBLIC METHODS ------------------------

    function onSubmit(group) {
      group.saving = true;

      // just send the fields of the changed group
      var fields = {};
      _.forEach(group.fields, function (field) {
        var fieldName = field.name;
        fields[fieldName] = vm.user.properties[fieldName];
      });

      return userService.setProfileFields(vm.user, group, fields).then(function () {
        $scope.$broadcast('coyo.base:coyoDelayForm-refreshModel', vm.user.properties);
        group.editMode = false;
      }).catch(function () {
        coyoNotification.error('MODULE.PROFILE.NOTIFICATIONS.SAVE_PROFILE_FIELDS_FAILED');
      }).finally(function () {
        group.saving = false;
      });
    }

    function onCancel() {
      return UserModel.getWithPermissions({id: vm.user.id}, {}, ['manage']).then(_initUserData);
    }

    // ---------------------------- INIT ----------------------------

    function _initFieldData(profileFieldGroups) {
      vm.profileGroups = [];

      // prepare the groups and its fields
      _.forEach(profileFieldGroups, function (group) {
        group.editMode = false;
        group.saving = false;
        vm.profileGroups.push(group);
      });

      // sort profile groups
      vm.profileGroups.sort(function (group1, group2) {
        if ((!group1.hasOwnProperty('sortOrder') || !group2.hasOwnProperty('sortOrder')) ||
            group1.sortOrder === group2.sortOrder) {
          return 0;
        }
        return group1.sortOrder < group2.sortOrder ? -1 : 1;
      });

      // group the groups for the template
      vm.groupList = [];
      var innerGroupList = [];
      _.forEach(vm.profileGroups, function (group, g) {
        innerGroupList.push(group);
        if ((g % 2 !== 0) || (g === vm.profileGroups.length - 1)) {
          vm.groupList.push(innerGroupList);
          innerGroupList = [];
        }
      });
    }

    function _initUserData(user) {
      vm.user = user;
      vm.user.onlineStatus = true;
      if (!vm.user.properties) {
        vm.user.properties = {};
      }

      // prepare the groups and its fields
      _.forEach(vm.profileGroups, function (group) {
        _.forEach(group.fields, function (field) {
          vm.user.properties[field.name] = _.getNullUndefined(vm.user.properties, field.name, '');
        });
      });

      return vm.user;
    }

    (function _init() {
      _initFieldData(profileFieldGroups);
      _initUserData(user);

      // refresh current user on event
      var unsubscribe = $rootScope.$on('currentUser:updated', function (event, currentUser) {
        if (vm.user.id === currentUser.id) {
          _initUserData(currentUser);
        }
      });
      $scope.$on('$destroy', unsubscribe);
    })();
  }

})(angular);
