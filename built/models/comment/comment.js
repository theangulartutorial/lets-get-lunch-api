"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var CommentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    createdAt: { type: Date, required: true },
    _event: { type: Schema.Types.ObjectId, required: true, ref: 'Event', index: true },
    _creator: { type: Schema.Types.ObjectId, required: true, ref: 'User' }
});
exports.default = mongoose.model('Comment', CommentSchema);
