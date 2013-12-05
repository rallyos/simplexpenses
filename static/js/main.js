var expensesApp = angular.module('test-module', []);
 
expensesApp.controller('ExpensesList', function ($scope, $http) {
  $http.get('api/expense/').success(function(data) {
    $scope.expenses = data;
  });
});
expensesApp.controller('CategoriesList', function ($scope, $http) {
  $http.get('api/category/').success(function(data) {
    $scope.categories = data;
  });
});




// JUST TESTING
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
*/

var add_expense_button = document.getElementByClassName('add-expense')
add_expense_button.addEventListener("click", function () {
	var test = this.value
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

