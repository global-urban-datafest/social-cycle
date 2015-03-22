angular.module('socialCycle.controllers', ['route', 'plugin.bluetooth'])

	.controller('DashCtrl', function ($scope) {
	})

	.controller('SettingsCtrl', function ($rootScope, $scope, bluetooth) {
		/*$scope.rgb = {r: 125, g: 125, b: 125};
		$scope.$watch('$scope.rgb', function () {
			console.dir($scope.rgb);
		})
		$scope.saveRGB = function () {
			console.log('rgb', $scope.rgb);
			colorsFactory.save($scope.rgb);
		}*/



		$scope.devices = [];
		$rootScope.currentDevice = bluetooth.getAddress();
		$scope.getDevices = function(){
			bluetooth.list().then(function(devices){
				$scope.devices = devices;
			},function(error){
				$scope.devices = error;
			});
		};

		$scope.saveAddress = function (address){
			log('Saving device: '+address, 'console');
			bluetooth.setAddress(address);
			log('Saved device: '+address, 'console');
			$scope.$broadcast('blueToothDevice.address.saved', function() {console.log('address Save Broadcasted')});
			$rootScope.currentDevice = bluetooth.getAddress();
		};
		$scope.$on('$ionicView.enter', function(){
			$rootScope.currentDevice = bluetooth.getAddress();
			console.log('currentDevice', $rootScope.currentDevice);
		})


	})
	// END :ColorCtrl
	.controller('DirectionsCtrl', function ($scope, $interval, $q, colorsFactory, GeoLocation, DirectionsService, bluetooth) {
		var indicators = {
			brake:{
				off: '0',
				on: '1'
			},
			left:{
				on: '2',
				off:'3'
			},
			right: {
				on: '4',
				off: '5'
			}
		};

		function signal(indicator, time){
			var deferred = $q.defer();
			bluetooth.connect(bluetooth.getAddress()).then(function(){
			bluetooth.sendMessage(indicator.on)
				.then(function(){
					setTimeout(
						bluetooth.sendMessage(indicator.off)
						.then(function(){
								bluetooth.disconnect(deferred.resolve, deferred.reject);
							}, deferred.reject),
					time);
				}, deferred.reject);
			}, deferred.reject);

			return deferred.promise;
		}

		$scope.devicesaved = bluetooth.getAddress();



		$scope.route = null;
		$scope.test = function () {

			colorsFactory.test();

		};

		$scope.left = function(){
			signal(indicators.left)
				.then(console.log, console.error);

		};
		$scope.right = function(){
			signal(indicators.right)
				.then(console.log, console.error);

		};
		$scope.stop = function(){
			signal(indicators.brake)
				.then(console.log, console.error);

		};
		$scope.reg = function(){
			signal(indicators.reg)
				.then(console.log, console.error);

		};


		$scope.currentLocation = null;
		$scope.currentStep = 0;
		var getLocationInterval;

		function updateLocation() {
			if (angular.isDefined(getLocationInterval)) return;

			getLocationInterval = $interval(function () {
				GeoLocation.getCurrentLocation()
					.then(function (pos) {
						$scope.currentLocation = pos;
						//console.dir(pos);
					}, function (err) {
						console.error(err);
					});
			}, 1000)

		}

		function stopUpdatingLocation() {
			if (angular.isDefined(getLocationInterval)) {
				$interval.cancel(getLocationInterval);
				getLocationInterval = undefined;
			}
		}

		$scope.$on('$destroy', function () {
			// Make sure that the interval is destroyed too
			stopUpdatingLocation();
		});
		updateLocation();

		$scope.$on('$ionicView.enter', function() {
			$scope.devicesaved = bluetooth.getAddress();
			$scope.route = DirectionsService.getRoute();

			if ($scope.route) {
				console.log('DirectionsCtrl route');
				console.dir($scope.route);
				console.dir(convertRouteToSteps($scope.route));
			}

		});

		/*
			if getDistance to current step < 10m
				currentStep ++

		 */
		function convertRouteToSteps(route){
			if(route && route.legs){
				var steps = [];
				for(var i= 0, legsLength = route.legs.length; i < legsLength; i++){
					var leg = route.legs[i];
					for(var j= 0, stepsLength = leg.steps.length; j < stepsLength; j++){
						var step = leg.steps[j];
						steps.push(step);
					}
				}
				console.log('steps');
				console.dir(steps);
				return steps;
			}
		}

		window.temp = function(){

		}

		function incrementCurrentStep(){
			var distance = GeoLocation.distanceFromPos({ k:$scope.currentLocation.coords.latitude, D:$scope.currentLocation.coords.longitude}, steps[$scope.currentStep].end_point);
			console.log('distance',distance);
			if(distance < 10 ){
				// indicateTillAfter(steps[$scope.currentStep].pos)
				$scope.currentStep++
			}
		}


	})
	// END: DirectionsCtrl

	.controller('MapCtrl', function ($scope, $ionicLoading) {
		$scope.mapCreated = function (map) {
			$scope.map = map;
			$scope.centerOnMe();
		};

		$scope.centerOnMe = function () {
			console.log("Centering");
			if (!$scope.map) {
				return;
			}

			$scope.loading = $ionicLoading.show({
				content: 'Getting current location...',
				showBackdrop: false
			});

			navigator.geolocation.getCurrentPosition(function (pos) {
				console.log('Got pos', pos);
				$scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
				$ionicLoading.hide();
			}, function (error) {
				alert('Unable to get location: ' + error.message);
			});
		};
	});
;
