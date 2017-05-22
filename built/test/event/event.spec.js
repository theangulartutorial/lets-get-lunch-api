"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var event_1 = require("../../models/event");
var user_1 = require("../../models/user");
var index_1 = require("../../index");
var utils_1 = require("../utils");
describe('Event', function () {
    var eventCreator;
    var subscribingUser;
    var eventlessUser;
    var eventId;
    before(function () {
        return Promise.all([
            event_1.default.remove({}),
            user_1.default.remove({})
        ]);
    });
    before(function () {
        return utils_1.default.getUserAndToken().spread(function (user, session) {
            eventCreator = user;
        });
    });
    before(function () {
        return utils_1.default.createUserAndToken({ username: 'subscriber', password: 'foobar' }).spread(function (user) {
            subscribingUser = user;
        });
    });
    before(function () {
        return utils_1.default.createUserAndToken({ username: 'noevents', password: 'foobar' }).spread(function (user) {
            eventlessUser = user;
        });
    });
    describe('POST Event', function () {
        it('should return an Event object with a valid payload', function () {
            var event = new event_1.default({
                _creator: eventCreator._id,
                title: 'Test Title',
                city: 'Atlanta',
                state: 'GA',
                startTime: '2017-04-01T19:00:00.000Z',
                endTime: '2017-04-01T20:00:00.000Z'
            });
            return chai.request(index_1.default)
                .post('/api/events')
                .send(event)
                .then(function (res) {
                res.should.have.status(200);
                res.body._creator.should.equal(eventCreator._id);
                res.body.members.should.contain(eventCreator._id);
                eventId = res.body._id;
            });
        });
        it('should return a 500 with an invalid payload', function () {
            var event = new event_1.default({});
            return chai.request(index_1.default)
                .post('/api/events')
                .send(event)
                .catch(function (err) {
                err.should.have.status(500);
                err.response.body.message.should.equal('Event could not be created!');
            });
        });
    });
    describe('GET Event', function () {
        it('should return an event object with a valid id', function () {
            return chai.request(index_1.default)
                .get('/api/events/' + eventId)
                .then(function (res) {
                res.should.have.status(200);
                res.body._id.should.equal(eventId);
            });
        });
        it('should return a 404 if an event cannot be found', function () {
            return chai.request(index_1.default)
                .get('/api/events/' + 12345)
                .catch(function (err) {
                err.should.have.status(404);
                err.response.body.message.should.equal('This event does not exist!');
            });
        });
    });
    describe('PATCH Event', function () {
        it('should return a 404 if an event cannot be found', function () {
            var payload = { event: 12345 };
            return chai.request(index_1.default)
                .patch('/api/events')
                .send(payload)
                .catch(function (err) {
                err.should.have.status(404);
                err.response.body.message.should.equal('This event does not exist!');
            });
        });
        it('should return a 400 if the user is already subscribed to the event', function () {
            var payload = { event: eventId, user: eventCreator._id };
            return chai.request(index_1.default)
                .patch('/api/events')
                .send(payload)
                .catch(function (err) {
                err.should.have.status(400);
                err.response.body.message.should.equal('You are already a member of this event.');
            });
        });
        it('should return a 200 if the user is successfully subscribed to the event', function () {
            var payload = { event: eventId, user: subscribingUser._id };
            return chai.request(index_1.default)
                .patch('/api/events')
                .send(payload)
                .then(function (res) {
                res.should.have.status(200);
                res.body.members.should.contain(subscribingUser._id);
            });
        });
    });
    describe('GET Events for User', function () {
        it('should return a collection of events for a user who is subscribed to events', function () {
            return chai.request(index_1.default)
                .get('/api/events/user/' + eventCreator._id)
                .then(function (res) {
                res.should.have.status(200);
                res.body.should.be.an('array');
                res.body[0].members.should.contain(eventCreator._id);
            });
        });
        it('should return a 404 for a user who isn\'t subscribed to events', function () {
            return chai.request(index_1.default)
                .get('/api/events/user/' + eventlessUser._id)
                .catch(function (err) {
                err.should.have.status(404);
                err.response.body.should.have.property('resource');
                err.response.body.should.have.property('message');
            });
        });
        it('should return a 404 for a user that doesn\'t exist', function () {
            return chai.request(index_1.default)
                .get('/api/events/user/' + 12345)
                .catch(function (err) {
                err.should.have.status(404);
                err.response.body.message.should.equal('This user does not exist!');
            });
        });
    });
    after(function () {
        return Promise.all([
            event_1.default.remove({}),
            user_1.default.remove({})
        ]);
    });
});
