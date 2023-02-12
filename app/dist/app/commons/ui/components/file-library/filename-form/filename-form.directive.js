(function () {
  'use strict';

  angular
      .module('commons.ui')
      .directive('oyocFilenameForm', FilenameForm)
      .controller('FilenameFormController', FilenameFormController);

  /**
   * @ngdoc directive
   * @name commons.ui.oyocFilenameForm:oyocFilenameForm
   * @element ANY
   * @restrict AE
   * @scope
   *
   * @description
   * Displays a text input field for inline editing a folder or file's name. This can also be used to creating new
   * folders by providing their name. The input box supports validating using regular expressions and submits the input
   * on "Enter" or blur.
   *
   * @param {object} file
   * The file or folder to edit or create the name for.
   *
   * @param {object} focusTrigger
   * A variable which causes the input field to gain focus if it changes.
   *
   * @param {function} onSubmit
   * A function to be triggered on submit. The function gets the file and the new file name passed as parameters. The
   * names for this parameter are "file" and "newFilename".
   */
  function FilenameForm() {
    return {
      restrict: 'E',
      templateUrl: 'app/commons/ui/components/file-library/filename-form/filename-form.html',
      scope: {},
      bindToController: {
        file: '<',
        focusTrigger: '<',
        onSubmit: '&'
      },
      controller: 'FilenameFormController',
      controllerAs: '$ctrl'
    };
  }

  function FilenameFormController() {
    var vm = this;
    vm.newFilename = vm.file.name || '';
  }
})();
