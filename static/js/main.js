var expensesApp = angular.module('test-module', []);

expensesApp.controller('ExpensesGraph', function($scope) {
	$scope.testing = 8
})

expensesApp.controller('ExpensesList', function ($scope, $http) {
  $http.get('api/expense/').success(function(data) {
    $scope.expenses = data;
  });
});


expensesApp.controller('CategoriesList', function ($scope, $http) {
	
	$http.get('api/category/').success(function(data) {
		$scope.categories = data;
	});

	$scope.test = function($event) {
		categoriestest = document.getElementsByClassName('add-expense-category')
		for (i=0; categoriestest.length > i ;i++) {
			categoriestest[i].className = 'add-expense-category'
		}

		$event.target.className += ' add-expense-category-selected'
	}
	$scope.selectCategory = function($event, categoryClass) {
		$scope.$event.target.categoryClass = !$scope.$event.target.categoryClass;
	}
	$scope.translateForm = function(headerClass) {
		$scope.headerClass = !$scope.headerClass;
	}

});




// JUST TESTING

var add_expense_button = document.getElementsByClassName('add-expense')[0]

var expense_form = document.getElementsByClassName('test')[0]
var expense_amount = document.getElementsByClassName('add-expense-sum')[0]

add_expense_button.addEventListener("click", function () {
	var test = this.textContent

	expense_amount.focus()

	if (test == '^') {
		this.textContent = '+';
	} else {
		this.textContent = '^';
	}

});
























/*

$('.add-expense-category').on('click', function() {
	$('.add-expense-category').removeClass('add-expense-category-selected')
	$(this).toggleClass('add-expense-category-selected')
})

$('.menu-toggle').on('click', function() {
	$('.menu-links').toggle()
})

$('.add-expense-submit').on('click', function() {
	$('.sum-expenses').text('14.33')
	$('.yellow').height('287')
})
*/

