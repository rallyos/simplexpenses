var expensesApp = angular.module('expenses', ['ngResource']);

expensesApp.factory('expensesData', function($http) {

	var myService = {
		
		testu: function() {

			var promise = $http.get('/api/expense/').then(function (response) {
				console.log(response);
				return response.data;
			});

			// Return the promise to the controller
			return promise;
		}
	};

  return myService;
});

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



expensesApp.controller('ExpensesGraph', function($scope) {
	$scope.testing = 8
});

expensesApp.controller('ExpensesList', function ($scope, expensesData) {

	expensesData.testu().then(function(d) {
		$scope.expenses = d;
	});

});


expensesApp.controller('CategoriesList', function ($scope, categoriesData) {
	
	categoriesData.testu().then(function(c) {
		$scope.categories = c;
	});


	$scope.selectCategory = function() {
		this.categoryClass = !this.categoryClass;
	}

	$scope.translateForm = function() {
		$scope.headerClass = !$scope.headerClass;
	}

});