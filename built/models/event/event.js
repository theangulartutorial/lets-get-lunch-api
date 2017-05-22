"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
// TODO add preferences - event specific if suggestLocations isn't true
var EventSchema = new mongoose.Schema({
    _creator: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    title: { type: String, required: true },
    description: { type: String },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    city: { type: String, required: true },
    state: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    suggestLocations: { type: Boolean, default: false }
});
exports.default = mongoose.model('Event', EventSchema);
