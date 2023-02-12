(function (angular) {
  'use strict';

  angular
      .module('coyo.admin.userDirectories.ldap', [
        'coyo.base',
        'coyo.domain',
        'coyo.admin.userDirectories.api',
        'commons.i18n.custom'
      ])
      .config(registerLdap)
      .config(registerAd);

  function registerLdap(userDirectoryTypeRegistryProvider) {
    userDirectoryTypeRegistryProvider.register({
      key: 'ldap',
      name: 'ADMIN.USER_DIRECTORIES.LDAP.NAME',
      description: 'ADMIN.USER_DIRECTORIES.LDAP.DESCRIPTION',
      directive: 'oyoc-ldap-settings'
    });
  }

  function registerAd(userDirectoryTypeRegistryProvider) {
    userDirectoryTypeRegistryProvider.register({
      key: 'ad',
      name: 'ADMIN.USER_DIRECTORIES.AD.NAME',
      description: 'ADMIN.USER_DIRECTORIES.AD.DESCRIPTION',
      directive: 'oyoc-ldap-settings'
    });
  }

})(angular);
