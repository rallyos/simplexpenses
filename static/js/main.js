var expensesApp = angular.module('expenses', ['ngResource', 'ngAnimate']);


expensesApp.config(function($httpProvider) {
	$httpProvider.defaults.headers.post = {'X-CSRFToken': csrftoken, 'Content-Type': 'application/json'}
})

expensesApp.factory('Expense', ['$resource', function($resource) {
	return $resource( '/api/expense/');
}]);

expensesApp.factory('Category', ['$resource', function($resource) {
	return $resource( '/api/category/');
}]);

expensesApp.controller('mainController', function($scope, Expense, Category) {

	$scope.testam = function(cat_id) {

		description = 'from the form'
		Expense.save({'amount': $scope.exp_amount, 'description': $scope.exp_description, 'category_id': cat_id},function(response) {
			$scope.expenses.unshift(response);
			$scope.sumExpenses()
		});
	}

	$scope.testamdve = function(event) {
		$scope.categories.push({'title': 'Testing', 'description': 'a new category', 'color': '#6FC28E'});
		lastCategory = event.target.previousElementSibling
		lastCategory.setAttribute('contenteditable', 'true')
		lastCategory.focus()
	}

	$scope.dsa = function() {
		// highly expiremental
		this_category = this.category.id
		sum = 0
 		for (i=0;$scope.expenses.length > i;i++) {
			if ($scope.expenses[i].category_id == this_category) {
				var number = Number($scope.expenses[i].amount)
				sum = sum + number
				var amount = sum.toFixed(2);
			} else {
				continue
			}
		}
		amount = amount / $scope.thisMonthAmount * 100
		amount = amount.toFixed(2)
		return amount + '%'
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


function getCookie (sKey) {
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
}  

csrftoken = getCookie('csrftoken')



