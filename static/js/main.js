var expensesApp = angular.module('expenses', []);



expensesApp.controller('ExpensesGraph', function($scope) {
	$scope.testing = 8
});

expensesApp.controller('ExpensesList', function ($scope, $resource) {
		ExpensesTest = $resource('/api/expense/')
		$scope.expenses = ExpensesTest.get();
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