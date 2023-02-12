(function (angular) {
  'use strict';

  angular.module('coyo.widgets.poll')
      .factory('PollWidgetModel', PollWidgetModel);

  /**
   * @ngdoc service
   * @name coyo.widgets.poll.PollWidgetModel
   *
   * @description
   * Domain model representation for a poll shown in the poll widget
   *
   * @requires restResourceFactory
   */
  function PollWidgetModel(restResourceFactory) {
    var Widget = restResourceFactory({
      url: '/web/widgets/poll',
      httpConfig: {
        autoHandleErrors: false
      }
    });

    angular.extend(Widget, {

      /**
       * @ngdoc function
       * @name coyo.widgets.poll.PollWidgetModel#getSelectedAnswer
       * @methodOf coyo.widgets.poll.PollWidgetModel
       *
       * @description
       * Returns the selected answer(s) of the current user
       *
       * @param {string} widgetId ID of the poll.
       *
       * @returns {promise} An $http promise resolving the selected answers.
       */
      getSelectedAnswers: function (widgetId) {
        return Widget.get(widgetId + '/selected-answers');
      },

      /**
       * @ngdoc function
       * @name coyo.widgets.poll.PollWidgetModel#selectAnswer
       * @methodOf coyo.widgets.poll.PollWidgetModel
       *
       * @description
       * Posts an Answer of the current user
       *
       * @param {string} widgetId ID of the poll.
       * @param {string} optionId of the option (unique for the poll).
       *
       * @returns {promise} An $http promise resolving the newly created answer.
       */
      selectAnswer: function (widgetId, optionId) {
        return this.$post(this.$url() + '/' + widgetId + '/selected-answers', {optionId: optionId});
      },

      /**
       * @ngdoc function
       * @name coyo.widgets.poll.PollWidgetModel#getVotes
       * @methodOf coyo.widgets.poll.PollWidgetModel
       *
       * @description
       * Returns the number of votes for each option
       *
       * @param {string} widgetId ID of the poll.
       *
       * @returns {promise} An $http promise resolving a list of objects
       * containing the optionId and the number of votes.
       */
      getVotes: function (widgetId) {
        return Widget.get(widgetId + '/votes');
      },

      /**
       * @ngdoc function
       * @name coyo.widgets.poll.PollWidgetModel#deleteAnswer
       * @methodOf coyo.widgets.poll.PollWidgetModel
       *
       * @description
       * Deletes an answer of a user
       *
       * @param {string} widgetId ID of the poll.
       * @param {string} answerId the unique id of the answer to be deleted.
       *
       * @returns {promise} An $http promise resolving nothing.
       */
      deleteAnswer: function (widgetId, answerId) {
        return Widget.$delete(Widget.$url() + '/' + widgetId + '/selected-answers/' + answerId);
      },

      /**
       * @ngdoc function
       * @name coyo.widgets.poll.PollWidgetModel#loadVoters
       * @methodOf coyo.widgets.poll.PollWidgetModel
       *
       * @description
       * Returns a list of users who has voted for the given option
       *
       * @param {string} widget ID of the poll.
       * @param {string} optionId of the option (unique for the poll).
       * @param {Pageable} pageable pageination information.
       *
       * @returns {promise} An $http promise resolving a list of users.
       */
      loadVoters: function (widgetId, optionId, pageable) {
        return Widget.pagedQuery(pageable, {}, {}, widgetId + '/' + optionId + '/voters');
      }
    });

    return Widget;
  }

})(angular);
