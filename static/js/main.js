var expensesApp = angular.module('test-module', []);
 

expensesApp.factory('dealerService', function($http) {
	var dealers = {};
	dealers.getDealerList = function() {

		$http.get('api/expense/').success(function(data) {
			dealers.list = data;
		});

		return dealers;
    };

    return dealers
});

expensesApp.controller('ExpensesGraph', function($scope, dealerService) {
	$scope.dealerService = dealerService
	console.log($scope.dealerService.dealers)

//	for (i=0; proba.length > i; i++) {	}
	$scope.testing = proba.length
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

});




// JUST TESTING

var add_expense_button = document.getElementsByClassName('add-expense')[0]

var expense_form = document.getElementsByClassName('test')[0]
var expense_amount = document.getElementsByClassName('add-expense-sum')[0]

add_expense_button.addEventListener("click", function () {
	var test = this.textContent

	if (expense_form.classList.length > 1) {
		expense_form.className = 'test'
	} else {
		expense_form.className += ' add-expense-translate'
	}

	expense_amount.focus()

	if (test == '^') {
		this.textContent = '+';
	} else {
		this.textContent = '^';
	}

});
































/*
$('.add-expense').on('click', function() {
	var test = $(this).text()
	$('.test').toggleClass('add-expense-translate');
	//$('.expense-form').toggleClass('expense-form-show');
	$(this).toggleClass('another-test');

	$('.add-expense-sum').focus()

	if (test == '^') {
		$(this).text('+')
	} else {
		$(this).text('^')
	}
});

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

