"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../index");
var Promise = require("bluebird");
var userCredentials = { username: 'johndoe', password: 'password', dietPreferences: ['BBQ', 'Japanese'] };
var getUserAndToken = function () {
    return Promise.mapSeries([createDummyUser, loginUser], function (func) {
        return func();
    });
};
var createUserAndToken = function (user) {
    return Promise.mapSeries([createCustomUser, loginCustomUser], function (func) {
        return func(user);
    });
};
function createCustomUser(user) {
    return new Promise(function (resolve, reject) {
        chai.request(index_1.default)
            .post('/api/users')
            .send(user)
            .end(function (err, res) {
            return resolve(res.body);
        });
    });
}
function createDummyUser() {
    return new Promise(function (resolve, reject) {
        chai.request(index_1.default)
            .post('/api/users')
            .send(userCredentials)
            .end(function (err, res) {
            return resolve(res.body);
        });
    });
}
function loginUser() {
    return new Promise(function (resolve, reject) {
        chai.request(index_1.default)
            .post('/api/sessions')
            .send(userCredentials)
            .end(function (err, res) {
            return resolve(res.body);
        });
    });
}
function loginCustomUser(user) {
    return new Promise(function (resolve, reject) {
        chai.request(index_1.default)
            .post('/api/sessions')
            .send(user)
            .end(function (err, res) {
            return resolve(res.body);
        });
    });
}
exports.default = { getUserAndToken: getUserAndToken, createUserAndToken: createUserAndToken };
