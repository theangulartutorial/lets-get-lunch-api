import Event from '../../models/event';
import User from '../../models/user';
import * as rp from 'request-promise';

let config: any;

if (process.env.NODE_ENV === 'test') {
  config = require('../../config.json');
}

let ZOMATO = process.env.ZOMATO_KEY || config.zomato;

function get(req, res) {
  let sourceEvent: any;
  let eventCity: any;
  let eventPreferences: any;

  getEvent(req.params.id).then((event) => {
    sourceEvent = event;
    return createCityRequestOptions(event);
  })
  .then(getZomatoCitiesByName)
  .then((locations) => {
    eventCity = getZomatoCityForEvent(locations, sourceEvent);
    return getMembersInEvent(sourceEvent);
  })
  .then((members) => {
    let preferences = parseMemberPreferences(members);
    return eventPreferences = dedupePreferences(preferences);
  })
  .then((preferences) => {
    let query = createCuisineRequestOptions(eventCity);
    return getZomatoCuisines(query);
  })
  .then((cuisineList) => {
    let filtered = filterCuisinesFromPreferences(cuisineList, eventPreferences);
    let preferencesQueryString = generatePreferencesQueryString(filtered);
    return preferencesQueryString;
  })
  .then((preferences) => {
    return createRestaurantsRequestOptions(eventCity, preferences);
  })
  .then(getZomatoRestaurantSuggestions)
  .then((result) => {
    res.status(200).json(result);
  })
  .catch((err) => {
    res.status(500).json(err);
  });
}

function getMembersInEvent(event) {
  return User
    .find({})
    .where('_id').in(event.members)
    .exec();
}

function getEvent(event) {
  return Event.findOne({ _id: event }).exec();
}

function createCityRequestOptions(event) {
  return {
    'uri': 'https://developers.zomato.com/api/v2.1/cities',
    'qs': {
      'q': event.city
    },
    'headers': {
      'user-key': ZOMATO
    },
    'json': true
  };
}

function createRestaurantsRequestOptions (city, cuisines) {
  return {
    'uri': 'https://developers.zomato.com/api/v2.1/search',
    'qs': {
      'entity_id': city.id,
      'entity_type': 'city',
      'cuisines': cuisines
    },
    'headers': {
      'user-key': ZOMATO
    },
    'json': true
  };
}

function createCuisineRequestOptions (city) {
  return {
    'uri': 'https://developers.zomato.com/api/v2.1/cuisines',
    'qs': {
      'city_id': city.id,
    },
    'headers': {
      'user-key': ZOMATO
    },
    'json': true
  }
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
  let result = cities.location_suggestions.filter((city) => {
    if (city.state_code === event.state && city.name.includes(event.city)) {
      return city;
    }
  });
  return result[0];
}

function parseMemberPreferences(users) {
  let preferences: any = [];
  users.map((user) => {
    user.dietPreferences.map((preference) => {
      preferences.push(preference);
    });
  });
  return preferences;
}

function dedupePreferences(preferences) {
  return preferences.filter((elem, index, self) => {
    return index == self.indexOf(elem);
  });
}

function generatePreferencesQueryString(preferences) {
  let list: string = '';
  if (preferences.length) {
    preferences.map((preference) => {
      if (list.length) {
        list += ',' + preference.cuisine.cuisine_id;
      } else {
        list += preference.cuisine.cuisine_id;
      }
      return preference;
    });
    return list;
  }
  return '';
}

function filterCuisinesFromPreferences(zomatoCuisines, eventCuisines) {
  return zomatoCuisines.cuisines.filter((elem) => {
    if (eventCuisines.indexOf(elem.cuisine.cuisine_name) !== -1) {
      return elem.cuisine;
    }
  });
}

export default { get };
