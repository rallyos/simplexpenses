var expensesApp = angular.module('expenses', []);


expensesApp.factory('Expenses', function() {

	return {message: 'testing'}
})


expensesApp.controller('ExpensesGraph', function($scope, Expenses) {
	console.log(Expenses.message)
	$scope.testing = 8
});

expensesApp.controller('ExpensesList', function ($scope, $http) {
	$http.get('api/expense/').success(function(data) {
		$scope.expenses = data;
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