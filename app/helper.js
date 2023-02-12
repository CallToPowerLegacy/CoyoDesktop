/**
 * COYO Desktop
 * 
 * (c) Copyright 2017 Denis Meyer. All rights reserved.
 */
'use strict';

const logger = require('./logger');

function extractDomainData(url) {
  logger.logDebug('helper', 'extractDomainData', url);

  if (!url) {
    return {};
  }

  let protocol;
  let domain;
  if (url.indexOf('://') > -1) {
    protocol = url.split('://')[0];
    domain = url.split('/')[2];
  } else {
    domain = url.split('/')[0];
  }

  if (domain) {
    domain = domain.split(':')[0];
  }

  logger.logDebug('helper', 'extractDomainData - parsed values: ', {protocol: protocol, domain: domain});

  return {protocol: protocol, domain: domain};
}

module.exports = {
  extractDomainData: extractDomainData
};
