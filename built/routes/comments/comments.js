"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var comments_1 = require("../../controllers/comments");
var router = express.Router();
router.route('/')
    .post(comments_1.default.create);
router.route('/event/:id')
    .get(comments_1.default.get);
exports.default = router;
