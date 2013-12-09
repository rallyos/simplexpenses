/*
var expensesApp = angular.module('expenses', []);




expensesApp.controller('ExpensesGraph', function($scope) {
	$scope.testing = 8
});

expensesApp.controller('ExpensesList', function ($scope, $resource) {
  var dataService = $resource('/api/expenses/');
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
*/
var app = angular.module('expenses', ['ngResource']);

app.controller('ExpensesGraph', function($scope, $resource) {
  var dataService = $resource('http://run.plnkr.co/5NYWROuqUDQOGcKq/test.json');
  $scope.data = dataService.get();
});
