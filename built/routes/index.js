"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var users_1 = require("./users");
var sessions_1 = require("./sessions");
var events_1 = require("./events");
var comments_1 = require("./comments");
var recommendations_1 = require("./recommendations");
var router = express.Router();
router.route('/')
    .get(function (req, res) {
    res.send('Congratulations! Your local API is working!');
});
router.use('/users', users_1.default);
router.use('/sessions', sessions_1.default);
router.use('/events', events_1.default);
router.use('/comments', comments_1.default);
router.use('/recommendations', recommendations_1.default);
exports.default = router;
