var expensesApp = angular.module('expenses', ['ngResource']);

expensesApp.factory('Expenses', ['$resource', function($resource) {

	return $resource( '/api/expense');

}]);

expensesApp.controller('mainController', function($scope, Expenses) {

	$scope.testam = function() {
		Expenses.save({amount: 2.14})
	}
	$scope.expenses = expenses
	$scope.categories = categories

	$scope.selectCategory = function() {
		this.categoryClass = !this.categoryClass;
	}

	$scope.translateForm = function() {
		$scope.headerClass = !$scope.headerClass;
	}

	$scope.testas = function() {
		color = $scope.categories[this.expense.category_id].color
		return 'background: ' + color
	}


	$scope.sumExpenses = function () {
		sum = 0

		for (i=0; expenses.length > i;i++) {

			var number = Number(expenses[i].amount)
			sum = sum + number
		}

		var amount = sum.toFixed(2);
		$scope.thisMonthAmount = amount
	}

	$scope.sumPlanned = function() {
		$scope.nextMonthAmount = 143.21
	}

});




