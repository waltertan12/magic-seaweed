'use strict';

// Dependencies
const request = require('request');
const qs      = require('querystring');
const Promise = require('bluebird');

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
 * Accepts an options object that will be stringified
 * 
 * @param  {[type]} options
 * @return {[type]}
 */
MagicSeaweed.prototype.getForecast = function (options) {
    if (!this.initialized) throw new Error('MagicSeaweed is not initialized');
    if (!options.spot_id && options.spot_id != 0) throw new Error('Missing "spot_id" in options hash');

    var client = this,
        requestOptions = _getRequestOptions(client, options),
        deferred = _deferred();

    request(requestOptions, function (err, res, body) {
        var data = _getData(err, body),
            error = _getError(err, res, data);

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

/**
 * Create a deferred object
 * 
 * @return {Object}
 */
var _deferred = function () {
    var resolve, reject;
    var promise = new Promise(function () {
        resolve = arguments[0];
        reject = arguments[1];
    });

    return {
        'resolve': resolve,
        'reject': reject,
        'promise': promise
    };
};

/**
 * Get data for a request
 * 
 * @param  {Object} err
 * @param  {Object} body
 * @return {Object} data
 */
var _getData = function (err, body) {
    var data;

    try {
        if (err) data = err;
        else data = body ? JSON.parse(body) : null;
    } catch (e) {
        data = { status: 500, message: (e.message || 'Invalid JSON body') };
    }

    return data;
}

/**
 * Get error for a request. Returns null if no error
 * 
 * @param  {Object}         err
 * @param  {Object}         res
 * @return {Object|null}    error
 */
var _getError = function (err, res, data) {
    var error = null;

    // request doesn't think 4xx is an error - we want an error for any non-2xx status codes
    if (err || (res && (res.statusCode < 200 || res.statusCode > 206))) {
        error = {};
        // res is null if server is unreachable
        if (res) {
            error.status = res.statusCode;
            error.message = data ? data.message : 'Unable to complete HTTP request';
            error.code = data && data.code;
            error.moreInfo = data && data.more_info;
        } else {
            error.status = err.code;
            error.message = 'Unable to reach host: "' + client.host + '"';
        }
    }

    return error;
};

/**
 * Builds request options given the magic seaweed client and options hash
 * 
 * @param  {MagicSeaweed} client
 * @param  {Object}       options
 * @return {Object}
 */
var _getRequestOptions = function (client, options) {
    var requestOptions = {};

    // Prepare request options
    // Add base URL if we weren't given an absolute one
    requestOptions.url = client.getUrl(options);
    requestOptions.headers = {
        'Accept': 'application/json',
        'Accept-Charset': 'utf-8'
    };
    requestOptions.timeout = client.timeout;

    return requestOptions;
};

module.exports = new MagicSeaweed();