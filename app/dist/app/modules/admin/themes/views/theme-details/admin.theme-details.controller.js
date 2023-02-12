(function (angular) {
  'use strict';

  angular
      .module('coyo.admin.themes')
      .controller('AdminThemeDetailsController', AdminThemeDetailsController);

  function AdminThemeDetailsController($state, $q, Upload, tempUploadService, coyoEndpoints, coyoNotification,
                                       themeService, backendUrl, themes, theme) {
    var vm = this;
    var tempUploadExpirySeconds = 1800;

    vm.themes = themes;
    vm.theme = theme;
    vm.theme.settings = vm.theme.settings || {};
    vm.theme.variables = vm.theme.variables || {};
    vm.variables = []; // temp. storage for variables
    vm.images = {}; // temp. storage for images
    vm.activeTab = 'colors';

    vm.settingConfigs = [
      {key: 'color-primary', displayName: 'ADMIN.THEMES.COLORS.COLOR_PRIMARY', defaultValue: '#374555'},
      {key: 'color-secondary', displayName: 'ADMIN.THEMES.COLORS.COLOR_GRADIENT', defaultValue: '#242f39'},
      {key: 'color-navbar-border', displayName: 'ADMIN.THEMES.COLORS.COLOR_NAVBAR_BORDER', defaultValue: '#9bbf29'},
      {key: 'coyo-navbar-text', displayName: 'ADMIN.THEMES.COLORS.COLOR_NAVBAR_TEXT', defaultValue: '#fdfdfd'},
      {key: 'coyo-navbar', displayName: 'ADMIN.THEMES.COLORS.COLOR_NAVBAR', defaultValue: '#374555'},
      {key: 'coyo-navbar-active', displayName: 'ADMIN.THEMES.COLORS.COLOR_NAVBAR_ACTIVE', defaultValue: '#26303B'},
      {key: 'btn-primary-color', displayName: 'ADMIN.THEMES.COLORS.COLOR_BTN_PRIMARY_COLOR', defaultValue: '#fff'},
      {key: 'btn-primary-bg', displayName: 'ADMIN.THEMES.COLORS.COLOR_BTN_PRIMARY_BG', defaultValue: '#374555'},
      {key: 'color-background-main', displayName: 'ADMIN.THEMES.COLORS.COLOR_BACKGROUND_MAIN', defaultValue: '#e8e8e8'},
      {key: 'text-color', displayName: 'ADMIN.THEMES.COLORS.COLOR_TEXT', defaultValue: '#333'},
      {key: 'link-color', displayName: 'ADMIN.THEMES.COLORS.COLOR_LINK', defaultValue: '#317DC1'}
    ];

    vm.imageConfigs = [{
      key: 'image-coyo-front',
      retinaKey: 'image-coyo-front-hd',
      displayName: 'ADMIN.THEMES.LOGOS.IMAGE_COYO_FRONT.DISPLAY_NAME',
      help: 'ADMIN.THEMES.LOGOS.IMAGE_COYO_FRONT.HELP',
      defaultUrl: '/assets/images/logos/coyo/logo-coyo-inversed-front-hd.png',
      width: 476,
      // workaround for bug in chrome, where image/* causes the file select dialog to open very slowly
      // http://stackoverflow.com/questions/39187857/inputfile-accept-image-open-dialog-so-slow-with-chrome
      acceptTypes: 'image/png, image/jpeg, image/gif',
      // variables are set to the result of the given fn (must be a promise), after a new image has been selected
      variables: {
        'height-image-front': function (originalFile, resizedFile) {
          return Upload.imageDimensions(resizedFile).then(function (dimensions) {
            return dimensions.height + 'px';
          });
        }
      }
    }, {
      key: 'image-coyo-nav',
      retinaKey: 'image-coyo-nav-hd',
      displayName: 'ADMIN.THEMES.LOGOS.IMAGE_COYO_NAV.DISPLAY_NAME',
      help: 'ADMIN.THEMES.LOGOS.IMAGE_COYO_NAV.HELP',
      defaultUrl: '/assets/images/logos/coyo/logo-coyo-inversed-nav-hd.png',
      height: 50,
      acceptTypes: 'image/png, image/jpeg, image/gif',
      // variables are set to the result of the given fn (must be a promise), after a new image has been selected
      variables: {
        'width-navbar-brand': function (originalFile, resizedFile) {
          return Upload.imageDimensions(resizedFile).then(function (dimensions) {
            return dimensions.width + 'px';
          });
        }
      }
    }, {
      key: 'image-coyo-favicon',
      displayName: 'ADMIN.THEMES.LOGOS.IMAGE_COYO_FAVICON.DISPLAY_NAME',
      help: 'ADMIN.THEMES.LOGOS.IMAGE_COYO_FAVICON.HELP',
      defaultUrl: '/assets/images/logos/coyo/favicon.ico',
      acceptTypes: 'image/x-icon, image/vnd.microsoft.icon'
    },
    {
      key: 'image-coyo-appleicon',
      displayName: 'ADMIN.THEMES.LOGOS.IMAGE_COYO_APPLE_ICON.DISPLAY_NAME',
      help: 'ADMIN.THEMES.LOGOS.IMAGE_COYO_APPLE_ICON.HELP',
      defaultUrl: '/assets/images/logos/coyo/apple-touch-icon.png',
      width: 180,
      height: 180,
      acceptTypes: 'image/x-icon, image/png'
    }];

    // ====================

    vm.addVariable = addVariable;
    vm.removeVariable = removeVariable;
    vm.uploadImage = uploadImage;
    vm.removeImage = removeImage;
    vm.getImgUrl = getImgUrl;
    vm.save = save;

    // ====================

    function uploadImage(imageKey) {
      var imageConfig = _.find(vm.imageConfigs, {key: imageKey});
      var imageData = vm.images[imageKey];
      if (!imageData.fileToUpload) {
        return;
      }

      // regular size
      _resize(imageData.fileToUpload, imageConfig, false).then(function (file) {
        tempUploadService.upload(file, tempUploadExpirySeconds).then(function (blob) {
          imageData.file = file;
          imageData.uid = blob.uid;
          vm.theme.settings[imageConfig.key] = _createUrl(blob.uid);
          _.forEach(_.get(imageConfig, 'variables', {}), function (fn, key) {
            $q.when(fn(imageData.fileToUpload, file)).then(function (value) {
              vm.theme.settings[key] = value;
            });
          });
        });
      });

      // retina size
      if (imageConfig.retinaKey) {
        _resize(imageData.fileToUpload, imageConfig, true).then(function (file) {
          tempUploadService.upload(file, tempUploadExpirySeconds).then(function (blob) {
            imageData.retinaFile = file;
            imageData.retinaUid = blob.uid;
            vm.theme.settings[imageConfig.retinaKey] = _createUrl(blob.uid);
          });
        });
      }
    }

    function removeImage(imageKey) {
      vm.images[imageKey] = {};
      var imageConfig = _.find(vm.imageConfigs, {key: imageKey});
      _.concat(imageConfig.key, imageConfig.retinaKey, _.keys(imageConfig.variables)).forEach(function (key) {
        delete vm.theme.settings[key];
      });
    }

    function addVariable() {
      vm.variables.push({key: '', value: ''});
    }

    function removeVariable(index) {
      vm.variables.splice(index, 1);
    }

    function getImgUrl(url) {
      return url ? url.replace(new RegExp('\'', 'g'), '') : undefined;
    }

    function save() {
      var isNew = vm.theme.isNew();
      vm.theme.variables = _.pickBy(_toThemeVariables(vm.variables), _.identity);
      vm.theme.fileIds = _collectFileIds();

      return vm.theme.save().then(function () {
        vm.errorMessage = undefined;
        themeService.applyTheme();
        if (isNew || vm.themes.length > 1) {
          $state.go('^.list', {}, {reload: true});
        } else {
          coyoNotification.success('ADMIN.THEMES.SAVE.SUCCESS');
          vm.images = {};
        }
      }, function (error) {
        vm.errorMessage = error.data.message;
      });
    }

    // ====================

    function _resize(file, config, isRetina) {
      var factor = isRetina ? 2 : 1;
      if (!config.width && !config.height) {
        return $q.resolve(file);
      }

      var targetWidth = config.width ? config.width * factor : null;
      var targetHeight = config.height ? config.height * factor : null;
      return Upload.resize(file, targetWidth, targetHeight, null, null, null, null, function resizeIf(width, height) {
        if (config.width && config.width * factor > width) {
          return false;
        } else if (config.height && config.height * factor > height) {
          return false;
        }
        return true;
      });
    }

    function _collectFileIds() {
      var keys = _.map(vm.imageConfigs, 'key');
      return _.flatMap(keys, function (key) {
        return _(vm.images[key]).pick('uid', 'retinaUid').values().value();
      });
    }

    function _createUrl(uid) {
      return '\'' + backendUrl + coyoEndpoints.theme.files.replace('{id}', uid) + '\'';
    }

    function _toThemeVariables(variables) {
      var result = {};
      _.forEach(variables, function (variable) {
        result[variable.key] = variable.value;
      });
      return result;
    }

    (function _init() {
      // init vm.variables
      _.forEach(theme.variables, function (value, key) {
        vm.variables.push({key: key, value: value});
      });
      // init vm.imageConfigs
      _.forEach(vm.imageConfigs, function (imageConfig) {
        vm.images[imageConfig.key] = {};
      });
    })();
  }

})(angular);
