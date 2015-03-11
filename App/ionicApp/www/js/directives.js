angular.module('socialCycle.directives', [])

.directive('map', function() {
  return {
    restrict: 'E',
    scope: {
      onCreate: '&'
    },
    link: function ($scope, $element, $attr) {
      function initialize() {
        var mapOptions = {
          center: new google.maps.LatLng(43.07493, -89.381388),
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map($element[0], mapOptions);

        $scope.onCreate({map: map});

        // Stop the side bar from dragging when mousedown/tapdown on the map
        google.maps.event.addDomListener($element[0], 'mousedown', function (e) {
          e.preventDefault();
          return false;
        });
      }

      if (document.readyState === "complete") {
        initialize();
      } else {
        google.maps.event.addDomListener(window, 'load', initialize);
      }
    }
  }
})
	.directive('colorviewer', function ($rootScope) {
		return {
			scope:{
				hex: '=',
				r: '=',
				g: '=',
				b: '='
			},
			restrict: 'E',
			link: function (scope, elem, attrs) {
				function setColor() {
					console.log('r', scope.r);
					console.log('g', scope.g);
					console.log('b', scope.b);
					var color = "red";
					//elem.css({"background-color":color});
					elem.css({"background-color": "rgb(" + scope.r + ", " + scope.g + ", " + scope.b + ")"});
				}
				setColor();
				//$rootScope.$on(attrs.r, setColor);
				scope.$watch('r', setColor)
				scope.$watch('g', setColor)
				scope.$watch('b', setColor)
			}
		}
	});;
