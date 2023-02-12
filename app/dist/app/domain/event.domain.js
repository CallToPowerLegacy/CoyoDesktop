(function (angular) {
  'use strict';

  angular
      .module('coyo.domain')
      .factory('EventModel', EventModel);

  /**
   * @ngdoc service
   * @name coyo.domain.EventModel
   *
   * @description
   * Provides the Coyo event model
   *
   * @requires $httpParamSerializer
   * @requires restResourceFactory
   * @requires commons.config.coyoEndpoints
   * @requires commons.resource.Page
   * @requires commons.resource.Pageable
   * @requires moment
   * @requires $http
   */
  function EventModel($httpParamSerializer, restResourceFactory, coyoEndpoints, Page, Pageable, moment, $http) {
    var EventModel = restResourceFactory({
      url: coyoEndpoints.event.events
    });

    // class members
    angular.extend(EventModel, {

      /**
       * @ngdoc function
       * @name coyo.domain.EventModel#searchWithFilter
       * @methodOf coyo.domain.EventModel
       *
       * @description
       * Event elastic search with filter.
       *
       * @param {string} term search term
       * @param {string} [from] the start date to filter the search (formatted as 'YYYY-MM-DDTHH:mm:ss')
       * @param {string} [to] the end date to filter the search (formatted as 'YYYY-MM-DDTHH:mm:ss')
       * @param {object} pageable The paging information. If not set an offset of 0 and a page size of 20 will be used.
       * @param {object} [filters] search filters
       * @param {string} [searchFields] list of fields to search in
       * @param {object} [aggregations] search aggregations
       *
       * @returns {promise} An $http promise
       */
      searchWithFilter: function (term, from, to, pageable, filters, searchFields, aggregations) {
        var url = EventModel.$url();
        var params = angular.extend({
          term: term ? term.toLowerCase() : undefined,
          from: from ? from : moment().format('YYYY-MM-DDTHH:mm:ss'),
          to: to ? to : undefined,
          filters: filters ? $httpParamSerializer(filters) : undefined,
          searchFields: searchFields ? searchFields.join(',') : undefined,
          aggregations: aggregations ? $httpParamSerializer(aggregations) : undefined
        }, pageable.getParams());
        return EventModel.getWithPermissions(null, params, ['manage', 'canParticipate']).then(function (response) {
          return new Page(response, params, {
            url: url,
            resultMapper: function (item) {
              return new EventModel(item);
            }
          });
        });
      },

      /**
       * @ngdoc function
       * @name coyo.domain.EventModel#getMembershipsWithFilter
       * @methodOf coyo.domain.EventModel
       *
       * @description
       * Returns the participants of an event
       *
       * @param {string} term search term
       * @param {object} pageable The paging information
       * @param {object} [filters] search filters
       * @param {string} [searchFields] list of fields to search in
       * @param {object} [aggregations] search aggregations
       * @param {string} slug The slug of the Event
       *
       * @return {promise} An $http promise
       */
      getMembershipsWithFilter: function (term, pageable, filters, searchFields, aggregations, slug) {
        var url = this.$url(slug + '/memberships');
        var params = angular.extend({
          term: term ? term.toLowerCase() : undefined,
          filters: filters ? $httpParamSerializer(filters) : undefined,
          searchFields: searchFields ? searchFields.join(',') : undefined,
          aggregations: aggregations ? $httpParamSerializer(aggregations) : undefined
        }, pageable.getParams());
        return $http.get(url, {params: params, autoHandleErrors: false}).then(function (response) {
          return new Page(response.data, params, {
            url: url,
            resultMapper: function (item) {
              return new EventModel(item);
            }
          });
        });
      }
    });

    // instance members
    angular.extend(EventModel.prototype, {

      /**
       * @ngdoc function
       * @name coyo.domain.EventModel#isMultiDay
       * @methodOf coyo.domain.EventModel
       *
       * @description
       * Checks if this event spans over multiple days.
       *
       * @returns {boolean} true if this event spans over multiple days, otherwise false.
       */
      isMultiDay: function () {
        return !moment(this.startDate).isSame(this.endDate, 'day');
      },

      /**
       * @ngdoc function
       * @name coyo.domain.EventModel#updateEvent
       * @methodOf coyo.domain.EventModel
       *
       * @description
       * Updates the event.
       *
       * @returns {promise} An $http promise
       */
      updateEvent: function () {
        return this.update();
      },

      /**
       * @ngdoc function
       * @name coyo.domain.EventModel#setStatus
       * @methodOf coyo.domain.EventModel
       *
       * @description
       * Sets the participation status for an event.
       *
       * @param {string} [status] The participation status to be set
       *
       * @returns {promise} An $http promise
       */
      setStatus: function (status) {
        return EventModel.$put(this.$url('status'), {status: status});
      },

      /**
       * @ngdoc function
       * @name coyo.domain.EventModel#inviteMembers
       * @methodOf coyo.domain.EventModel
       *
       * @description
       * Invites additional members to a event. Users can also invited via their group.
       *
       * @param {array} userAndGroupIds.userIds
       * An array of string with user ids to invite. Can be empty but not null.
       *
       * @param {array} userAndGroupIds.groupIds
       * An array of string with group ids. All users belonging to those groups are invited. Can be empty but not null.
       *
       * @returns {promise} An $http promise
       */
      inviteMembers: function (userAndGroupIds) {
        return EventModel.$put(this.$url('/memberships'), userAndGroupIds);
      },

      /**
       * @ngdoc function
       * @name coyo.domain.EventModel#removeMember
       * @methodOf coyo.domain.EventModel
       *
       * @description
       * Removes a member from an event.
       *
       * @param {string} userId
       * The identifier of the user to remove from the list of event memberships.
       *
       * @returns {promise} An $http promise
       */
      removeMember: function (userId) {
        return EventModel.$delete(this.$url('/memberships/' + userId));
      },

      /**
       * @ngdoc function
       * @name coyo.domain.EventModel#deleteEvent
       * @methodOf coyo.domain.EventModel
       *
       * @description
       * Delete an event.
       *
       * @returns {promise} An $http promise
       */
      deleteEvent: function () {
        return this.$delete(this.$url());
      },

      /**
       * @ngdoc function
       * @name coyo.domain.EventModel#canParticipate
       * @methodOf coyo.domain.EventModel
       *
       * @description
       * Returns true if the event can be participated by the current user.
       *
       * @returns {boolean} true if the event can be participated
       */
      canParticipate: function () {
        return this._permissions && this._permissions.canParticipate;
      },

      /**
       * @ngdoc function
       * @name coyo.domain.EventModel#canManage
       * @methodOf coyo.domain.EventModel
       *
       * @description
       * Returns true if the event can be managed by the current user.
       *
       * @returns {boolean} true if the current user can manage the event
       */
      canManage: function () {
        return this._permissions && this._permissions.manage;
      },

      /**
       * @ngdoc function
       * @name coyo.domain.EventModel#getHosts
       * @methodOf coyo.domain.EventModel
       *
       * @description
       * Returns the hosts of an event
       *
       * @return {promise} An $http promise
       */
      getHosts: function () {
        var senderId = this.sender.id;
        var url = this.$url('/hosts');
        var sort = ['_score,DESC', 'displayName'];
        var pageable = new Pageable(0, 100, sort);
        return EventModel.$get(url, pageable.getParams()).then(function (response) {
          return _.reject(response.content, {'userId': senderId});
        });
      }
    });

    return EventModel;
  }

})(angular);
