'use strict';

const chai   = require('chai');
const should = chai.should();
const Utils  = require('../lib/utils');
const apiKey = 'thisIsNotAnAPIKey';
const msw    = require('../lib/magic-seaweed');

describe('Utils', function () {
    describe('#deferred', function () {
        it ('should return a deferred object', function () {   
            var deferred = Utils.deferred();

            deferred.should.have.property('reject');
            deferred.should.have.property('resolve');
            deferred.should.have.property('promise');
        })
    });

    describe('#getData', function () {
        it ('should return a data object on a successful request', function () {
            var err = null,
                body = '{ "testProperty": true }',
                data = Utils.getData(err, body);

            data.should.have.property('testProperty');
            data.testProperty.should.be.truthy;
        });

        it ('should return a data object on an unsuccessful request', function () {
            var err = { statusCode: 400 },
                body = '',
                data = Utils.getData(err, body);

            data.should.have.property('statusCode');
            data.statusCode.should.equal(400);
        });

        it ('should return a data object if JSON.parse fails', function () {
            var err = null,
                body = 'will cause parse error',
                data = Utils.getData(err, body);

            data.should.have.property('status');
            data.should.have.property('message');
            data.status.should.equal(500);
        });
    });
});
