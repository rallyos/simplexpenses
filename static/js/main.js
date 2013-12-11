var expensesApp = angular.module('expenses', ['ngResource', 'ngAnimate']);

expensesApp.config(function($httpProvider) {
	$httpProvider.defaults.headers.post = {'X-CSRFToken': 'Ub9bYgEJj0KLHivfM0AgS0yKRIJjLFH4', 'Content-Type': 'application/json'}
})

expensesApp.factory('Expenses', ['$resource', function($resource, $httpProvider) {
	return $resource( '/api/expense/');
}]);

expensesApp.controller('mainController', function($scope, Expenses) {

	$scope.testam = function(cat_id) {

		description = 'from the form'
		Expenses.save({'amount': $scope.exp_amount, 'description': $scope.exp_description, 'category_id': cat_id},function(response) {
			$scope.expenses.unshift(response);
		});
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
		// fix this mess
		vab = this.expense.category_id
 
 		for (i=0;$scope.categories.length > i;i++) {
			if ($scope.categories[i].id == vab) {
				color = $scope.categories[i].color
			}
		}

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




