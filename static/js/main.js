var expensesApp = angular.module('expenses', ['ngResource']);

expensesApp.service('expensesData', function($http) {
	return {
		$http.get('api/expense/').success(function(data) {
			//$scope.categories = data;
			return data
		});
	}

})

expensesApp.controller('ExpensesGraph', function($scope) {
	$scope.testing = 8
});

expensesApp.controller('ExpensesList', function ($scope, expensesData) {
	console.log(expensesData)
	$scope.expenses = expensesData
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