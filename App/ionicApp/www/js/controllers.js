angular.module('socialCycle.controllers', [])

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
	.controller('DirectionsCtrl', function ($scope, colorsFactory) {

		$scope.test = function () {

			colorsFactory.test();

		};

		$scope.left = colorsFactory.left;
		$scope.right = colorsFactory.right;
		$scope.stop = colorsFactory.stop;
		$scope.reg = colorsFactory.reg;

	})
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
