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
		function getRoute(){
			return route;
		}

		function calculateRoute(destination, origin, waypoints, TravelMode) {

			var deferred = $q.defer();
			//var items = ["kilcock, co.kildare, ireland"];
			var points = [];
			if(waypoints && waypoints.length){
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

		function getMapRoute(destination, origin, waypoints){
			var deferred = $q.defer();
			/*var items = ["kilcock, co.kildare, ireland"];
			var waypoints = [];
			for (var i = 0; i < items.length; i++) {
				var address = items[i];
				if (address !== "") {
					waypoints.push({
						location: address,
						stopover: true
					});
				}
			}*/


			var request = {
				origin: origin,
				destination: destination,
				waypoints: waypoints,
				travelMode: google.maps.TravelMode.BICYCLING //TravelMode ||
			};

			directionsService.route(request, function (response, status) {

				//route = response.routes[0];
				//console.log('getMap', );

				deferred.resolve({ response:response, status:status});

			});

			return deferred.promise;

		}

		return {
			calculateRoute : calculateRoute,
			getRoute : getRoute,
			getMapRoute : getMapRoute
		}

	})
	.factory('GeoLocation', function ($q) {

		function getCurrentLocation() {
			var deferred = $q.defer();
			navigator.geolocation.getCurrentPosition(function (pos) {
				deferred.resolve(pos);

			}, function (error) {
				deferred.reject('Unable to get location: ' + error.message);
			});

			return deferred.promise;
		};

		return {
			getCurrentLocation :getCurrentLocation
		}


	});