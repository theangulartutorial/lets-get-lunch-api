"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var events_1 = require("../../controllers/events");
var router = express.Router();
router.route('/')
    .post(events_1.default.create)
    .patch(events_1.default.subscribe);
router.route('/:id')
    .get(events_1.default.get);
router.route('/user/:id')
    .get(events_1.default.getEventsForUser);
exports.default = router;
