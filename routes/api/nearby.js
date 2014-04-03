var _ = require('underscore'),
  async = require('async'),
	keystone = require('keystone'),
  geolib = require('geolib');

var Fence = keystone.list('Geofence');

/*
 * When the user is the below distance away from the center point
 * of a fence, it is safe to send a teaser message
 */
var TEASER_DISTANCE_FROM_FENCE_IN_KM = 5000;

/*
 * When the user is the below distance away from the center point
 * of a fence, it is safe to send assume a fence has been breached
 */
var ASSUME_INSIDE_DISTANCE_FROM_FENCE_IN_KM = 1000;

exports = module.exports = function(req, res) {

  var latitude = req.params.latitude;
  var longitude = req.params.longitude;

  Fence.paginate({
    page: 1,
    perPage: 100
  }).exec(function(err, fences) {
      //console.dir(fences);

      if (err) {
        res.send(500, "Error fetching list of available fences");
        return;
      } else {
        if (fences.total == 0) {
          res.send(404, "No fences available");
          return;
        }

        var marked = categorizeAndMarkFences(fences.results);
        var final = cleanupFences(marked);

        res.send(final);
      }
  });

  // Mark the fences
  function categorizeAndMarkFences(fences) {
    var reduced = _.map(fences, function(fence) {
        var withinTeaser = geolib.isPointInCircle(
          { latitude: latitude, longitude: longitude },
          { latitude: fence.latitude, longitude: fence.longitude },
          TEASER_DISTANCE_FROM_FENCE_IN_KM
        );

        var withinStore = geolib.isPointInCircle(
          { latitude: latitude, longitude: longitude },
          { latitude: fence.latitude, longitude: fence.longitude },
          ASSUME_INSIDE_DISTANCE_FROM_FENCE_IN_KM
        );

        if (!withinStore && !withinTeaser) {
          fence._removed = true;
          console.warn("Removing " + fence._id);
        } else if (!withinStore && withinTeaser) {
          console.warn("IsTeaser " + true);
          fence.isTeaser = true;
        } else if (withinStore && withinTeaser) {
          console.warn("IsTeaser " + false);
          fence = _.extend(fence, {'isTeaser': false});
          //fence.isTeaser = false;
        }

        console.log(fence);
        return fence;
    });

    return reduced;
  }

  function cleanupFences(fences) {
    var reduced = _.reject(fences, function(fence) {
      return fence._removed === true;
    });

    return reduced;
  }

};
