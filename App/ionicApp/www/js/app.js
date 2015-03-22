function log(msg, id){
	var node = document.createElement("div");                 // Create a <li> node
	var textnode = document.createTextNode(msg);
	node.appendChild(textnode);
	document.getElementById(id).appendChild(node);
}

angular.module('socialCycle', ['ionic', 'socialCycle.services', 'socialCycle.directives', 'socialCycle.controllers', 'route', 'directions.directives', 'plugin.bluetooth'])

	.run(function ($ionicPlatform) {
		$ionicPlatform.ready(function () {
			if (!window.cordova) {
				window.cordova = {
					require: function(plugin){

						if(plugin === 'com.megster.cordova.bluetoothserial.bluetoothSerial'){
							return {
								connect: function(id, onSuccess, onError){
									onSuccess('ok');
								},
								disconnect: function(onSuccess, onError){
									onSuccess('disconnect');
								},
								write: function(message, onSuccess, onError){
									onSuccess('ok');
								},
								list: function(onSuccess, onError){
									onSuccess([{id:'123', name:'Device1', address:'1:2:3:4'},
										{id:'ABC', name:'Device2', address:'A:B:C:D'}])
								}
							}
						}

					}
				}
			}
			if (window.StatusBar) {
				StatusBar.styleDefault();
			}
		});
	})
	.config(function ($stateProvider, $urlRouterProvider) {

		$stateProvider
			.state('tab', {
				url: "/tab",
				abstract: true,
				templateUrl: "templates/tabs.html"
			})
			.state('tab.dash', {
				url: '/dash',
				views: {
					'tab-dash': {
						templateUrl: 'templates/tab-dash.html',
						controller: 'DashCtrl'
					}
				}
			})
			.state('tab.map', {
				url: '/map',
				views: {
					'tab-map': {
						templateUrl: 'templates/tab-map.html',
						controller: 'MapCtrl'
					}
				}
			})

			.state('tab.settings', {
				url: '/settings',
				views: {
					'tab-settings': {
						templateUrl: 'templates/tab-settings.html',
						controller: 'SettingsCtrl'
					}
				}
			})
			.state('tab.direction', {
				url: '/directions',
				views: {
					'tab-directions': {
						templateUrl: 'templates/tab-directions.html',
						controller: 'DirectionsCtrl'
					}
				}
			})
			.state('tab.route', {
				url: '/route',
				views: {
					'tab-route': {
						templateUrl: 'templates/tab-route.html',
						controller: 'RouteCtrl'
					}
				}
			});

		$urlRouterProvider.otherwise('/tab/dash');

	});
