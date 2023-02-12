(function (angular) {
  'use strict';

  angular
      .module('coyo.widgets.poll')
      .controller('PollWidgetSettingsController', PollWidgetSettingsController);

  function PollWidgetSettingsController($scope, PollWidgetModel, $q) {
    var vm = this;
    vm.model = $scope.model;
    vm.focusedAnswer = '';

    vm.addOption = addOption;
    vm.deleteOption = deleteOption;
    vm.optionKeyPressed = optionKeyPressed;

    vm.editable = true;
    vm.optionsCount = 1;

    function addOption() {
      var newAnswer = {
        id: vm.model.settings.nextOptionId++,
        answer: '',
        newAnswer: true
      };
      vm.model.settings.options.push(newAnswer);
      vm.focusedAnswer = newAnswer.id;
    }

    function deleteOption(index) {
      vm.model.settings.options.splice(index, 1);
    }

    function optionKeyPressed($event) {
      if ($event.keyCode === 13 && !$event.ctrlKey && !$event.shiftKey) {
        $event.preventDefault();
        addOption();
      }
    }

    function onBeforeSave() {
      vm.model.settings.options = _getNonBlankOptions();
      vm.model.settings.options.forEach(function (option) {
        option.newAnswer = false;
      });
      return $q.resolve();
    }

    function _getNonBlankOptions() {
      return _.filter(vm.model.settings.options, function (elem) { return elem.answer; });
    }

    (function activate() {
      $scope.saveCallbacks.onBeforeSave = onBeforeSave;
      vm.tab = 1;

      //if this is a new widget, set the default values
      if (!vm.model.id && !vm.model.settings.options) {
        vm.model.settings = {
          nextOptionId: 2,
          options: [{answer: '', id: 1}],
          showResults: true,
          maxAnswers: 1
        };
      } else if (vm.model.id) {
        PollWidgetModel.getVotes(vm.model.id).then(function (result) {
          if (result.length !== 0) {
            vm.editable = false;
          }
        });
      }

      $scope.$watch(function () {
        return vm.model.settings.options;
      }, function () {
        vm.optionsCount = _getNonBlankOptions().length;
      }, true);

    })();
  }

})(angular);
