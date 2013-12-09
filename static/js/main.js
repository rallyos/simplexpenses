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


expensesApp.controller('ExpensesGraph', function($scope) {
	$scope.testing = 8
});

expensesApp.controller('ExpensesList', function ($scope, expensesData) {

	expensesData.testu().then(function(d) {
		$scope.expenses = d;
	});

});


expensesApp.controller('CategoriesList', function ($scope, $http) {
	
	$http.get('api/category/').success(function(data) {
		$scope.categories = data;
	});

	$scope.selectCategory = function() {
		this.categoryClass = !this.categoryClass;
	}

	$scope.translateForm = function() {
		$scope.headerClass = !$scope.headerClass;
	}

});