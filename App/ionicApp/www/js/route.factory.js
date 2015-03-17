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

		function calculateRoute(destination, origin, TravelMode) {
			var deferred = $q.defer();

			/*var start;
			if(!origin){
				GeoLocation.getCurrentLocation()
					.then(function(pos){
						console.dir(pos);
						start = pos;
					})
					.catch(function(err){
						console.error(err);
						// default to Dublin
						start = new google.maps.LatLng(53.344103999999990000,-6.267493699999932000)
					});
			}*/

			var request = {
				origin: origin,
				destination: destination,
				travelMode: google.maps.TravelMode.BICYCLING //TravelMode ||
			};

			directionsService.route(request, function (response, status) {

				route = response.routes[0];

				deferred.resolve(route, status);

			});

			return deferred.promise;

		}

		function getMapRoute(destination, origin){

			var deferred = $q.defer();
			var request = {
				origin: origin,
				destination: destination,
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