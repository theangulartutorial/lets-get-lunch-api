"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var comment_1 = require("../../models/comment");
var user_1 = require("../../models/user");
var event_1 = require("../../models/event");
var utils_1 = require("../utils");
var index_1 = require("../../index");
describe('Comment', function () {
    var myUser;
    var populatedEvent;
    var emptyEvent;
    var myComment;
    before(function () {
        return Promise.all([
            user_1.default.remove({}),
            event_1.default.remove({}),
            comment_1.default.remove({})
        ]);
    });
    before(function () {
        return utils_1.default.getUserAndToken().spread(function (user, session) {
            myUser = user;
        });
    });
    before(function () {
        var event = new event_1.default({
            _creator: myUser._id,
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
            res.body._creator.should.equal(myUser._id);
            emptyEvent = res.body;
        });
    });
    before(function () {
        var event = new event_1.default({
            _creator: myUser._id,
            title: 'Event with no Comments',
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
            res.body._creator.should.equal(myUser._id);
            populatedEvent = res.body;
        });
    });
    describe('POST Comment', function () {
        it('should return a Comment object with a valid payload', function () {
            var comment = new comment_1.default({
                content: 'First comment',
                _event: populatedEvent._id,
                _creator: myUser._id
            });
            return chai.request(index_1.default)
                .post('/api/comments')
                .send(comment)
                .then(function (res) {
                res.should.have.status(200);
                res.body._creator.should.equal(myUser._id);
                res.body._event.should.equal(populatedEvent._id);
                myComment = res.body;
            });
        });
        it('should return a 500 with an invalid payload', function () {
            var comment = new comment_1.default({});
            return chai.request(index_1.default)
                .post('/api/comments')
                .send(comment)
                .catch(function (err) {
                err.should.have.status(500);
                err.response.body.message.should.equal('Comment could not be created!');
            });
        });
    });
    describe('GET Comment', function () {
        it('should return a collection of Comment objects for a given Event', function () {
            return chai.request(index_1.default)
                .get('/api/comments/event/' + populatedEvent._id)
                .then(function (res) {
                res.should.have.status(200);
                res.body[0]._event.should.equal(populatedEvent._id);
                res.body.should.contain(myComment);
            });
        });
        it('should return a 404 for an Event with no comments', function () {
            return chai.request(index_1.default)
                .get('/api/comments/event/' + emptyEvent._id)
                .catch(function (err) {
                err.should.have.status(404);
                err.response.body.should.have.property('resource');
                err.response.body.should.have.property('message');
            });
        });
    });
    after(function () {
        return Promise.all([
            user_1.default.remove({}),
            event_1.default.remove({}),
            comment_1.default.remove({})
        ]);
    });
});
