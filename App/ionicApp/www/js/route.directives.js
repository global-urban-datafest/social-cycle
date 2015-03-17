angular.module('directions.directives', ['route'])
.directive('directionsText', function (DirectionsService) {
	return {
		restrict: 'EA',
		/*scope:{
		 destination:'=',
		 origin:'='
		 },*/
		templateUrl: '../templates/directiveTemplates/directions.template.html',
		link: function ($scope, $element, $attr) {
			var start = 'Maynooth, co.kildare, Ireland';//document.getElementById("start").value; $attr.destination;//
			var end = 'clane, co.kildare, Ireland';//
			DirectionsService.calculateRoute(end, start)
				.then(function(route){
					$scope.legs = route.legs;
					$scope.steps = route.legs[0].steps;
					/*$scope.$apply();*/
				}, function(err){
					console.error(err);
				});
		}
	}
})
	.directive('directionsMap', function (DirectionsService, $compile) {

		return {
			restrict: 'EA',
			scope: {
				ready: '=ready',
				origin: '=origin',
				destination: '=destination'
			},
			//templateUrl:'../templates/directiveTemplates/directions.template.html',
			link: function ($scope, $element, $attr) {

				var directionsDisplay, map;
				directionsDisplay = new google.maps.DirectionsRenderer();

				var dublin = new google.maps.LatLng(53.344103999999990000,-6.267493699999932000)
				var mapOptions = {
					zoom: 10,
					center: dublin
				};

				map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
				directionsDisplay.setMap(map);

				var start = 'Maynooth, co.kildare, Ireland';//document.getElementById("start").value; $attr.destination;//
				var end = 'clane, co.kildare, Ireland';//
				DirectionsService.getMapRoute(end, start)
					.then(function(res){
					
						console.log(res.status)
						console.dir(res.response)
						if (res.status == google.maps.DirectionsStatus.OK) {
							directionsDisplay.setDirections(res.response);
						}
						setTimeout(function(){
							$scope.$apply()
						}, 2000);

					}, function(err){
						console.error(err);
					});


			}
		}
	});
