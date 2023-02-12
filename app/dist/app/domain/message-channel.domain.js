(function (angular) {
  'use strict';

  angular
      .module('coyo.domain')
      .factory('MessageChannelModel', MessageChannelModel);

  /**
   * @ngdoc service
   * @name coyo.domain.MessageChannelModel
   *
   * @description
   * Provides the message channel model.
   *
   * @requires restResourceFactory
   * @requires commons.config.coyoEndpoints
   */
  function MessageChannelModel($http, restResourceFactory, coyoEndpoints) {
    var MessageChannelModel = restResourceFactory({
      url: coyoEndpoints.messaging.channels
    });

    // instance members
    angular.extend(MessageChannelModel.prototype, {

      save: function (trim) {
        var channelToSave;
        if (trim) {
          channelToSave = {
            creatorId: this.creatorId,
            type: this.type,
            name: this.name,
            memberIds: this.memberIds
          };
        } else {
          channelToSave = this;
        }

        var method = this.isNew() ? $http.post : $http.put;
        return method(this.$url(), channelToSave).then(function (response) {
          return new MessageChannelModel(response.data);
        });
      },

      /**
       * @ngdoc method
       * @name coyo.domain.MessageChannelModel#getChannelPartner
       * @methodOf coyo.domain.MessageChannelModel
       *
       * @description This method applies to single channels that have exactly two members. It will return the channel
       * partner of the given current user.
       *
       * @param {object} currentUser The current user
       * @returns {object} Other user
       */
      getChannelPartner: function (currentUser) {
        if (this.type !== 'SINGLE') {
          throw new Error('This method can only be used for single channels with exactly two members');
        }

        var withoutCurrent = _.reject(this.members, {user: {id: currentUser.id}});

        if (withoutCurrent.length !== 1) {
          throw new Error('Could not extract channel partner');
        }

        return withoutCurrent[0].user;
      },

      /**
       * @ngdoc method
       * @name coyo.domain.MessageChannelModel#getDisplayName
       * @methodOf coyo.domain.MessageChannelModel
       *
       * @description Get the display name for this channel. This is either the name of the channel or the combined
       * names of the channel members (except for the given current user).
       *
       * @param {object} currentUser The current user
       * @returns {string} Display name of this channel
       */
      getDisplayName: function (currentUser) {
        if (this.name) {
          return this.name;
        }

        return this.getOtherMemberNames(currentUser);
      },

      /**
       * @ngdoc method
       * @name coyo.domain.MessageChannelModel#getOtherMemberNames
       * @methodOf coyo.domain.MessageChannelModel
       *
       * @description Get he combined names of the channel members (except for the given current user).
       *
       * @param {object} currentUser The current user
       * @returns {string} Combined names
       */
      getOtherMemberNames: function (currentUser) {
        var withoutCurrent = _.reject(this.members, {user: {id: currentUser.id}});
        return _.join(_.map(withoutCurrent, 'user.displayName'), ', ');
      },

      /**
       * @ngdoc method
       * @name coyo.domain.MessageChannelModel#getUnreadCount
       * @methodOf coyo.domain.MessageChannelModel
       *
       * @description Get the count of unread messages for given user.
       *
       * @param {object} user The user to get the count for
       * @returns {number} Number of unread messages
       */
      getUnreadCount: function (user) {
        return this.getMember(user.id).unreadCount;
      },

      /**
       * @ngdoc method
       * @name coyo.domain.MessageChannelModel#getMember
       * @methodOf coyo.domain.MessageChannelModel
       *
       * @description Get the member with given user ID.
       *
       * @param {string} userId The ID of the member to get
       * @returns {object} Member if found
       */
      getMember: function (userId) {
        return _.find(this.members, {user: {id: userId}});
      },

      /**
       * @ngdoc method
       * @name coyo.domain.MessageChannelModel#isMember
       * @methodOf coyo.domain.MessageChannelModel
       *
       * @description Checks if user with given ID is member in this channel.
       *
       * @param {string} userId The ID of the member to check
       * @returns {boolean} True if given user is member in this channel
       */
      isMember: function (userId) {
        return angular.isDefined(this.getMember(userId));
      },

      /**
       * @ngdoc method
       * @name coyo.domain.MessageChannelModel#isAdmin
       * @methodOf coyo.domain.MessageChannelModel
       *
       * @description Checks if user with given ID is admin in this channel.
       *
       * @param {string} userId The ID of the member to check
       * @returns {boolean} True if given user is admin in this channel
       */
      isAdmin: function (userId) {
        var member = this.getMember(userId);
        return member && member.role === 'ADMIN';
      }
    });

    return MessageChannelModel;
  }

})(angular);
