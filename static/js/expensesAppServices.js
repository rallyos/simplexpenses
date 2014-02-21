expensesApp.factory('Expenses', ['$resource', function($resource) {
	return $resource( '/api/expenses/:id');
}]);

expensesApp.factory('Categories', ['$resource', function($resource) {
	return $resource( '/api/categories/');
}]);

expensesApp.factory('Planned', ['$resource', function($resource) {
	return $resource( '/api/planned/');
}]);

expensesApp.factory('Expense', ['$resource', function($resource) {
	return $resource( '/api/expenses/:id',
		{ id: '@id' }, { 
			update: { 
				method: 'PUT',
			}
		} );
}]);

expensesApp.factory('Category', ['$resource', function($resource) {
	return $resource( '/api/categories/:id',
		{ id: '@id' }, { 
			updateName: { 
				method: 'PUT',
			},
			updateColor: {
				method: 'PUT',
			}
		} );
}]);

expensesApp.factory('Plan', ['$resource', function($resource) {
	return $resource( '/api/planned/:id',
	{id: '@id'}, {
		planCategory: {
			method: 'PUT'
		}

	});
}]);