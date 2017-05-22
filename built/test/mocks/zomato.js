"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ZomatoCitiesResponse = {
    "location_suggestions": [
        {
            "id": 288,
            "name": "Atlanta, GA",
            "country_id": 216,
            "country_name": "United States",
            "should_experiment_with": 0,
            "discovery_enabled": 1,
            "has_new_ad_format": 0,
            "is_state": 0,
            "state_id": 78,
            "state_name": "Georgia",
            "state_code": "GA"
        }
    ],
    "status": "success",
    "has_more": 0,
    "has_total": 0
};
var ZomatoRestaurantsResponse = {
    "results_found": 11172,
    "results_start": 0,
    "results_shown": 20,
    "restaurants": [
        {
            "restaurant": {
                "R": {
                    "res_id": 16895009
                },
                "apikey": "c7803226951a33f15b8597c0e12d3184",
                "id": "16895009",
                "name": "Two Urban Licks",
                "url": "https://www.zomato.com/atlanta/two-urban-licks-poncey-highlands?utm_source=api_basic_user&utm_medium=api&utm_campaign=v2.1",
                "location": {
                    "address": "820 Ralph McGill Boulevard, Poncey-Highlands, GA 30306",
                    "locality": "Poncey-Highlands",
                    "city": "Atlanta",
                    "city_id": 288,
                    "latitude": "33.7693998000",
                    "longitude": "-84.3616748000",
                    "zipcode": "30306",
                    "country_id": 216,
                    "locality_verbose": "Poncey-Highlands, Atlanta"
                },
                "switch_to_order_menu": 0,
                "cuisines": "American, Bar Food",
                "average_cost_for_two": 50,
                "price_range": 4,
                "currency": "$",
                "offers": [],
                "thumb": "https://b.zmtcdn.com/data/pictures/9/16895009/3838bb8f1cd2221e08b840c8349bf061_featured_v2.jpg",
                "user_rating": {
                    "aggregate_rating": "4.7",
                    "rating_text": "Excellent",
                    "rating_color": "3F7E00",
                    "votes": "2411"
                },
                "photos_url": "https://www.zomato.com/atlanta/two-urban-licks-poncey-highlands/photos?utm_source=api_basic_user&utm_medium=api&utm_campaign=v2.1#tabtop",
                "menu_url": "https://www.zomato.com/atlanta/two-urban-licks-poncey-highlands/menu?utm_source=api_basic_user&utm_medium=api&utm_campaign=v2.1&openSwipeBox=menu&showMinimal=1#tabtop",
                "featured_image": "https://b.zmtcdn.com/data/pictures/9/16895009/3838bb8f1cd2221e08b840c8349bf061_featured_v2.jpg",
                "has_online_delivery": 0,
                "is_delivering_now": 0,
                "deeplink": "zomato://restaurant/16895009",
                "has_table_booking": 0,
                "events_url": "https://www.zomato.com/atlanta/two-urban-licks-poncey-highlands/events#tabtop?utm_source=api_basic_user&utm_medium=api&utm_campaign=v2.1",
                "establishment_types": []
            }
        }
    ]
};
var ZomatoCuisinesResponse = {
    "cuisines": [
        {
            "cuisine": {
                "cuisine_id": 6,
                "cuisine_name": "Afghani"
            }
        },
        {
            "cuisine": {
                "cuisine_id": 152,
                "cuisine_name": "African"
            }
        },
        {
            "cuisine": {
                "cuisine_id": 1,
                "cuisine_name": "American"
            }
        },
        {
            "cuisine": {
                "cuisine_id": 151,
                "cuisine_name": "Argentine"
            }
        },
        {
            "cuisine": {
                "cuisine_id": 175,
                "cuisine_name": "Armenian"
            }
        },
        {
            "cuisine": {
                "cuisine_id": 193,
                "cuisine_name": "BBQ"
            }
        }
    ]
};
exports.default = { ZomatoCitiesResponse: ZomatoCitiesResponse, ZomatoRestaurantsResponse: ZomatoRestaurantsResponse, ZomatoCuisinesResponse: ZomatoCuisinesResponse };
