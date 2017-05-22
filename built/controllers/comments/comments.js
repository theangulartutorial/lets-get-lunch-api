"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var comment_1 = require("../../models/comment");
var moment = require("moment");
function create(req, res) {
    var now = moment().toISOString();
    var comment = new comment_1.default({
        content: req.body.content,
        createdAt: moment.now(),
        _event: req.body._event,
        _creator: req.body._creator,
    });
    comment.save()
        .then(function (comment) {
        res.status(200).json(comment);
    })
        .catch(function (err) {
        res.status(500).json({ message: 'Comment could not be created!' });
    });
}
function get(req, res) {
    comment_1.default
        .find({})
        .where('_event').equals(req.params.id)
        .exec()
        .then(function (comments) {
        if (!comments.length) {
            res.status(404).json({ resource: 'comments', message: 'No comments exist for this event.' });
        }
        else {
            res.status(200).json(comments);
        }
    });
}
exports.default = { create: create, get: get };
