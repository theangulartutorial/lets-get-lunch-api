"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var recommendations_1 = require("../../controllers/recommendations");
var router = express.Router();
router.route('/:id')
    .get(recommendations_1.default.get);
exports.default = router;
