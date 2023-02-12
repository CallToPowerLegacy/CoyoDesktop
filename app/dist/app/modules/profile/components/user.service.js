(function (angular) {
  'use strict';

  angular
      .module('coyo.profile')
      .factory('userService', userService);

  /**
   * @ngdoc service
   * @name coyo.profile.userService
   *
   * @description
   * User service to retrieve user information.
   *
   * @requires $http
   * @requires $localStorage
   * @requires commons.i18n.i18nService
   * @requires commons.config.coyoEndpoints
   * @requires commons.sockets.socketService
   */
  // TODO: Migrate to UserModel class/instance methods
  function userService($q, $http, $timeout, $localStorage, i18nService, coyoEndpoints, socketService, UserProfileGroupModel) {

    var pendingPresenceStatusRequests = {};

    return {
      getUserInfo: getUserInfo,
      setUserName: setUserName,
      setUserLanguage: setUserLanguage,
      setUserTimeZone: setUserTimeZone,
      changeEmail: changeEmail,
      activateEmail: activateEmail,
      setUserPassword: setUserPassword,
      setProfileFields: setProfileFields,
      getPresenceStatus: getPresenceStatus,
      getUserOnlineCount: getUserOnlineCount
    };

    /**
     * @ngdoc method
     * @name coyo.profile.userService#getUserInfo
     * @methodOf coyo.profile.userService
     *
     * @description
     * Retrieves information of a user.
     *
     * @param {object} user The user
     *
     * @returns {promise} An http promise
     */
    function getUserInfo(user) {
      var url = coyoEndpoints.user.user.replace('{id}', user.id);
      return $http.get(url);
    }

    /**
     * @ngdoc method
     * @name coyo.profile.userService#getUserOnlineCount
     * @methodOf coyo.profile.userService
     *
     * @description
     * Returns the number of currently online Users (not presenceStatus, but connected)
     *
     * @returns {promise} An http promise
     */
    function getUserOnlineCount() {
      var url = coyoEndpoints.user.getUserOnlineCount;
      return $http.get(url).then(function (response) {
        return response.data;
      });
    }

    /**
     * @ngdoc method
     * @name coyo.profile.userService#setUserName
     * @methodOf coyo.profile.userService
     *
     * @description
     * Saves the first and last name of the user.
     *
     * @param {object} user The user to set the first and last name for
     * @param {object} firstName The (new) first name
     * @param {object} lastName The (new) last name
     *
     * @returns {promise} An http promise
     */
    function setUserName(user, firstName, lastName) {
      var url = coyoEndpoints.user.setUserName.replace('{id}', user.id);
      return $http.put(url, {
        firstName: firstName,
        lastName: lastName
      }).then(function (response) {
        return response.data;
      });
    }

    /**
     * @ngdoc method
     * @name coyo.profile.userService#setUserLanguage
     * @methodOf coyo.profile.userService
     *
     * @description
     * Saves the preferred language in the backend and sets it for a user globally for $translate.
     *
     * @param {object} user The user to set the language for
     * @param {object} language The language to set
     *
     * @returns {promise} An http promise
     */
    function setUserLanguage(user, language) {
      var url = coyoEndpoints.user.setLanguage.replace('{id}', user.id);
      return $http.put(url, {
        language: language.toUpperCase()
      }).then(function (response) {
        i18nService.setInterfaceLanguage(language);
        $localStorage.userLanguage = language;
        return response.data;
      });
    }

    /**
     * @ngdoc method
     * @name coyo.profile.userService#setUserTimeZone
     * @methodOf coyo.profile.userService
     *
     * @description
     * Sets the time zone of a user in the backend.
     *
     * @param {object} user The user to set the time zone for
     * @param {object} timeZoneId The id of the time zone to set
     *
     * @returns {promise} An http promise
     */
    function setUserTimeZone(user, timeZoneId) {
      var url = coyoEndpoints.user.setTimeZone.replace('{id}', user.id);
      return $http.put(url, {
        timezone: timeZoneId
      });
    }

    /**
     * @ngdoc method
     * @name coyo.profile.userService#changeEmail
     * @methodOf coyo.profile.userService
     *
     * @description
     * Requests the change of a user's email address.
     *
     * @param {object} user The user to change the email for
     * @param {string} newEmail The new email address

     * @returns {promise} An http promise
     */
    function changeEmail(user, newEmail) {
      var url = coyoEndpoints.user.email.change.replace('{id}', user.id);
      return $http.post(url, {
        email: newEmail
      });
    }

    /**
     * @ngdoc method
     * @name coyo.profile.userService#activateEmail
     * @methodOf coyo.profile.userService
     *
     * @description
     * Requests the email address activation.
     *
     * @param {object} user The user to activate the email for
     * @param {string} token The token for the activation

     * @returns {promise} An http promise
     */
    function activateEmail(user, token) {
      var url = coyoEndpoints.user.email.activate.replace('{id}', user.id);
      return $http.put(url, {
        token: token
      });
    }

    /**
     * @ngdoc method
     * @name coyo.profile.userService#setUserPassword
     * @methodOf coyo.profile.userService
     *
     * @description
     * Sets the password of a user.
     *
     * @param {object} user The user to set the password for
     * @param {object} oldPassword The old password
     * @param {object} newPassword The new password
     *
     * @returns {promise} An http promise
     */
    function setUserPassword(user, oldPassword, newPassword) {
      var url = coyoEndpoints.user.changePassword.replace('{id}', user.id);
      return $http.post(url, {
        oldPassword: oldPassword,
        newPassword: newPassword
      });
    }

    /**
     * @ngdoc method
     * @name coyo.profile.userService#setProfileFields
     * @methodOf coyo.profile.userService
     *
     * @description
     * Sets the profile fields of a user.
     *
     * @param {object} user The user to set the profile fields for
     * @param {object} group The profile group
     * @param {object} fields The profile fields
     *
     * @returns {promise} An http promise
     */
    function setProfileFields(user, group, fields) {
      return UserProfileGroupModel.get().then(function (config) {
        var groupConfig = _.find(config, {id: group.id});
        if (groupConfig) {
          var validFields = _.pickBy(fields, function (value, key) {
            var field = _.find(groupConfig.fields, {name: key});
            return field && !field.immutable;
          });

          if (_.keys(validFields).length > 0) {
            return $http({
              method: 'POST',
              url: coyoEndpoints.user.profile.fields.replace('{id}', user.id),
              data: validFields
            });
          }
        }

        return $q.resolve();
      });
    }

    /**
     * @ngdoc method
     * @name coyo.profile.userService#getPresenceStatus
     * @methodOf coyo.profile.userService
     *
     * @description
     * Retrieves the presence status of a user. Optionally, you may provide a $scope, which will result in an ongoing
     * subscription to changes of the presence status and additional calls to the provided callback method. We need
     * a $scope so that we can terminate the subscription when the $scope is destroyed.
     * Internally, the requests are collected for a digest cycle and then a bulk request is sent to the backend.
     *
     * @param {string} user The user to get the presence status for
     * @param {function} callback Callback that will be called with the presence status as first argument
     * @param {object} $scope Optional $scope to future to additional presence status changes
     */
    function getPresenceStatus(user, callback, $scope) {
      if (user.active) {
        // get initial status
        var callbackList = (pendingPresenceStatusRequests[user.id] || []);
        callbackList.push(callback);
        pendingPresenceStatusRequests[user.id] = callbackList;
        $timeout(function () {
          if (_.keys(pendingPresenceStatusRequests).length > 0) {
            var ids = _.keys(pendingPresenceStatusRequests).join(',');
            var requestsInProgress = pendingPresenceStatusRequests;
            pendingPresenceStatusRequests = {};
            $http.get(coyoEndpoints.user.presenceStatusList + '?userIds=' + ids).then(function (response) {
              _.forIn(response.data, function (status, id) {
                _.forIn(requestsInProgress[id], function (callback) {
                  callback(status);
                });
              });
            });
          }
        });

        // subscribe to further status changes
        if ($scope) {
          $scope.$on('$destroy',
              socketService.subscribe('/topic/user.' + user.id + '.presenceStatusChanged', function (event) {
                $scope.$apply(function () {
                  callback(event.content);
                });
              })
          );
        }
      }
    }
  }

})(angular);
