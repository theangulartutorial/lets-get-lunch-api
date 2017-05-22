"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var user_1 = require("../../models/user");
var index_1 = require("../../index");
var utils_1 = require("../utils");
describe('User', function () {
    before(function () {
        return user_1.default.remove({});
    });
    describe('GET User', function () {
        var myUser;
        before(function () {
            return utils_1.default.getUserAndToken().spread(function (user, session) {
                myUser = user;
            });
        });
        it('should return a User object with a valid username', function () {
            return chai.request(index_1.default)
                .get('/api/users/' + myUser.username)
                .then(function (res) {
                res.should.have.status(200);
                res.body.username.should.eql(myUser.username);
            });
        });
        it('should return a 404 with an invalid username', function () {
            return chai.request(index_1.default)
                .get('/api/users/' + 'missingno')
                .catch(function (err) {
                err.should.have.status(404);
                err.response.body.should.have.property('resource');
                err.response.body.should.have.property('message');
            });
        });
    });
    describe('POST User', function () {
        before(function () {
            var user = new user_1.default({
                username: 'duplicate',
                password: 'password'
            });
            return user.save();
        });
        it('should return a user object with a valid username and password', function () {
            var user = { username: 'testuser', password: 'password', dietRestrictions: ['Vegan'] };
            return chai.request(index_1.default)
                .post('/api/users')
                .send(user)
                .then(function (res) {
                res.should.have.status(200);
                res.body.should.have.property('_id');
                res.body.should.have.property('dietRestrictions');
                res.body.username.should.eql(user.username);
            });
        });
        it('should return an error with a password that is too short', function () {
            var user = { username: 'testuser', password: 'abc' };
            return chai.request(index_1.default)
                .post('/api/users')
                .send(user)
                .catch(function (err) {
                err.should.have.status(400);
                err.response.body.should.have.property('message');
            });
        });
        it('should return an error for a username that already exists', function () {
            var user = { username: 'duplicate', password: 'password' };
            return chai.request(index_1.default)
                .post('/api/users')
                .send(user)
                .catch(function (err) {
                err.should.have.status(400);
                err.response.body.should.have.property('message');
            });
        });
        it('should return an error for a user with invalid dietary restrictions', function () {
            var user = { username: 'foodie', password: 'password', dietRestrictions: ['Keto'] };
            return chai.request(index_1.default)
                .post('/api/users')
                .send(user)
                .catch(function (err) {
                err.should.have.status(400);
                err.response.body.should.have.property('message');
            });
        });
        it('should return an error for a user with invalid dietary preferences', function () {
            var user = { username: 'foodie', password: 'password', dietPreferences: ['Acai Bowls'] };
            return chai.request(index_1.default)
                .post('/api/users')
                .send(user)
                .catch(function (err) {
                err.should.have.status(400);
                err.response.body.should.have.property('message');
            });
        });
    });
    after(function () {
        return user_1.default.remove({});
    });
});
