angular.module('socialCycle', ['ionic', 'socialCycle.services', 'socialCycle.directives', 'socialCycle.controllers'])

	.run(function ($ionicPlatform) {
		$ionicPlatform.ready(function () {
			if (window.cordova && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
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

			.state('tab.color', {
				url: '/color',
				views: {
					'tab-color': {
						templateUrl: 'templates/tab-color.html',
						controller: 'ColorCtrl'
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
			});

		$urlRouterProvider.otherwise('/tab/dash');

	});
