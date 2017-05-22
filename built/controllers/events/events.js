"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var event_1 = require("../../models/event");
var moment = require("moment");
function create(req, res) {
    var start = moment(req.body.startTime, moment.ISO_8601);
    var end = moment(req.body.endTime, moment.ISO_8601);
    var event = new event_1.default({
        _creator: req.body._creator,
        title: req.body.title,
        description: req.body.description,
        city: req.body.city,
        state: req.body.state,
        startTime: start,
        endTime: end,
        suggestLocations: req.body.suggestLocations,
        members: [req.body._creator]
    });
    event.save()
        .then(function (event) {
        res.status(200).json(event);
    })
        .catch(function (err) {
        res.status(500).json({ message: 'Event could not be created!' });
    });
}
function get(req, res) {
    event_1.default.findOne({ _id: req.params.id })
        .exec()
        .then(function (event) {
        res.status(200).json(event);
    })
        .catch(function (err) {
        if (err.name === 'CastError') {
            res.status(404).json({ message: 'This event does not exist!' });
        }
        else {
            res.status(404).json(err);
        }
    });
}
function subscribe(req, res) {
    event_1.default.findOne({ _id: req.body.event })
        .exec()
        .then(function (event) {
        if (event.members.indexOf(req.body.user) === -1) {
            event.members.push(req.body.user);
            event.save()
                .then(function (updatedEvent) {
                res.status(200).json(updatedEvent);
            });
        }
        else {
            res.status(400).json({ message: 'You are already a member of this event.' });
        }
    })
        .catch(function (err) {
        res.status(404).json({ message: 'This event does not exist!' });
    });
}
function getEventsForUser(req, res) {
    event_1.default.find({ members: req.params.id })
        .exec()
        .then(function (events) {
        if (!events.length) {
            res.status(404).json({ resource: 'events', message: 'This user is not a member of any events.' });
        }
        else {
            res.status(200).json(events);
        }
    })
        .catch(function (err) {
        if (err.name === 'CastError') {
            res.status(404).json({ message: 'This user does not exist!' });
        }
        else {
            res.status(500).json({ message: 'Something went wrong!' });
        }
    });
}
exports.default = { get: get, create: create, subscribe: subscribe, getEventsForUser: getEventsForUser };
