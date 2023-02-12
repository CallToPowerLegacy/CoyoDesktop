(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.poll')
      .config(function (translationRegistryProvider) {
        /* eslint-disable quotes */
        translationRegistryProvider.registerTranslations('en', {
          "WIDGET.POLL.DESCRIPTION": "Displays a poll.",
          "WIDGET.POLL.NAME": "Poll",
          "WIDGET.POLL.CONFIG": "Configure poll",
          "WIDGET.POLL.RESULTS": "Results",
          "WIDGET.POLL.EXTENDEDOPTIONS": "Extended options",
          "WIDGET.POLL.SETTINGS.CONFIG.QUESTION": "Question",
          "WIDGET.POLL.SETTINGS.CONFIG.QUESTION.HELP": "The question to be answered by the poll.",
          "WIDGET.POLL.SETTINGS.CONFIG.DESCRIPTION": "Description",
          "WIDGET.POLL.SETTINGS.CONFIG.DESCRIPTION.HELP": "Description of the poll.",
          "WIDGET.POLL.SETTINGS.CONFIG.OPTION": "Option",
          "WIDGET.POLL.SETTINGS.CONFIG.OPTION.HELP": "An option to answer the poll.",
          "WIDGET.POLL.SETTINGS.CONFIG.ADDOPTION": "Add option",
          "WIDGET.POLL.SETTINGS.CONFIG.ADDOPTION.HELP": "Add an option to answer the poll.",
          "WIDGET.POLL.SETTINGS.CONFIG.ANONYMOUS": "Vote anonymously",
          "WIDGET.POLL.SETTINGS.CONFIG.ANONYMOUS.HELP": "Results are shown anonymously. If this option is deactivated, users which voted anonymously are not shown in the voters dialog.",
          "WIDGET.POLL.SETTINGS.CONFIG.SHOWRESULTS": "Show results to user",
          "WIDGET.POLL.SETTINGS.CONFIG.SHOWRESULTS.HELP": "After answering the poll the results are shown to the user. If this option is deactivated the results are shown only in the settings dialog on the results tab.",
          "WIDGET.POLL.SETTINGS.CONFIG.FROZEN": "Closed",
          "WIDGET.POLL.SETTINGS.CONFIG.FROZEN.HELP": "Users can't answer the poll anymore.",
          "WIDGET.POLL.SETTINGS.CONFIG.MAXANSWERS": "Max answers per user",
          "WIDGET.POLL.SETTINGS.CONFIG.MAXANSWERS.HELP": "Maximum count of answers per user.",
          "WIDGET.POLL.WIDGET.VOTE": "vote",
          "WIDGET.POLL.WIDGET.VOTES": "votes",
          "WIDGET.POLL.WIDGET.NOVOTES": "No votes yet.",
          "WIDGET.POLL.WIDGET.FROZENREMARK": "CLOSED",
          "WIDGET.POLL.WIDGET.MAXANSWERSREMARK": "UP TO {count} ANSWERS",
          "WIDGET.POLL.WIDGET.ANONYMOUSREMARK": "ANONYMOUS",
          "WIDGET.POLL.WIDGET.MODAL.TITLE": "Votes"
        });
        /* eslint-enable quotes */
      });
})(angular);
