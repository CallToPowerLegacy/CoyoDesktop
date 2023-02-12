(function (angular) {
  'use strict';

  angular.module('commons.ui')
      .directive('coyoSelectSender', selectSender);

  /**
   * @ngdoc directive
   * @name commons.ui.coyoSelectSender:coyoSelectSender
   * @restrict 'E'
   * @scope
   *
   * @description
   * Renders a UI select field for sender selection.
   *
   * @requires $translate
   * @requires components.ui.selectFactoryModel
   * @requires coyo.domain.SenderModel
   * @requires commons.resource.Pageable
   * @requires commons.config.coyoConfig
   *
   * @param {object} ng-model (required) the currently selected sender
   * @param {string} placeholder (optional) translation key for the input field placeholder
   */
  function selectSender($translate, selectFactoryModel, SenderModel, Pageable, coyoConfig, $q, $timeout) {
    var requests = {};

    var selectDirective = selectFactoryModel({
      refresh: refresh,
      multiple: true,
      minSelectableItems: 6,
      mobile: false,
      emptyText: 'COMMONS.SELECT_SENDER.EMPTY',
      pageSize: 10,
      sublines: ['typeLabelTranslated']
    });
    selectDirective.templateUrl = 'app/commons/ui/components/select-sender/select-sender.html';

    return selectDirective;

    function refresh(pageableData, search, parameters) {
      var pageable = new Pageable(pageableData.page, pageableData.size, 'displayName.sort');
      var filters = {type: _.get(parameters, 'allowedTypeNames', ['user', 'workspace', 'page'])};
      var fields = ['displayName'];
      var aggregations = {};
      var findOnlyManagedSenders = _.get(parameters, 'findOnlyManagedSenders', false);
      var findSharingRecipients = _.get(parameters, 'findSharingRecipients', false);
      var method;
      if (findOnlyManagedSenders) {
        method = SenderModel.searchManagedSendersWithFilter;
      } else if (findSharingRecipients) {
        method = SenderModel.searchSharingRecipientsWithFilter;
      } else {
        method = SenderModel.searchSendersWithFilter;
      }
      var config = {
        args: [search, pageable, filters, fields, aggregations],
        method: method
      };
      var key = angular.toJson(config);
      var deferred = $q.defer();
      var promise = deferred.promise;
      var request = requests[key] || {config: config, deferred: []};
      requests[key] = request;
      request.deferred.push(deferred);

      $timeout(function () {
        var requestsInProgress = angular.copy(requests);
        requests = {};
        for (var currentKey in requestsInProgress) {
          var currentRequest = requestsInProgress[currentKey];
          currentRequest.config.method.apply(undefined, currentRequest.config.args).then(function (response) {
            currentRequest.deferred.forEach(function (deferred) {
              deferred.resolve(response);
            });
          });
        }
      });

      return promise.then(function (response) {
        angular.forEach(response.content, function (item) {
          item.typeLabelTranslated = $translate.instant(coyoConfig.entityTypes[item.typeName].label);
        });

        return angular.extend(response.content, {
          meta: {
            last: response.last,
            number: response.number
          }
        });
      });
    }
  }

})(angular);
