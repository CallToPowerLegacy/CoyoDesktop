(function (angular) {
  'use strict';

  angular.module('coyo.widgets.completeprofile')
      .factory('CompleteProfileWidgetModel', CompleteProfileWidgetModel);

  /**
   * @ngdoc service
   * @name coyo.widgets.completeprofile.CompleteProfileWidgetModel
   *
   * @description
   * Domain model representation for the user profile information, which should be completed by the user
   *
   * @requires restResourceFactory
   * @requires CoyoEndpoints
   */
  function CompleteProfileWidgetModel(restResourceFactory) {

    var CompleteProfileWidget = restResourceFactory({
      url: '/web/widgets/complete-profile',
      httpConfig: {
        autoHandleErrors: false
      }
    });

    angular.extend(CompleteProfileWidget, {

      /**
       * @ngdoc function
       * @name coyo.widgets.completeprofile.CompleteProfileWidgetModel#getCompleteProfileInfo
       * @methodOf coyo.widgets.completeprofile.CompleteProfileWidgetModel
       *
       * @description
       * Returns the list of user profile information, which should be completed by the user
       *
       * @returns {promise} An $http promise resolving to the list of articles.
       */
      getCompleteProfileInfo: function () {
        return CompleteProfileWidget.get();
      }
    });

    return CompleteProfileWidget;
  }

})(angular);
