angular.module('socialCycle.controllers')
	.controller('RouteCtrl', function ($scope, $ionicModal, $timeout) {
		$scope.isReady = false;
		$scope.showMap = false;

		$scope.route = { isInit: false};
		// Create the login modal that we will use later
		$ionicModal.fromTemplateUrl('templates/direction.modal.html', {
			scope: $scope
		}).then(function (modal) {
			$scope.modal = modal;
		});

		// Triggered in the login modal to close it
		$scope.closeModal = function () {
			$scope.modal.hide();
		};

		// Open the login modal
		$scope.setRoute = function () {
			$scope.modal.show();
		};

		$scope.addWayPoint = function(){
			if(!$scope.route.waypoints) $scope.route.waypoints = [];
			$scope.route.waypoints.push({
				location: "",
				stopover: true
			});


		};
		$scope.displayMap = function(display){
			$scope.showMap = display;
		};

		// Perform the login action when the user submits the login form
		$scope.calculateRoute = function () {

			$scope.origin = $scope.route.origin || 'maynooth,co.kildare,ireland';
			$scope.destination = $scope.route.destination || 'clane,co.kildare,ireland';
			$scope.waypoints = $scope.route.waypoints;
			console.dir($scope.route);
			$scope.isReady = true;

			// Simulate a login delay. Remove this and replace with your login
			// code if using a login system
			$timeout(function () {
				$scope.closeModal();
			}, 1000);
		};
	})