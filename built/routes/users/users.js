"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var users_1 = require("../../controllers/users");
var router = express.Router();
router.route('/')
    .post(users_1.default.create);
router.route('/:username')
    .get(users_1.default.get);
exports.default = router;
