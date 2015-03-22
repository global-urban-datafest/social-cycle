angular.module('route', [])
	.factory('RouteService', function () {

		var route = {};

		var setRoute = function (r) {
			route = r;
		};

		var getRoute = function () {
			return route;
		};

		var addProp = function (key, value) {
			route[key] = value;
		};

		return {
			setRoute: setRoute,
			getRoute: getRoute,
			addProperty: addProp
		};

	})
	.factory('DirectionsService', function (GeoLocation, $q) {
		var directionsService = new google.maps.DirectionsService();

		var route = null;

		function getRoute() {
			return route;
		}

		function calculateRoute(destination, origin, waypoints, TravelMode) {

			var deferred = $q.defer();
			//var items = ["kilcock, co.kildare, ireland"];
			var points = [];
			if (waypoints && waypoints.length) {
				for (var i = 0; i < waypoints.length; i++) {
					var address = waypoints[i].location;
					if (address !== "") {
						points.push({
							location: address,
							stopover: true
						});
					}
				}
			}

			var request = {
				origin: origin,
				destination: destination,
				waypoints: points,
				travelMode: google.maps.TravelMode.BICYCLING //TravelMode ||
			};

			directionsService.route(request, function (response, status) {

				route = response.routes[0];

				deferred.resolve(route, status);

			});

			return deferred.promise;

		}

		function getMapRoute(destination, origin, waypoints) {
			var deferred = $q.defer();
			var points = [];
			if (waypoints && waypoints.length) {
				for (var i = 0; i < waypoints.length; i++) {
					var address = waypoints[i].location;
					if (address !== "") {
						points.push({
							location: address,
							stopover: true
						});
					}
				}
			}

			var request = {
				origin: origin,
				destination: destination,
				waypoints: points,
				travelMode: google.maps.TravelMode.BICYCLING //TravelMode ||
			};

			directionsService.route(request, function (response, status) {

				route = response.routes[0];
				//console.log('getMap', );

				deferred.resolve({response: response, status: status});

			});

			return deferred.promise;

		}

		return {
			calculateRoute: calculateRoute,
			getRoute: getRoute,
			getMapRoute: getMapRoute
		}

	})
	.factory('GeoLocation', function ($q) {

		function getCurrentLocation() {
			var deferred = $q.defer();
			navigator.geolocation.getCurrentPosition(function (pos) {
				deferred.resolve(pos);

			}, function (error) {
				deferred.reject('Unable to get location: ' + error.message);
			}, { enableHighAccuracy : true});

			return deferred.promise;
		};

		function distanceFromCurrentLocation(lat, lng){
			var deferred = $q.defer();
			navigator.geolocation.getCurrentPosition(
				function(currentPosition) {
					var latLngA = new google.maps.LatLng(currentPosition.coords.latitude,currentPosition.coords.longitude);
					var latLngB = new google.maps.LatLng(lat, lng);
					var distance = google.maps.geometry.spherical.computeDistanceBetween(latLngA, latLngB);
					deferred.resolve(distance);
				},
				function(err) {
					deferred.reject(err);
				}
			);
			return deferred.promise;
		}

		function distanceFromPos(currentPos, pos){

					var latLngA = new google.maps.LatLng(currentPosition.k,currentPosition.D);
					var latLngB = new google.maps.LatLng(pos.k, pos.D);
					var distance = google.maps.geometry.spherical.computeDistanceBetween(latLngA, latLngB);

			return distance;
		}


		return {
			getCurrentLocation: getCurrentLocation,
			distanceFromPos : distanceFromPos
		}

	});