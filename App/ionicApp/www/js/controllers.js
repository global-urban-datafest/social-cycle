angular.module('starter.controllers', [])
	.factory('colors', function ($http, $q) {

		return {
			get: function(){
				var deferred = $q.defer();
				$http.get('http://localhost:3000/api/led').
					success(function(data, status, headers, config) {
						// this callback will be called asynchronously
						// when the response is available
						deferred.resolve(data);
					}).
					error(function(data, status, headers, config) {
						// called asynchronously if an error occurs
						// or server returns response with an error status.
						deferred.reject(data);
					});
				return deferred.promise;
			},
			save : function(rgb){
				var deferred = $q.defer();
				$http.post('http://localhost:3000/api/led', {rgb:rgb}).
					success(function(data, status, headers, config) {
						// this callback will be called asynchronously
						// when the response is available
						deferred.resolve(data);
					}).
					error(function(data, status, headers, config) {
						// called asynchronously if an error occurs
						// or server returns response with an error status.
						deferred.reject(data);
					});
			}
		}
	})

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, colors) {
		$scope.rgb = {r:125,g:125,b:125};
		$scope.saveRGB = function(){
			console.log('rgb', $scope.rgb);
			colors.save($scope.rgb);
		}

})


.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})
	.controller('MapCtrl', function($scope, $ionicLoading) {
		$scope.mapCreated = function(map) {
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
