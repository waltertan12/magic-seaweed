'use strict';

// Dependencies
const request = require('request');
const qs      = require('querystring');
const Promise = require('bluebird');
const Utils   = require('./utils');

// REST API configuration
const defaultHost    = 'http://magicseaweed.com/api/';
const defaultTimeout = 31000;

var MagicSeaweed = function () {
    this.initialized = false;
};

MagicSeaweed.prototype.init = function (options) {
    this.apiKey = options.apiKey || '';
    this.host = options.host || defaultHost;
    this.timeout = options.timeout || defaultTimeout; // request timeout in milliseconds

    this.initialized = true;
};

/**
 * Accepts an options hash that will be stringified
 * 
 * @param  {Object}  options
 * @return {Promise}
 */
MagicSeaweed.prototype.getForecast = function (options) {
    if (!this.initialized) throw new Error('MagicSeaweed is not initialized');
    if (!options.spot_id && options.spot_id != 0) throw new Error('Missing "spot_id" in options hash');

    var client = this,
        requestOptions = Utils.getRequestOptions(client, options),
        deferred = Utils.deferred();

    request(requestOptions, function (err, res, body) {
        var data = Utils.getData(err, body),
            error = Utils.getError(err, res, data);

        if (error) deferred.reject(error);
        else deferred.resolve(data);
    });

    return deferred.promise;
};

/**
 * @param  {Object} options
 * @return {string}
 */
MagicSeaweed.prototype.getUrl = function (options) {
    return this.host + this.apiKey + '/forecast/?' + qs.stringify(options);
};

module.exports = new MagicSeaweed();