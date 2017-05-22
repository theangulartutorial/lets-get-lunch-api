"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rp = require("request-promise");
var sinon = require("sinon");
var user_1 = require("../../models/user");
var event_1 = require("../../models/event");
var utils_1 = require("../utils");
var index_1 = require("../../index");
var zomato_1 = require("../mocks/zomato");
var ZomatoCitiesResponse = zomato_1.default.ZomatoCitiesResponse;
var ZomatoRestaurantsResponse = zomato_1.default.ZomatoRestaurantsResponse;
var ZomatoCuisinesResponse = zomato_1.default.ZomatoCuisinesResponse;
describe('Recommendation', function () {
    var user;
    var event;
    var zomatoSpy;
    before(function () {
        zomatoSpy = sinon.stub(rp, 'get');
        zomatoSpy.onFirstCall().returns(ZomatoCitiesResponse);
        zomatoSpy.onSecondCall().returns(ZomatoCuisinesResponse);
        zomatoSpy.onThirdCall().returns(ZomatoRestaurantsResponse);
    });
    before(function () {
        return Promise.all([
            user_1.default.remove({}),
            event_1.default.remove({})
        ]);
    });
    before(function () {
        return utils_1.default.getUserAndToken().spread(function (newUser, session) {
            user = newUser;
        });
    });
    before(function () {
        var newEvent = new event_1.default({
            _creator: user._id,
            title: 'Test Title',
            city: 'Atlanta',
            state: 'GA',
            startTime: '2017-04-01T19:00:00.000Z',
            endTime: '2017-04-01T20:00:00.000Z'
        });
        return chai.request(index_1.default)
            .post('/api/events')
            .send(newEvent)
            .then(function (res) {
            res.should.have.status(200);
            res.body._creator.should.equal(user._id);
            event = res.body;
        });
    });
    describe('GET Recommendation', function () {
        it('should return locations with a valid event', function () {
            return chai.request(index_1.default)
                .get('/api/recommendations/' + event._id)
                .then(function (res) {
                res.should.have.status(200);
                res.body.should.have.property('restaurants');
                sinon.assert.calledThrice(zomatoSpy);
                zomatoSpy.reset();
            });
        });
        it('should return a 500 with an invalid event', function () {
            return chai.request(index_1.default)
                .get('/api/recommendations/' + 1)
                .catch(function (err) {
                err.response.should.have.status(500);
                sinon.assert.notCalled(zomatoSpy);
            });
        });
    });
    after(function () {
        return Promise.all([
            user_1.default.remove({}),
            event_1.default.remove({})
        ]);
    });
});
