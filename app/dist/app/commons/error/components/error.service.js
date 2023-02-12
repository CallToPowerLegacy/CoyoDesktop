(function (angular) {
  'use strict';

  angular
      .module('commons.error')
      .factory('errorService', errorService);

  /**
   * @ngdoc service
   * @name commons.error.errorService
   *
   * @description
   * Turns an XHR errorResponse into an error message to be presented to the user.
   *
   * @requires commons.config.coyoConfig
   * @requires $translate
   */
  function errorService(coyoConfig, $translate, $state) {
    var service = {
      getMessage: getMessage,
      showErrorPage: showErrorPage,
      suppressNotification: suppressNotification,
      isNotificationSuppressed: isNotificationSuppressed,
      getValidationErrors: getValidationErrors
    };
    return service;

    ////////////

    /**
     * @ngdoc method
     * @name commons.error.errorService#getMessage
     * @methodOf commons.error.errorService
     *
     * @description
     * Creates an error message. The result is already translated.
     * Certain HTTP status codes are handled (401, 403, 503) as are coyo specific error codes.
     *
     * @param {object} errorResponse
     * The error response of the XHR request.
     *
     * @return {object} promise that resolves to a concrete message string
     */
    function getMessage(errorResponse) {
      if (errorResponse.status === 401) {
        return $translate('ERRORS.UNAUTHORIZED');
      }

      if (errorResponse.status === 403) {
        return $translate('ERRORS.FORBIDDEN');
      }

      if (errorResponse.status === 503 || errorResponse.status === -1) {
        return $translate('ERRORS.SERVER_UNAVAILABLE');
      }

      var statusCode = _.get(errorResponse, 'data.errorStatus');
      var context = _.get(errorResponse, 'data.context', {});
      if (statusCode) {
        if (['NOT_FOUND', 'DELETED', 'LOCKED'].indexOf(statusCode) < 0) {
          return $translate('ERRORS.STATUSCODE.' + statusCode, context).catch(function () {
            return $translate('ERRORS.STATUSCODE.UNKNOWN');
          });
        }
        var entityType = coyoConfig.entityTypes[_.get(errorResponse, 'data.context.entityType')];
        if (entityType && entityType.label) {
          return $translate(entityType.label).then(function (label) {
            var translationContext = angular.extend(context, {'entityType': label});
            return $translate('ERRORS.STATUSCODE.' + statusCode, translationContext);
          });
        }
        return $translate('ERRORS.STATUSCODE.' + statusCode + '.DEFAULT');
      }

      return $translate('ERRORS.STATUSCODE.UNKNOWN');
    }

    /**
     * @ngdoc method
     * @name commons.error.errorService#showErrorPage
     * @methodOf commons.error.errorService
     *
     * @description
     * Redirect to an error state without changing the url.
     *
     * @param {string} message
     * The (already translated) error message to be displayed.
     *
     * @param {number=} status
     * Http status code (will affect the icon displayed)
     *
     * @param {object[]|string[]} buttons
     * Configure the buttons visible on the error page (by default a 'home' link will be displayed).
     * Elements may be objects to configure a button (see details below or a string referencing a standard button config
     * (one of 'RETRY', 'CONFIGURE_BACKEND').
     *
     * @param {string} buttons.title
     * Translation key of the title of the button
     *
     * @param {function=} buttons.action
     * Callback to be executed when the button is clicked. If none is provided the button will redirect to 'home'.
     * Any angular dependency can be injected into this callback as an argument.
     *
     */
    function showErrorPage(message, status, buttons) {
      $state.go('error', {message: message, status: status, buttons: buttons}, {location: false});
    }

    /**
     * @ngdoc method
     * @name commons.error.errorService#suppressNotification
     * @methodOf commons.error.errorService
     *
     * @description
     * Prevent error notification popups to be displayed for the given error response.
     * Must be called directly (without $timeout) inside a catch callback on the offending http call.
     *
     * @param {object} error
     * The error response of an XHR request.
     */
    function suppressNotification(error) {
      if (angular.isObject(error)) {
        error.suppressNotification = true;
      }
    }

    /**
     * @ngdoc method
     * @name commons.error.errorService#suppressNotification
     * @methodOf commons.error.errorService
     *
     * @description
     * Determine if the error notifications for the given error response have been deactivated.
     *
     * @param {object} error
     * The error response of an XHR request.
     *
     * @return {boolean} true if notifications are suppressed
     */
    function isNotificationSuppressed(error) {
      return _.get(error, 'suppressNotification') === true;
    }

    /**
     * @ngdoc method
     * @name commons.error.errorService#getValidationErrors
     * @methodOf commons.error.errorService
     *
     * @description
     * Convert the list of validation field errors from a REST error response into an object tree that can be
     * used with ng-messages.
     *
     * @param {object} error
     * The error response of an XHR request.
     *
     * @return {object} tree where the keys at the top level represent the field names and the second level
     * represents the validation error code, empty object if the response contained no field errors.
     */
    function getValidationErrors(error) {
      var fieldErrors = _.get(error, 'data.fieldErrors');
      if (fieldErrors) {
        return _.mapValues(_.groupBy(fieldErrors, 'key'), function (item) {
          var result = {};
          if (item.length > 0) {
            result[item[0].code] = true;
          }
          return result;
        });
      }
      return {};
    }
  }

})(angular);
