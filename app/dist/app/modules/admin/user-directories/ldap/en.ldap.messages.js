(function (angular) {
  'use strict';

  angular
      .module('coyo.admin.userDirectories.ldap')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('en', {
          "ADMIN.USER_DIRECTORIES.AD.NAME": "Active Directory",
          "ADMIN.USER_DIRECTORIES.AD.DESCRIPTION": "Microsoft Active Directory",
          "ADMIN.USER_DIRECTORIES.LDAP.NAME": "LDAP",
          "ADMIN.USER_DIRECTORIES.LDAP.DESCRIPTION": "Lightweight Directory Access Protocol",
          "ADMIN.USER_DIRECTORIES.LDAP.TABS.CONNECTION.HEADING": "Connection",
          "ADMIN.USER_DIRECTORIES.LDAP.TABS.CONNECTION.INVALID": "Invalid connection settings",
          "ADMIN.USER_DIRECTORIES.LDAP.TABS.USER.HEADING": "User",
          "ADMIN.USER_DIRECTORIES.LDAP.TABS.USER.INVALID": "Invalid user field mappings",
          "ADMIN.USER_DIRECTORIES.LDAP.TABS.GROUP.HEADING": "Groups",
          "ADMIN.USER_DIRECTORIES.LDAP.TABS.GROUP.INVALID": "Invalid group field mappings",
          "ADMIN.USER_DIRECTORIES.LDAP.TABS.SYNC.HEADING": "Synchronization",
          "ADMIN.USER_DIRECTORIES.LDAP.TABS.SYNC.INVALID": "Invalid synchronization settings",
          "ADMIN.USER_DIRECTORIES.LDAP.TABS.SCHEDULING.HEADING": "Scheduling",
          "ADMIN.USER_DIRECTORIES.LDAP.TABS.SCHEDULING.INVALID": "Invalid scheduling settings",
          "ADMIN.USER_DIRECTORIES.LDAP.CONNECTION.BUTTON.TEST_CONNECTION": "Test Connection",
          "ADMIN.USER_DIRECTORIES.LDAP.CONNECTION.LABEL.ACTIVE_DIRECTORY": "Active Directory",
          "ADMIN.USER_DIRECTORIES.LDAP.CONNECTION.LABEL.ACTIVE_DIRECTORY.HELP": "The LDAP server is a Microsoft Active Directory server",
          "ADMIN.USER_DIRECTORIES.LDAP.CONNECTION.DOMAIN.LABEL": "AD Domain",
          "ADMIN.USER_DIRECTORIES.LDAP.CONNECTION.DOMAIN.PLACEHOLDER": "company.com",
          "ADMIN.USER_DIRECTORIES.LDAP.CONNECTION.HOST.LABEL": "Hostname",
          "ADMIN.USER_DIRECTORIES.LDAP.CONNECTION.PASSWORD.LABEL": "Password",
          "ADMIN.USER_DIRECTORIES.LDAP.CONNECTION.PASSWORD.HINT": "Only required for password changes",
          "ADMIN.USER_DIRECTORIES.LDAP.CONNECTION.PORT.LABEL": "Port",
          "ADMIN.USER_DIRECTORIES.LDAP.CONNECTION.REFERRALS.LABEL": "Follow referrals",
          "ADMIN.USER_DIRECTORIES.LDAP.CONNECTION.REFERRALS.HELP": "Follow referrals to other servers",
          "ADMIN.USER_DIRECTORIES.LDAP.CONNECTION.SSL.LABEL": "SSL",
          "ADMIN.USER_DIRECTORIES.LDAP.CONNECTION.SSL.HELP": "activate",
          "ADMIN.USER_DIRECTORIES.LDAP.CONNECTION.USERNAME.LABEL": "Username",
          "ADMIN.USER_DIRECTORIES.LDAP.CONNECTION.USERNAME.HELP": "Username or bind DN for authentication. E.g. cn=admin,dc=example,dc=org",
          "ADMIN.USER_DIRECTORIES.LDAP.CONNECTION.USERNAME.PLACEHOLDER": "cn=admin,dc=company,dc=com",
          "ADMIN.USER_DIRECTORIES.LDAP.CONNECTION.BASE_DN.LABEL": "Base DN",
          "ADMIN.USER_DIRECTORIES.LDAP.CONNECTION.BASE_DN.HELP": "Root node in LDAP from which to search for users or groups",
          "ADMIN.USER_DIRECTORIES.LDAP.CONNECTION.BASE_DN.PLACEHOLDER": "ou=department,dc=company,dc=com",
          "ADMIN.USER_DIRECTORIES.LDAP.USER.USER_DN.LABEL": "Additional user DN",
          "ADMIN.USER_DIRECTORIES.LDAP.USER.USER_DN.HELP": "Prepended to the base DN to limit the scope when searching for users or groups",
          "ADMIN.USER_DIRECTORIES.LDAP.USER.OBJECT_CLASS.LABEL": "User object class",
          "ADMIN.USER_DIRECTORIES.LDAP.USER.OBJECT_CLASS.HELP": "User object class",
          "ADMIN.USER_DIRECTORIES.LDAP.USER.OBJECT_CLASS.PLACEHOLDER": "person",
          "ADMIN.USER_DIRECTORIES.LDAP.USER.OBJECT_FILTER.LABEL": "User object filter",
          "ADMIN.USER_DIRECTORIES.LDAP.USER.ATTRIBUTE_FOR.LABEL": "Attributes for",
          "ADMIN.USER_DIRECTORIES.LDAP.USER.PROFILE_FIELDS.LABEL": "Profile fields",
          "ADMIN.USER_DIRECTORIES.LDAP.USER.PROFILE_FIELDS.ADD": "Add Profile Field Mapping",
          "ADMIN.USER_DIRECTORIES.LDAP.USER.PROFILE_FIELDS.HELP": "Add additional mappings to user profile fields. Mapped profile fields should be configured as 'immutable'.",
          "ADMIN.USER_DIRECTORIES.LDAP.USER.PROFILE_FIELDS.FIELD_TYPE.CHECKBOX": "Checkbox field",
          "ADMIN.USER_DIRECTORIES.LDAP.USER.PROFILE_FIELDS.FIELD_TYPE.TEXT": "Text field",
          "ADMIN.USER_DIRECTORIES.LDAP.USER.PROFILE_FIELDS.FIELD_TYPE.TEXTAREA": "Textarea",
          "ADMIN.USER_DIRECTORIES.LDAP.USER.PROFILE_FIELDS.FIELD_TYPE.DATE": "Date field",
          "ADMIN.USER_DIRECTORIES.LDAP.USER.PROFILE_FIELDS.FIELD_TYPE.OPTIONS": "Options field",
          "ADMIN.USER_DIRECTORIES.LDAP.USER.PROFILE_FIELDS.FIELD_TYPE.LINK": "Link field",
          "ADMIN.USER_DIRECTORIES.LDAP.USER.PROFILE_FIELDS.FIELD_TYPE.EMAIL": "Email address field",
          "ADMIN.USER_DIRECTORIES.LDAP.USER.PROFILE_FIELDS.FIELD_TYPE.PHONE": "Phone number field",
          "ADMIN.USER_DIRECTORIES.LDAP.USER.DISPLAY_NAME.LABEL": "Name",
          "ADMIN.USER_DIRECTORIES.LDAP.USER.DISPLAY_NAME.HELP": "Used as display name (optional)",
          "ADMIN.USER_DIRECTORIES.LDAP.USER.EMAIL.LABEL": "Email address",
          "ADMIN.USER_DIRECTORIES.LDAP.USER.EMAIL.HELP": "Email address of an user (optional)",
          "ADMIN.USER_DIRECTORIES.LDAP.USER.FIRST_NAME.LABEL": "First name",
          "ADMIN.USER_DIRECTORIES.LDAP.USER.FIRST_NAME.HELP": "First name of an user",
          "ADMIN.USER_DIRECTORIES.LDAP.USER.FIRST_NAME.PLACEHOLDER": "givenName",
          "ADMIN.USER_DIRECTORIES.LDAP.USER.LAST_NAME.LABEL": "Last name",
          "ADMIN.USER_DIRECTORIES.LDAP.USER.LAST_NAME.HELP": "Last name of an user",
          "ADMIN.USER_DIRECTORIES.LDAP.USER.LAST_NAME.PLACEHOLDER": "sn",
          "ADMIN.USER_DIRECTORIES.LDAP.USER.ID.LABEL": "User unique ID",
          "ADMIN.USER_DIRECTORIES.LDAP.USER.ID.HELP": "Unique user attribute",
          "ADMIN.USER_DIRECTORIES.LDAP.USER.ID.PLACEHOLDER": "entryUUID",
          "ADMIN.USER_DIRECTORIES.LDAP.USER.ID.PLACEHOLDER.AD": "objectGUID",
          "ADMIN.USER_DIRECTORIES.LDAP.USER.MANAGER.LABEL": "Superior",
          "ADMIN.USER_DIRECTORIES.LDAP.USER.MANAGER.HELP": "Attribute that identifies the superior. Recommended value is \"manager\". (optional)",
          "ADMIN.USER_DIRECTORIES.LDAP.USER.USERNAME.LABEL": "Username",
          "ADMIN.USER_DIRECTORIES.LDAP.USER.USERNAME.HELP": "Used as login name",
          "ADMIN.USER_DIRECTORIES.LDAP.USER.USERNAME.PLACEHOLDER": "userPrincipalName",
          "ADMIN.USER_DIRECTORIES.LDAP.GROUP.ENABLE.LABEL": "Synchronize Groups",
          "ADMIN.USER_DIRECTORIES.LDAP.GROUP.ENABLE.HELP": "Activates synchronization of user groups",
          "ADMIN.USER_DIRECTORIES.LDAP.GROUP.ENABLE.WARNING": "Attention: Deactivating group synchronization will delete all previously synchronized groups during the next synchronization.",
          "ADMIN.USER_DIRECTORIES.LDAP.GROUP.USER.MEMBEROF.LABEL": "User attribute for group memberships",
          "ADMIN.USER_DIRECTORIES.LDAP.GROUP.USER.MEMBEROF.HELP": "User attribute containing IDs of his groups",
          "ADMIN.USER_DIRECTORIES.LDAP.GROUP.USER.MEMBEROF.PLACEHOLDER": "memberOf",
          "ADMIN.USER_DIRECTORIES.LDAP.GROUP.OBJECT_CLASS.LABEL": "Group object class",
          "ADMIN.USER_DIRECTORIES.LDAP.GROUP.OBJECT_CLASS.HELP": "Class of group objects",
          "ADMIN.USER_DIRECTORIES.LDAP.GROUP.OBJECT_CLASS.PLACEHOLDER": "group",
          "ADMIN.USER_DIRECTORIES.LDAP.GROUP.OBJECT_FILTER.LABEL": "Group object filter",
          "ADMIN.USER_DIRECTORIES.LDAP.GROUP.NAME.LABEL": "Group displayname",
          "ADMIN.USER_DIRECTORIES.LDAP.GROUP.NAME.HELP": "Gruppen attribute used as display name",
          "ADMIN.USER_DIRECTORIES.LDAP.GROUP.NAME.PLACEHOLDER": "name",
          "ADMIN.USER_DIRECTORIES.LDAP.GROUP.ID.LABEL": "Group unique id",
          "ADMIN.USER_DIRECTORIES.LDAP.GROUP.ID.HELP": "Group attribute for identification",
          "ADMIN.USER_DIRECTORIES.LDAP.GROUP.ID.PLACEHOLDER": "dn",
          "ADMIN.USER_DIRECTORIES.LDAP.GROUP.DN.LABEL": "Additional group DN",
          "ADMIN.USER_DIRECTORIES.LDAP.GROUP.DN.HELP": "Prepended to the base DN to limit the scope when searching for groups",
          "ADMIN.USER_DIRECTORIES.LDAP.SYNC.PAGE_SIZE.LABEL": "Page Size",
          "ADMIN.USER_DIRECTORIES.LDAP.SYNC.PAGE_SIZE.HELP": "Number of objects fetched from user directory per request",
          "ADMIN.USER_DIRECTORIES.LDAP.SYNC.STATUS.HELP": "Sync new users as",
          "ADMIN.USER_DIRECTORIES.LDAP.SYNC.ACTIVATION.LABEL": "Activation",
          "ADMIN.USER_DIRECTORIES.LDAP.SYNC.ACTIVATION.HELP": "Activate new users by default",
          "ADMIN.USER_DIRECTORIES.LDAP.SYNC.DEACTIVATE_ORPHANS.LABEL": "Deactivate orphans",
          "ADMIN.USER_DIRECTORIES.LDAP.SYNC.DEACTIVATE_ORPHANS.HELP": "Users that don't exist in LDAP are deactivated",
          "ADMIN.USER_DIRECTORIES.LDAP.SYNC.DELETE_ORPHANS.LABEL": "Delete orphans",
          "ADMIN.USER_DIRECTORIES.LDAP.SYNC.DELETE_ORPHANS.HELP": "Users that don't exist in LDAP are deleted",
          "ADMIN.USER_DIRECTORIES.LDAP.SYNC.JUST_IN_TIME.LABEL": "Just-in-time sync",
          "ADMIN.USER_DIRECTORIES.LDAP.SYNC.JUST_IN_TIME.HELP": "Users should be synchronized during authentication when they exist in LDAP but not in this application",
          "ADMIN.USER_DIRECTORIES.LDAP.SYNC.LABEL.JUMP_TO_JOB": "Synchronization Job",
          "ADMIN.USER_DIRECTORIES.LDAP.SYNC.LABEL.JUMP_TO_JOB.CONFIRM.TITLE": "Leave form",
          "ADMIN.USER_DIRECTORIES.LDAP.SYNC.LABEL.JUMP_TO_JOB.CONFIRM.TEXT": "Do you want to leave this page and open the sync job details page? Your changes will not be saved.",
          "ADMIN.USER_DIRECTORIES.LDAP.SCHEDULING.ENABLE.LABEL": "Activate Scheduling",
          "ADMIN.USER_DIRECTORIES.LDAP.SCHEDULING.LABEL.CRON_PATTERN": "Cron pattern",
          "ADMIN.USER_DIRECTORIES.LDAP.SCHEDULING.LABEL.CRON_PATTERN.HELP": "Cron Pattern for scheduling of the synchronization. Consists of 6 space separated field in order seconds, minutes, hours, day of month, month and day of week. Examples: \"0 0 3 * * *\": daily at 3am; \"0 0 */2 * * *\": every even hour",
          "ADMIN.USER_DIRECTORIES.LDAP.SCHEDULING.INVALID_CRON_PATTERN": "Invalid cron pattern"
        });
        /* eslint-enable quotes */
      });
})(angular);