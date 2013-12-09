var expensesApp = angular.module('expenses', []);



// Define CreditCard class
var Expenses = $resource('/api/expenses/');
 /*
// We can retrieve a collection from the server
var cards = CreditCard.query(function() {
  // GET: /user/123/card
  // server returns: [ {id:456, number:'1234', name:'Smith'} ];
 
  var card = cards[0];
  // each item is an instance of CreditCard
  expect(card instanceof CreditCard).toEqual(true);
  card.name = "J. Smith";
  // non GET methods are mapped onto the instances
  card.$save();
  // POST: /user/123/card/456 {id:456, number:'1234', name:'J. Smith'}
  // server returns: {id:456, number:'1234', name: 'J. Smith'};
 
  // our custom method is mapped as well.
  card.$charge({amount:9.99});
  // POST: /user/123/card/456?amount=9.99&charge=true {id:456, number:'1234', name:'J. Smith'}
});
 
// we can create an instance as well
var newCard = new CreditCard({number:'0123'});
newCard.name = "Mike Smith";
newCard.$save();
// POST: /user/123/card {number:'0123', name:'Mike Smith'}
// server returns: {id:789, number:'01234', name: 'Mike Smith'};
expect(newCard.id).toEqual(789);


*/











expensesApp.controller('ExpensesGraph', function($scope, Expenses) {
	$scope.testing = 8
});

expensesApp.controller('ExpensesList', function ($scope, $http) {

});


expensesApp.controller('CategoriesList', function ($scope, $http) {

	$scope.selectCategory = function() {
		this.categoryClass = !this.categoryClass;
	}

	$scope.translateForm = function() {
		$scope.headerClass = !$scope.headerClass;
	}

});