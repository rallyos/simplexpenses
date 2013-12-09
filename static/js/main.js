var expensesApp = angular.module('expenses', ['ngResource']);


expensesApp.factory('appData', function($http) {

	var data = {
		
		testu: function() {

			var expenses = $http.get('/api/expense/').then(function (edno) {
				return edno.data;
			});

			var categories = $http.get('/api/category/').then(function (dve) {
				return dve.data;
			});

			// Return the promise to the controller
			return [expenses, categories]
		}
	};

	return data;
});


expensesApp.controller('mainController', function($scope, appData) {

	theData = appData.testu();

	console.log(theData[0])

	$scope.expenses = theData[0]
	$scope.categories = theData[1]

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






