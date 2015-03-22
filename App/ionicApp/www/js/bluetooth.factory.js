/**
 * Created by John on 22/03/15.
 */
angular.module('plugin.bluetooth', [])
.factory('bluetooth', function($q) {
	var address;
	var bluetoothSerial = cordova.require('com.megster.cordova.bluetoothserial.bluetoothSerial');


	return {
		setAddress: function(mac_address){
			address = mac_address;
		},
		getAddress: function(){
			return address;
		},
		connect: function(id){
			var deferred = $q.defer();
			bluetoothSerial.connect(id, deferred.resolve, deferred.reject);
			return deferred.promise;
		},
		disconnect: function(){
			var deferred = $q.defer();
			bluetoothSerial.disconnect(deferred.resolve, deferred.reject);
			return deferred.promise;
		},
		sendMessage: function(message) {
			var deferred = $q.defer();
			bluetoothSerial.write(message, function(res){
				console.dir(res);
				deferred.resolve(res);
			}, function(err){
				console.dir(err);
				deferred.reject(res);
			});
			return deferred.promise;
		},
		list :function(){
			var deferred = $q.defer();
			bluetoothSerial.list(function(devices){
				 deferred.resolve(devices);

				 },
				/*function(peripherals) {
					console.log(JSON.stringify(peripherals));
					// populate mac address for first device
					//connectText.value = peripherals[0].id;
					deferred.resolve(peripherals)
				}*/ function(error){
					deferred.reject(error);
				});

			return deferred.promise;

		}
	};
});
