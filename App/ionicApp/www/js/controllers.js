angular.module('starter.controllers', [])
	.factory('colors', function ($http, $q) {
		var access_token = 'f7256921a637b41ddcb2153cb4a58cdc5647bdf7';
		var args = 1000;

		function sparkFunction(fn){
			var deferred = $q.defer();
			console.log('SparFunction', fn);
			//$http.post('spark/' + fn, {access_token:access_token, args:args}).

				$http({
					url: 'spark/' + fn +'?access_token='+access_token,
					dataType: "json",
					method: "POST",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
						"accessToken":'f7256921a637b41ddcb2153cb4a58cdc5647bdf7'
					},
					data: {accessToken:access_token, args:args}
				}).
				success(function(data, status, headers, config) {
					console.log('data', data);
					// this callback will be called asynchronously
					// when the response is available
					deferred.resolve(data);
				}).
				error(function(data, status, headers, config) {
					console.log('data', data);
					// called asynchronously if an error occurs
					// or server returns response with an error status.
					deferred.reject(data);
				});
			return deferred.promise;
		}

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
			test : function(){
				return sparkFunction('tests');

			},
			left : function(){
				return sparkFunction('lefts');

			},
			right : function(){
				return sparkFunction('rights');

			},
			stop : function(){
				return sparkFunction('stops');

			},
			reg : function(){
				return sparkFunction('regs');

			}

		}
	})

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, colors) {
		$scope.rgb = {r:125,g:125,b:125};
		$scope.$watch('$scope.rgb', function(){
			console.dir($scope.rgb);
		})
		$scope.saveRGB = function(){
			console.log('rgb', $scope.rgb);
			colors.save($scope.rgb);
		}

})


.controller('AccountCtrl', function($scope, colors) {


		//$scope.$watch('ison', , true);
		$scope.test = function(){

				colors.test();

		};

		$scope.left = colors.left;
		$scope.right = colors.right;
		$scope.stop = colors.stop;
		$scope.reg = colors.reg;


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
