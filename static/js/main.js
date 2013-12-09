var expensesApp = angular.module('expenses', ['ngResource']);




expensesApp.controller('ExpensesGraph', function($scope) {
	$scope.testing = 8
});

expensesApp.controller('ExpensesList', function ($scope, $resource) {
  var dataService = $resource('http://run.plnkr.co/5NYWROuqUDQOGcKq/test.json');
  $scope.data = dataService.get();
});


expensesApp.controller('CategoriesList', function ($scope) {

	$scope.selectCategory = function() {
		this.categoryClass = !this.categoryClass;
	}

	$scope.translateForm = function() {
		$scope.headerClass = !$scope.headerClass;
	}

});