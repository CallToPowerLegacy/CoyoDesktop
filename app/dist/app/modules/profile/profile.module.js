(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name coyo.profile
   *
   * @description
   * # Profile module #
   * The profile module renders the profile information and provides methods for accessing and manipulating the user
   * data.
   *
   * Available components are for example
   * * the profile fields,
   * * the push devices,
   * * the user avatar,
   * * the user avatar overlay for the image upload,
   * * the user follow button and
   * * the user list item.
   *
   * @requires $stateProvider
   */
  angular
      .module('coyo.profile', [
        'coyo.base',
        'commons.auth',
        'commons.config',
        'commons.ui',
        'commons.i18n',
        'commons.target',
        'commons.messaging'
      ])
      .config(ModuleConfig)
      .constant('profileConfig', {
        templates: {
          main: 'app/modules/profile/views/profile.main.html',
          overview: 'app/modules/profile/views/profile.overview.html',
          activity: 'app/modules/profile/views/profile.activity.html',
          info: 'app/modules/profile/views/profile.info.html',
          blog: 'app/modules/profile/views/profile.blog.html'
        }
      }).constant('profileFieldTemplates', {
        'CHECKBOX': {templateUrl: 'app/modules/profile/components/profile-fields/views/profile-field-checkbox.html'},
        'DATE': {templateUrl: 'app/modules/profile/components/profile-fields/views/profile-field-date.html'},
        'EMAIL': {templateUrl: 'app/modules/profile/components/profile-fields/views/profile-field-email.html'},
        'LINK': {templateUrl: 'app/modules/profile/components/profile-fields/views/profile-field-link.html'},
        'OPTIONS': {templateUrl: 'app/modules/profile/components/profile-fields/views/profile-field-options.html'},
        'PHONE': {templateUrl: 'app/modules/profile/components/profile-fields/views/profile-field-phone.html'},
        'TEXT': {templateUrl: 'app/modules/profile/components/profile-fields/views/profile-field-text.html'},
        'TEXTAREA': {templateUrl: 'app/modules/profile/components/profile-fields/views/profile-field-textarea.html'}
      });

  /**
   * Module configuration
   */
  function ModuleConfig($stateProvider, profileConfig) {
    $stateProvider
        .state('main.profile', {
          url: '/profile/:userId',
          params: {
            userId: null
          },
          templateUrl: profileConfig.templates.main,
          controller: 'ProfileMainController',
          controllerAs: 'profileCtrl',
          data: {
            guide: 'user-profile',
            pageTitle: false
          },
          redirect: 'main.profile.activity',
          resolve: {
            currentUser: function (authService) {
              return authService.getUser();
            },
            user: function ($stateParams, UserModel, currentUser) {
              if (!$stateParams.userId || currentUser.slug === $stateParams.userId ||
                  currentUser.id === $stateParams.userId) {
                return currentUser;
              }
              return UserModel.getWithPermissions({id: $stateParams.userId}, {}, ['manage']);
            },
            profileFieldGroups: function (profileFieldsService) {
              return profileFieldsService.getGroups();
            },
            linkPattern: function (SettingsModel) {
              return SettingsModel.retrieveByKey('linkPattern');
            },
            emailPattern: function (SettingsModel) {
              return SettingsModel.retrieveByKey('emailPattern');
            },
            phonePattern: function (SettingsModel) {
              return SettingsModel.retrieveByKey('phonePattern');
            }
          },
          onEnter: function (user, currentUser, $state, authService, coyoNotification, titleService) {
            var permission = user.id === currentUser.id ? 'ACCESS_OWN_USER_PROFILE' : 'ACCESS_OTHER_USER_PROFILE';
            if (!currentUser.hasGlobalPermissions(permission)) {
              coyoNotification.error('ERRORS.FORBIDDEN');
              $state.go('main');
            } else {
              titleService.set(user.displayName, false);
            }
          }
        })
        .state('main.profile.current', {
          onEnter: function (authService, $state) {
            authService.getUser().then(function (currentUser) {
              $state.go('main.profile', {userId: currentUser.id});
            });
          }
        })
        .state('main.profile.overview', {
          url: '/overview',
          templateUrl: profileConfig.templates.overview
        })
        .state('main.profile.activity', {
          url: '/activity',
          templateUrl: profileConfig.templates.activity
        })
        .state('main.profile.info', {
          url: '/info',
          templateUrl: profileConfig.templates.info
        })
        .state('main.profile.blog', {
          url: '/blog',
          templateUrl: profileConfig.templates.blog
        });
  }

})(angular);
