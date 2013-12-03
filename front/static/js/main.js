var expensesApp = angular.module('test-module', []);
 
expensesApp.controller('ExpensesList', function ($scope) {
  $scope.expenses = [
	{
		"category": "red",
		"sum": "3.49",
		"description": "Costa coffee",
		"date": "14.12.2013"
	},
	{
		"category": "yellow",
		"sum": "2.00",
		"description": "City Transport",
		"date": "13.12.2013"
	},
	{
		"category": "green",
		"sum": "8.00",
		"description": "Movie",
		"date": "12.12.2013"
	},
	{
		"category": "brown",
		"sum": "1.19",
		"description": "Breakfast",
		"date": "11.12.2013"
	},
	{
		"category": "red",
		"sum": "2.89",
		"description": "Costa coffee",
		"date": "10.12.2013"
	},
	{
		"category": "black",
		"sum": "3.35",
		"description": "Water",
		"date": "10.12.2013"
	},
	{
		"category": "blue",
		"sum": "4.89",
		"description": "Starbucks coffee",
		"date": "09.12.2013"
	}
  ];
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

