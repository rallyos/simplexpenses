var expensesApp = angular.module('expenses', ['ngResource']);


expensesApp.factory('appData', function($http) {

	var data = {
		
		testu: function() {

			var expenses = $http.get('/api/expense/', function (edno) {
				return edno.data;
			});

			// Return the promise to the controller
			return expenses
		},

		testuv: function() {
			var categories = $http.get('/api/category/', function (dve) {
				return dve.data;
			});

			return categories
		}


	};

	return data;
});


expensesApp.controller('mainController', function($scope, appData) {

	appData.testu().then(function(d) {
		console.log(d)
		$scope.expenses = d.data
	});

	appData.testuv().then(function(c) {
		console.log(c)
		$scope.categories = c.data
	});


	$scope.selectCategory = function() {
		this.categoryClass = !this.categoryClass;
	}

	$scope.translateForm = function() {
		$scope.headerClass = !$scope.headerClass;
	}

	$scope.testas = function() {
		console.log($scope.categories[1].color)
		color = $scope.categories[this.expense.category_id].color;
		return 'background: ' + color
	}

});

/* From stackoverflow
app.factory('myService', function($http, $q) {
  myService.async = function() {
    return $http.get('test.json')
    .then(function (response) {
      var data = reponse.data;
      console.log(data);
      return data;
    });
  };

  return myService;
});

app.controller('MainCtrl', function( myService,$scope) {
  $scope.asyncData = myService.async();
  $scope.$watch('asyncData', function(asyncData) {
    if(angular.isDefined(asyncData)) {
      // Do something with the returned data, angular handle promises fine, you don't have to reassign the value to the scope if you just want to use it with angular directives
    }
  });

});
*/
/*
expensesApp.factory('categoriesData', function($http) {

	var myService = {
		
		testu: function() {

			var promise = $http.get('/api/category/').then(function (response) {
				console.log(response);
				return response.data;
			});

			// Return the promise to the controller
			return promise;
		}
	};

  return myService;
});
*/






