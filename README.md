[![Stories in Ready](https://badge.waffle.io/masterxen/postmark.png?label=ready&title=Ready)](https://waffle.io/masterxen/postmark)
Postmark
===================

A (minor) modification to [KeystoneJS](http://keystonejs.com/) to add a few custom APIs for:

* Populating a connected MongoDB with retail stores (e.g. Macy's or BestBuy) and their addresses, geocoordinates, storeId and more
* A basic geofencing API (to be used from mobile devices) that when sending a lat/long pair determines:
    - If the request location is _NEAR_ any stores (as a teaser)
    - If the request is _IN_ any store (to unlock a special offer)


Screenshots
-------------------

![Geofence Setup & UI](https://github.com/MasterXen/postmark/raw/master/images/Screen%20Shot%202014-04-07%20at%201.53.46%20PM.png)

![Example Request & Response](https://github.com/MasterXen/postmark/raw/master/images/Screen%20Shot%202014-04-07%20at%201.57.48%20PM.png)



API Example
-------------------

### Request:
    http://<SERVER_ADDRESS>:<PORT>/api/nearby/30.3557437/-97.7239443
    
In this example, the mobile user coordinates are:
* Latitude: 30.3557437
* Longitude: -97.7239443

### Response:
````
[
  {
    "isTeaser": false,
    "name": "Macy's - North Central Mall",
    "retailer": "Macy's",
    "isInactive": false,
    "latitude": 30.3557437,
    "longitude": -97.7239443,
    "discountPct": 19,
    "_id": "533ec620e461e638847f2856",
    "__v": 0
  },
  {
    "isTeaser": true,
    "name": "Macy's - Bee Cave",
    "retailer": "Macy's",
    "isInactive": false,
    "latitude": 30.3557437,
    "longitude": -97.7129443,
    "discountPct": 17,
    "_id": "533ec620e461e638847f2857",
    "__v": 0
  }
]
````
