angular.module('socialCycle.services', [])
	.factory('colorsFactory', function ($http, $q) {
		var access_token = 'f7256921a637b41ddcb2153cb4a58cdc5647bdf7';
		var args = 1000;

		function sparkFunction(fn) {
			var deferred = $q.defer();
			$http({
				url: 'spark/' + fn + '?access_token=' + access_token,
				dataType: "json",
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					"accessToken": 'f7256921a637b41ddcb2153cb4a58cdc5647bdf7'
				},
				data: {accessToken: access_token, args: args}
			})
				.success(function (data, status, headers, config) {
					deferred.resolve(data);
				})
				.error(function (data, status, headers, config) {

					deferred.reject(data);
				});
			return deferred.promise;
		}

		return {
			get: function () {
				var deferred = $q.defer();
				$http.get('http://localhost:8100/api/led').
					success(function (data, status, headers, config) {
						deferred.resolve(data);
					}).
					error(function (data, status, headers, config) {
						deferred.reject(data);
					});
				return deferred.promise;
			},
			test: function () {
				return sparkFunction('tests');

			},
			left: function () {
				return sparkFunction('lefts');

			},
			right: function () {
				return sparkFunction('rights');

			},
			stop: function () {
				return sparkFunction('stops');

			},
			reg: function () {
				return sparkFunction('regs');

			}

		}
	});

