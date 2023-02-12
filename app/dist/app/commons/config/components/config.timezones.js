(function (angular) {
  'use strict';

  angular
      .module('commons.config')
      .constant('timeZones', {
        'Pacific/Pago_Pago': -660,
        'Pacific/Honolulu': -600,
        'America/Anchorage': -540,
        'America/Los_Angeles': -480,
        'America/Denver': -420,
        'America/Chicago': -360,
        'America/New_York': -300,
        'America/Caracas': -270,
        'America/Santiago': -240,
        'America/St_Johns': -210,
        'America/Sao_Paulo': -180,
        'America/Noronha': -120,
        'America/Scoresbysund': -60,
        'Europe/London': 0,
        'Europe/Berlin': 60,
        'Europe/Athens': 120,
        'Africa/Nairobi': 180,
        'Asia/Tehran': 210,
        'Asia/Baku': 240,
        'Asia/Kabul': 270,
        'Asia/Karachi': 300,
        'Asia/Colombo': 330,
        'Asia/Kathmandu': 345,
        'Asia/Dhaka': 360,
        'Asia/Rangoon': 390,
        'Asia/Jakarta': 420,
        'Asia/Singapore': 480,
        'Australia/Eucla': 525,
        'Asia/Tokyo': 540,
        'Australia/Adelaide': 570,
        'Australia/Sydney': 600,
        'Australia/Lord_Howe': 630,
        'Asia/Vladivostok': 660,
        'Pacific/Norfolk': 690,
        'Pacific/Auckland': 720,
        'Pacific/Chatham': 765,
        'Pacific/Enderbury': 780,
        'Pacific/Kiritimati': 840
      });

})(angular);
