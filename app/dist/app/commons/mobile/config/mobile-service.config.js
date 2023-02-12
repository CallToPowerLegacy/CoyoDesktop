(function () {
  'use strict';

  angular
      .module('commons.mobile')
      .constant('mobileServiceConfig', {
        storageKeyPrefix: '__mobile_',
        keyDeviceRegistration: 'device-registration',
        mobileValueChangedEventName: 'onMobileValueChanged',
        getValueCallbackMethodName: 'getValueCallback'
      });

})();
