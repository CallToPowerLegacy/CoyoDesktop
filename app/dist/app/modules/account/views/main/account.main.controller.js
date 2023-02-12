(function (angular) {
  'use strict';

  angular
      .module('coyo.account')
      .controller('AccountMainController', AccountMainController);

  /**
   * Controller for the account view
   */
  function AccountMainController($scope, modalService, coyoNotification, coyoConfig, authService,
                                 userService, pushDevicesService, currentUser, passwordPattern, pushDevices) {
    var vm = this;

    vm.deviceTypes = coyoConfig.pushDevices.types;

    vm.openChangeNameModal = openChangeNameModal;
    vm.openLanguageModal = openLanguageModal;
    vm.openTimeZoneModal = openTimeZoneModal;
    vm.openChangeEmailAddressModal = openChangeEmailAddressModal;
    vm.openChangePasswordModal = openChangePasswordModal;
    vm.togglePushDevice = togglePushDevice;
    vm.removePushDevice = removePushDevice;
    vm.openPushDevicesModal = openPushDevicesModal;

    authService.onGlobalPermissions('MANAGE_USER', function (canManageUser) {
      vm.canManageUser = canManageUser;
    });

    function openChangeNameModal(size) {
      if (!vm.canManageUser || vm.data.account.remoteUser) {
        return;
      }
      modalService.open({
        size: size,
        templateUrl: 'app/modules/account/components/modals/changeName.modal.html',
        resolve: {
          firstName: function () {
            return vm.data.account.firstname;
          },
          lastName: function () {
            return vm.data.account.lastname;
          }
        },
        controller: /*@ngInject*/ function ($uibModalInstance, firstName, lastName) {
          var vm = this;

          vm.firstName = firstName;
          vm.lastName = lastName;

          vm.submit = submit;

          function submit(form, firstName, lastName) {
            if (form && form.$valid) {
              userService.setUserName(currentUser, firstName, lastName).then(function (user) {
                $uibModalInstance.close(user);
              }).catch(function () {
                $uibModalInstance.dismiss();
              });
            }
          }
        }
      }).result.then(function (user) {
        vm.data.account = user;
        coyoNotification.success('MODULE.ACCOUNT.NOTIFICATIONS.NAME.SUCCESS');
      });
    }

    /**
     * Opens a modal for language selection.
     *
     * @param {string} size The size of the modal
     */
    function openLanguageModal(size) {
      if (!vm.canManageUser) {
        return;
      }
      modalService.open({
        size: size,
        templateUrl: 'app/modules/account/components/modals/changeLanguage.modal.html',
        resolve: {
          currentLang: function () {
            return vm.data.account.language;
          }
        },
        controller: /*@ngInject*/ function ($uibModalInstance, currentLang) {
          var vm = this;

          vm.language = currentLang;

          vm.submit = submit;

          function submit(language) {
            if (currentLang === language) {
              $uibModalInstance.dismiss();
            } else {
              userService.setUserLanguage(currentUser, language).then(function () {
                $uibModalInstance.close(language);
              }).catch(function () {
                $uibModalInstance.dismiss();
              });
            }
          }
        }
      }).result.then(function (language) {
        vm.data.account.language = language;
        coyoNotification.success('MODULE.ACCOUNT.NOTIFICATIONS.LANGUAGE.SUCCESS');
      });
    }

    /**
     * Opens a modal for time zone selection.
     *
     * @param {string} size The size of the modal
     */
    function openTimeZoneModal(size) {
      if (!vm.canManageUser) {
        return;
      }
      modalService.open({
        size: size,
        templateUrl: 'app/modules/account/components/modals/changeTimeZone.modal.html',
        resolve: {
          currentZone: function () {
            return vm.data.account.timezone;
          }
        },
        controller: /*@ngInject*/ function ($uibModalInstance, currentZone) {
          var vm = this;

          vm.timeZone = currentZone;

          vm.submit = submit;

          function submit(timeZone) {
            if (currentZone === timeZone) {
              $uibModalInstance.dismiss();
            } else {
              userService.setUserTimeZone(currentUser, timeZone).then(function () {
                $uibModalInstance.close(timeZone);
              }).catch(function () {
                $uibModalInstance.dismiss();
              });
            }
          }
        }
      }).result.then(function (timeZone) {
        vm.data.account.timezone = timeZone;
        coyoNotification.success('MODULE.ACCOUNT.NOTIFICATIONS.TIMEZONE.SUCCESS');
      });
    }

    /**
     * Opens a Coyo custom modal for changing the email address
     *
     * @param {string} size The size of the modal
     */
    function openChangeEmailAddressModal(size) {
      if (!vm.canManageUser || vm.data.account.remoteUser) {
        return;
      }
      modalService.open({
        size: size,
        templateUrl: 'app/modules/account/components/modals/changeEmailAddress.modal.html',
        resolve: {
          currentEmailAddress: function () {
            return vm.data.account.email;
          },
          emailPattern: /*@ngInject*/ function (SettingsModel) {
            return SettingsModel.retrieveByKey('emailPattern');
          }
        },
        controller: /*@ngInject*/ function ($uibModalInstance, currentEmailAddress, emailPattern) {
          var vm = this;

          vm.emailPattern = emailPattern;
          vm.currentEmailAddress = currentEmailAddress;
          vm.status = {
            loading: false,
            error: false
          };

          vm.submit = submit;

          function submit(newEmailAddress) {
            vm.status.loading = true;
            return userService.changeEmail(currentUser, newEmailAddress).then(function () {
              vm.status.error = false;
              $uibModalInstance.close();
            }).finally(function () {
              vm.status.loading = false;
            });
          }
        }
      }).result.then(function () {
        coyoNotification.success('MODULE.ACCOUNT.MODALS.CHANGE_EMAIL_ADDRESS.MESSAGES.CONFIRMATION');
      });
    }

    /**
     * Opens a modal for password change.
     *
     * @param {string} size The size of the modal
     */
    function openChangePasswordModal(size) {
      if (!vm.canManageUser) {
        return;
      }
      modalService.open({
        size: size,
        templateUrl: 'app/modules/account/components/modals/changePassword.modal.html',
        controller: /*@ngInject*/ function ($uibModalInstance) {
          var vm = this;

          vm.passwordPattern = passwordPattern;
          vm.inputTypes = {
            oldPassword: 'password',
            newPassword: 'password',
            confirmPassword: 'password'
          };
          vm.status = {
            loading: false
          };

          vm.submit = submit;

          function submit(oldPassword, newPassword) {
            vm.status.loading = true;
            return userService.setUserPassword(currentUser, oldPassword, newPassword).then(function () {
              $uibModalInstance.close();
            }).finally(function () {
              vm.status.loading = false;
            });
          }
        }
      }).result.then(function () {
        coyoNotification.success('PASSWORD.CHANGE.SUCCESS');
      });
    }

    /**
     * Toggle the active state of the given device.
     *
     * @param {object} device The device to toggle
     */
    function togglePushDevice(device) {
      if (!vm.canManageUser) {
        return;
      }
      if (!vm.deviceToggle) {
        vm.deviceToggle = true;
        pushDevicesService.togglePushDevice(currentUser, device).then(function () {
          device.active = !device.active;
        }).finally(function () {
          vm.deviceToggle = false;
        });
      }
    }

    /**
     * Opens a modal for push device removal.
     *
     * @param {object} device The device to remove
     * @param {string} size The size of the modal.
     */
    function removePushDevice(device, size) {
      if (!vm.canManageUser) {
        return;
      }
      modalService.confirm({
        size: size,
        title: 'MODULE.ACCOUNT.MODALS.PUSH_DEVICES.REMOVE.TITLE',
        text: 'MODULE.ACCOUNT.MODALS.PUSH_DEVICES.REMOVE.TEXT',
        close: {title: 'MODULE.ACCOUNT.MODALS.PUSH_DEVICES.REMOVE.YES'},
        dismiss: {title: 'MODULE.ACCOUNT.MODALS.PUSH_DEVICES.REMOVE.NO'}
      }).result.then(function () {
        pushDevicesService.deletePushDevice(currentUser, device).then(function () {
          vm.data.devices = _.without(vm.data.devices, device);
        });
      });
    }

    /**
     * Opens a Coyo custom modal displaying the push devices
     *
     * @param {string} size The size of the modal
     */
    function openPushDevicesModal(size) {
      modalService.open({
        size: size,
        templateUrl: 'app/modules/account/components/modals/showPushDevices.modal.html',
        resolve: {
          pushDevices: function () {
            return vm.data.devices;
          }
        },
        controller: /*@ngInject*/ function ($log, $uibModalInstance, pushDevices) {
          var vmModal = this; // eslint-disable-line angular/controller-as-vm

          vmModal.devices = pushDevices;
          vmModal.deviceTypes = coyoConfig.pushDevices.types;

          vmModal.togglePushDevice = togglePushDevice;
          vmModal.removePushDevice = removePushDevice;

          /**
           * Toggle the active state of the given device.
           *
           * @param {object} device The device to toggle
           */
          function togglePushDevice(device) {
            if (!vm.canManageUser) {
              return;
            }
            $log.debug('[PushDevicesCtrl] Toggling active state of device', device);
            pushDevicesService.togglePushDevice(currentUser, device).then(function () {
              device.active = !device.active;
            });
          }

          /**
           * Removes the given device.
           *
           * @param {object} device The device to remove
           */
          function removePushDevice(device) {
            if (!vm.canManageUser) {
              return;
            }
            pushDevicesService.deletePushDevice(currentUser, device).then(function () {
              vmModal.devices = _.without(vmModal.devices, device);
              vm.data.devices = vmModal.devices;
            });
          }
        }
      });
    }

    (function _init() {
      vm.data = {
        account: currentUser,
        devices: pushDevices
      };
    })();
  }

})(angular);
