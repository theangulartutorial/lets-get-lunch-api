"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var user_1 = require("../../models/user");
function get(req, res) {
    user_1.default.findOne({ username: req.params.username })
        .exec()
        .then(function (user) {
        if (!user) {
            res.status(404).json({ resource: 'users', message: 'User does not exist!' });
        }
        else {
            res.status(200).json(user);
        }
    })
        .catch(function (err) {
        res.status(500).json(err);
    });
}
function create(req, res) {
    var user = new user_1.default({
        username: req.body.username,
        password: req.body.password,
        dietRestrictions: req.body.dietRestrictions,
        dietPreferences: req.body.dietPreferences
    });
    user.save()
        .then(function (user) {
        res.status(200).json(user);
    })
        .catch(function (err) {
        if (err.message === 'User validation failed') {
            res.status(400).json({ message: 'User validation failed.' });
        }
        else if (err.message === 'This user already exists!') {
            res.status(400).json({ message: 'This user already exists!' });
        }
        else {
            res.status(500).json(err);
        }
    });
}
exports.default = { get: get, create: create };
