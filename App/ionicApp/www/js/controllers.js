angular.module('socialCycle.controllers', ['route'])

	.controller('DashCtrl', function ($scope) {
	})

	.controller('ColorCtrl', function ($scope, colorsFactory) {
		$scope.rgb = {r: 125, g: 125, b: 125};
		$scope.$watch('$scope.rgb', function () {
			console.dir($scope.rgb);
		})
		$scope.saveRGB = function () {
			console.log('rgb', $scope.rgb);
			colorsFactory.save($scope.rgb);
		}

	})
	// END :ColorCtrl
	.controller('DirectionsCtrl', function ($scope, $interval, colorsFactory, GeoLocation) {

		$scope.test = function () {

			colorsFactory.test();

		};

		$scope.left = colorsFactory.left;
		$scope.right = colorsFactory.right;
		$scope.stop = colorsFactory.stop;
		$scope.reg = colorsFactory.reg;

		$scope.currentLocation = null;
		var getLocationInterval;

		function updateLocation(){
			if(angular.isDefined(getLocationInterval)) return;

			getLocationInterval = $interval(function(){
				GeoLocation.getCurrentLocation()
				.then(function(pos){
					$scope.currentLocation = pos;
						//console.dir(pos);
				}, function(err){
					console.error(err);
				});
			}, 1000)

		}

		function stopUpdatingLocation(){
			if(angular.isDefined(getLocationInterval)){
				$interval.cancel(getLocationInterval);
				getLocationInterval = undefined;
			}
		}

		$scope.$on('$destroy', function() {
			// Make sure that the interval is destroyed too
			stopUpdatingLocation();
		});
		updateLocation();

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
