(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.poll')
      /**
       * @ngdoc directive
       * @name coyo.widgets.poll.coyoPollWidget
       * @restrict 'E'
       *
       * @description
       * A widget which contains a poll
       *
       * @param {object} widget - poll widget
       * @param {object} editMode - true when widget editing is activated
       * @param {object} settingsMode - true when widget is shown in settings dialog
       */
      .component('coyoPollWidget', {
        templateUrl: 'app/widgets/poll/poll-widget.html',
        bindings: {
          widget: '=',
          editMode: '<',
          settingsMode: '<'
        },
        controller: 'pollWidgetController'
      })
      .controller('pollWidgetController', pollWidgetController);

  function pollWidgetController(PollWidgetModel, modalService, $scope) {
    var vm = this;
    vm.answers = [];
    vm.overallAmount = 0;
    vm.loading = false;
    vm.checkableOptions = [];
    vm.getNumOfVotesForOption = 0;
    vm.getPercentageForOption = 0;
    vm.toggleOption = toggleOption;
    vm.canVote = canVote;
    vm.showVoters = showVoters;

    function toggleOption(option) {
      if (vm.loading || !canVote(option)) {
        return;
      }
      if (!option.checked) {
        _selectAnswer(option);
      } else {
        _deleteAnswer(option);
      }
    }

    function getNumOfVotesForOption(option) {
      if (!vm.votes) {
        return 0;
      }
      var voteForAnswer = _.find(vm.votes, function (elem) {
        return elem.optionId === String(option.id);
      });
      option.votes = voteForAnswer ? voteForAnswer.count : 0;
      return option.votes;
    }

    function calculatePercentageForOption(option) {
      option.percentage = vm.overallAmount ? (getNumOfVotesForOption(option) / vm.overallAmount) * 100 : 0;
      return option.percentage;
    }

    function canVote(option) {
      return !vm.editMode && !vm.widget.settings.frozen && (option.checked || vm.widget.settings.maxAnswers > vm.answers.length);
    }

    function selectAnswers() {
      vm.answers.forEach(function (elem) {
        var answerOption = _.find(vm.checkableOptions, function (option) { return '' + option.id === elem.optionId; });
        if (answerOption) {
          answerOption.checked = true;
        }
      });
    }

    function refreshVotes() {
      if (vm.widget._id && (vm.settingsMode || vm.widget.settings.showResults)) {
        PollWidgetModel.getVotes(vm.widget._id).then(function (votes) {
          vm.votes = votes;
          vm.overallAmount = _.sumBy(votes, function (vote) { return vote.count; });
          vm.checkableOptions.forEach(getNumOfVotesForOption);
          vm.checkableOptions.forEach(calculatePercentageForOption);
        });
      }
    }

    function showVoters(option) {
      if (vm.loading || vm.widget.settings.anonymous) {
        return; // currently loading
      }

      modalService.open({
        templateUrl: 'app/widgets/poll/poll-voters.modal.html',
        controller: 'PollWidgetVotersController',
        resolve: {
          widget: function () {
            return vm.widget;
          },
          optionId: function () {
            return option.id;
          }
        }
      });
    }

    function _refreshWidget() {
      vm.checkableOptions = vm.widget.settings.options.map(function (option) {
        var checkableOption = _.clone(option);
        checkableOption.votes = 0;
        checkableOption.percentage = 0;
        return checkableOption;
      });
      refreshVotes();
      if (vm.widget._id) {
        PollWidgetModel.getSelectedAnswers(vm.widget._id).then(function (answers) {
          vm.answers = answers;
          selectAnswers();
        });
      }
    }

    function _selectAnswer(option) {
      vm.loading = true;
      PollWidgetModel.selectAnswer(vm.widget._id, option.id).then(function (userAnswer) {
        vm.answers.push(userAnswer);
        refreshVotes();
        option.checked = true;
      }).finally(function () { vm.loading = false; });
    }

    function _deleteAnswer(option) {
      vm.loading = true;
      var index = _.findIndex(vm.answers, function (answer) {
        return answer.optionId === String(option.id);
      });
      PollWidgetModel.deleteAnswer(vm.widget._id, vm.answers[index].id).then(function () {
        refreshVotes();
        option.checked = false;
        vm.answers.splice(index, 1);
      }).finally(function () { vm.loading = false; });
    }

    vm.$onInit = function () {
      $scope.$watch(function () { return vm.widget.settings; }, function (before, after) {
        if (before !== after) {
          _refreshWidget();
        }
      });

      _refreshWidget();
    };
  }

})(angular);
