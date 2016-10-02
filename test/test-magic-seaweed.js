'use strict';

const chai   = require('chai');
const should = chai.should();
var   msw    = require('../lib/magic-seaweed');
const apiKey = 'thisIsNotAnAPIKey';

describe('MagicSeaweed', function () {
    // describe('#init', function () {
    //     it ('should accept an API key', function () {
    //         msw.init({ apiKey: apiKey });

    //         msw.should.have.property('apiKey');
    //         msw.apiKey.should.equal(apiKey);
    //     });
    // });

    describe('#getForecast', function () {
        it ('should fail if not initialized', function () {
            msw.initialized = false;

            try {
                msw.getForecast({ spot_id: 2 });
            } catch (e) {
                e.should.have.property('message');
                e.message.should.equal('MagicSeaweed is not initialized');
            }
        })
    });
});