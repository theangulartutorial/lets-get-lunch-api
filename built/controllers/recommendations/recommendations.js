"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var event_1 = require("../../models/event");
var user_1 = require("../../models/user");
var rp = require("request-promise");
var config = require('../../dev.json');
function get(req, res) {
    var sourceEvent;
    var eventCity;
    var eventPreferences;
    getEvent(req.params.id).then(function (event) {
        sourceEvent = event;
        return createCityRequestOptions(event);
    })
        .then(getZomatoCitiesByName)
        .then(function (locations) {
        eventCity = getZomatoCityForEvent(locations, sourceEvent);
        return getMembersInEvent(sourceEvent);
    })
        .then(function (members) {
        var preferences = parseMemberPreferences(members);
        return eventPreferences = dedupePreferences(preferences);
    })
        .then(function (preferences) {
        var query = createCuisineRequestOptions(eventCity);
        return getZomatoCuisines(query);
    })
        .then(function (cuisineList) {
        var filtered = filterCuisinesFromPreferences(cuisineList, eventPreferences);
        var preferencesQueryString = generatePreferencesQueryString(filtered);
        return preferencesQueryString;
    })
        .then(function (preferences) {
        return createRestaurantsRequestOptions(eventCity, preferences);
    })
        .then(getZomatoRestaurantSuggestions)
        .then(function (result) {
        res.status(200).json(result);
    })
        .catch(function (err) {
        res.status(500).json(err);
    });
}
function getMembersInEvent(event) {
    return user_1.default
        .find({})
        .where('_id').in(event.members)
        .exec();
}
function getEvent(event) {
    return event_1.default.findOne({ _id: event }).exec();
}
function createCityRequestOptions(event) {
    return {
        'uri': 'https://developers.zomato.com/api/v2.1/cities',
        'qs': {
            'q': event.city
        },
        'headers': {
            'user-key': config.zomato
        },
        'json': true
    };
}
function createRestaurantsRequestOptions(city, cuisines) {
    return {
        'uri': 'https://developers.zomato.com/api/v2.1/search',
        'qs': {
            'entity_id': city.id,
            'entity_type': 'city',
            'cuisines': cuisines
        },
        'headers': {
            'user-key': config.zomato
        },
        'json': true
    };
}
function createCuisineRequestOptions(city) {
    return {
        'uri': 'https://developers.zomato.com/api/v2.1/cuisines',
        'qs': {
            'city_id': city.id,
        },
        'headers': {
            'user-key': config.zomato
        },
        'json': true
    };
}
function getZomatoCitiesByName(options) {
    return rp.get(options);
}
function getZomatoRestaurantSuggestions(options) {
    return rp.get(options);
}
function getZomatoCuisines(options) {
    return rp.get(options);
}
function getZomatoCityForEvent(cities, event) {
    var result = cities.location_suggestions.filter(function (city) {
        if (city.state_code === event.state && city.name.includes(event.city)) {
            return city;
        }
    });
    return result[0];
}
function parseMemberPreferences(users) {
    var preferences = [];
    users.map(function (user) {
        user.dietPreferences.map(function (preference) {
            preferences.push(preference);
        });
    });
    return preferences;
}
function dedupePreferences(preferences) {
    return preferences.filter(function (elem, index, self) {
        return index == self.indexOf(elem);
    });
}
function generatePreferencesQueryString(preferences) {
    var list = '';
    if (preferences.length) {
        preferences.map(function (preference) {
            if (list.length) {
                list += ',' + preference.cuisine.cuisine_id;
            }
            else {
                list += preference.cuisine.cuisine_id;
            }
            return preference;
        });
        return list;
    }
    return '';
}
function filterCuisinesFromPreferences(zomatoCuisines, eventCuisines) {
    return zomatoCuisines.cuisines.filter(function (elem) {
        if (eventCuisines.indexOf(elem.cuisine.cuisine_name) !== -1) {
            return elem.cuisine;
        }
    });
}
exports.default = { get: get };
