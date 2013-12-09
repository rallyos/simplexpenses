var expensesApp = angular.module('expenses', ['ngResource']);


expensesApp.factory('appData', function($http) {

	var data = {}

	var data.danni = {
		
		testu: function() {

			var fetchedData = {}

			var fetchedData.expenses = $http.get('/api/expense/').then(function (response) {
				console.log(response);
				return response.data;
			});

			var fetchedData.categories = $http.get('/api/category/').then(function (response) {
				console.log(response);
				return response.data;
			});

			console.log(fetchedData)
			// Return the promise to the controller
			return fetchedData;
		}
	};

	console.log(data)
  return data;
});


expensesApp.controller('mainController', function($scope, appData) {

	appData.testu().then(function(d) {
		console.log(d)

		//$scope.expenses = d;
		//$scope.categories = c;
	});

	$scope.selectCategory = function() {
		this.categoryClass = !this.categoryClass;
	}

	$scope.translateForm = function() {
		$scope.headerClass = !$scope.headerClass;
	}

});




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






