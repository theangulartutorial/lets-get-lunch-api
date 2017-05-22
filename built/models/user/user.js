"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
var Promise = require("bluebird");
var diet_restriction_1 = require("../diet-restriction");
var diet_preference_1 = require("../diet-preference");
var UserSchema = new mongoose.Schema({
    username: { type: String, index: { unique: true } },
    password: { type: String, minlength: 5, select: false },
    dietRestrictions: [{ type: String, enum: diet_restriction_1.default }],
    dietPreferences: [{ type: String, enum: diet_preference_1.default }]
});
UserSchema.pre('save', function (next) {
    var _this = this;
    if (!this.isModified('password')) {
        return next();
    }
    bcrypt.hash(this.password, 10, function (err, hash) {
        if (err) {
            return next(err);
        }
        _this.password = hash;
        next();
    });
});
UserSchema.methods.comparePassword = function (password) {
    var _this = this;
    return new Promise(function (resolve, reject) {
        bcrypt.compare(password, _this.password, function (err, res) {
            if (err) {
                return reject(err);
            }
            return resolve(res);
        });
    });
};
UserSchema.post('save', function (err, doc, next) {
    if (err.name === 'ValidationError') {
        next(new Error(err.message));
    }
    else if (err.name === 'MongoError' && err.code === 11000) {
        next(new Error('This user already exists!'));
    }
    else {
        next(err);
    }
});
exports.default = mongoose.model('User', UserSchema);
