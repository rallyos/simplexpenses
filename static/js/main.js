
'use strict'



function getCookie (sKey) {
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
}  

var csrftoken = getCookie('csrftoken')

var ENTER_KEY = 13;

// Preload image
var tick = new Image()
tick.src = 'http://simplexpenses.herokuapp.com/static/img/rt.png'

var expensesApp = angular.module('expensesApp', ['ngResource', 'ngAnimate']);

//Some amateurish substitutes of jquery methods

Node.prototype.toggleClass = function(nodeClass) {

	if (this.className.match(nodeClass)) {
		nodeClass = ' ' + nodeClass
		nodeClass = this.className.replace(nodeClass, '')
		this.className = nodeClass
	} else {
		this.className += ' ' + nodeClass
	}
}



// Include this header to every request
expensesApp.config(function($httpProvider) {
	$httpProvider.defaults.headers.post = {'X-CSRFToken': csrftoken, 'Content-Type': 'application/json'}
	$httpProvider.defaults.headers.delete = {'X-CSRFToken': csrftoken, 'Content-Type': 'application/json'}
	$httpProvider.defaults.headers.put = {'X-CSRFToken': csrftoken, 'Content-Type': 'application/json'}
})

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
	return $resource( '/api/expenses/:id');
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

expensesApp.controller('mainController', function($scope, $http, Expenses, Categories, Planned, Expense, Category, Plan) {



// Set globals
	// Data collections
	$scope.categories = JSON.parse(c)
	$scope.expenses = JSON.parse(e);
	$scope.planned = JSON.parse(p);
	$scope.currency = currency

	// Show new category box setting
	$scope.show_CategoryCreationForm = show_CategoryCreationForm

	// Store category details display
	var detailsDesplay = document.getElementsByClassName('graph-information')[0]
	var detailsText = document.getElementsByClassName('graph-information-text')[0]

	// Store the wrapper element for binding listeners
	var wrapper = document.getElementsByClassName('wrapper')[0]

	// I don't like it, but this stays for now
	$scope.exp_amount = '0.00'

	// All category colors for now
	var colors = ['#5b009c', '#a086d3', '#c7c5e6', '#003580', '#0039a6', '#0060a3', '#3b5998', '#005cff', '#59a3fc', '#2d72da', '#1d8dd5', '#3287c1',
			'#126567', '#5e8b1d', '#16a61e', '#7eb400', '#00a478', '#40a800', '#81b71a', '#8cc83b', '#82b548', '#9aca3c', '#5cb868',
			'#ffcc00', '#ffcc33', '#db7132', '#e47911', '#ff8700', '#dd4814', '#f0503a', '#e51937', '#e54a4f', '#dd4b39', '#cc0f16', '#a82400', '#b9070a']

	// Select random color on load
	$scope.categoryColor = colors[Math.floor((Math.random() * 35) + 0)]

	// Store the blocks
	var settingsBlock = document.getElementsByClassName('settings-block')[0]
	var plannedBlock = document.getElementsByClassName('plan-expenses-block')[0]


// Adding expenses

	$scope.selectCategory = function() {

		// Store the id for syncing 
		$scope.selectedCategory = this.category.id

		var catgs = document.getElementsByClassName('add-expense-category')

		// Loop over the elements to reset the previously selected category
		for (var i=0; catgs.length > i; i++) {
			catgs[i].className = 'add-expense-category';
		}

		// Apply the .selected class
		this.categoryClass = !this.categoryClass;

	}

	$scope.addExpense = function() {

		if ($scope.selectedCategory && $scope.exp_description) {
			Expenses.save({'amount': $scope.exp_amount, 'description': $scope.exp_description, 'category_id': $scope.selectedCategory}, function(response) {
				$scope.expenses.unshift(response);
				$scope.sumExpenses()
				$scope.exp_description = ''
				$scope.exp_amount = '0.00'
			});	
		}
	}

	// Create category
	$scope.createOnEnter = function(key) {
		if (key.which == ENTER_KEY) {
			Categories.save({'name': $scope.newCategoryName, 'color': $scope.categoryColor}, function(response) {
				$scope.categories.push(response);
			})

			return false
		}
	}


// Show window with planned or summed expenses
// This function is packed from old 2, no need for separated funcs for now
	$scope.showDetailsWindow = function(is_expenses) {

		$scope.showGraphInfo = true;

		var sum = 0

		if (is_expenses) {
			var color = this.category.color;
			var name = this.category.name

		 	for (var i=0; $scope.expenses.length > i; i++) {
				if ($scope.expenses[i].category_id == this.category.id) {
					var number = Number($scope.expenses[i].amount)
					sum = sum + number
					var amount = sum.toFixed(2);
				}
			}

			if (!amount) {
				var amount = 0
			}

			$scope.updateDetailsWindow(color, 'You spent ' + amount + ' ' + $scope.currency +' for ' + name + ' this month.')


		} else {
			var amount = this.plan.planned_amount

			for (var i=0; $scope.categories.length > i; i++) {
				if ( $scope.categories[i].id == this.plan.category_id ) {
					var color = $scope.categories[i].color
					var name = $scope.categories[i].name
					break
				}
			}

			if (!amount) {
				var amount = 0
			}

			$scope.updateDetailsWindow(color, 'You plan to spend ' + amount + ' '+ $scope.currency +' for ' + name + ' this month.')
		}

	}

	$scope.updateDetailsWindow = function(color, info) {
		detailsDesplay.style.background = color
		detailsDesplay.style.left = event.target.offsetLeft + 'px'
		detailsDesplay.style.top = event.target.offsetTop - 100 + 'px'
		detailsText.textContent = info
	}




	$scope.updatePlanned = function(event) {

		if (event.which == ENTER_KEY) {
			for (var i=0; $scope.planned.length > i;i++) {
				if ($scope.planned[i].category_id == this.category.id) {

					$scope.planned[i].planned_amount = Number(event.target.value)

					var is_found = true;

					// just testing before i make a method for this...
					Plan.planCategory({id: this.category.id, planned_amount: $scope.planned[i].planned_amount}, function() {
						$scope.sumPlanned()
					})
					break
				} else {
					var is_found = false;
				}
			}

			if (!is_found) {
				console.log('SAVE SAVE SAVE')
				Planned.save({'category_id': this.category.id, 'planned_amount': event.target.value},function(response) {
						$scope.planned.push(response);
						$scope.sumPlanned()
				});
			}
		}

	}

	$scope.mobileSettings = function() {
		window.scrollTo(0)
		settingsBlock.toggleClass('show-settings-block')
	}

	$scope.mobilePlanned = function() {
		window.scrollTo(0)
		plannedBlock.toggleClass('show-plan-expenses-block')
	}


	$scope.showSettings = function() {

		settingsBlock.toggleClass('show-settings-block')

		var closeSettingsOnClick = function(click) {
			if (click.target.offsetParent.classList[0] != 'settings-block' && click.target.offsetParent.classList[0] != 'menu-block') {
				settingsBlock.toggleClass('show-settings-block')
				wrapper.removeEventListener('click', closeSettingsOnClick)
			}
		}

		wrapper.addEventListener('click', closeSettingsOnClick)
	}

	$scope.showPlanned = function() {

		plannedBlock.toggleClass('show-plan-expenses-block')

		var closePlannedOnClick = function(click) {
			if (click.target.offsetParent.classList[0] != 'plan-expenses-block' && click.target.offsetParent.classList[0] != 'menu-block') {
				plannedBlock.toggleClass('show-plan-expenses-block')
				wrapper.removeEventListener('click', closePlannedOnClick)
			}				
		}

		wrapper.addEventListener('click', closePlannedOnClick)
	}

	$scope.getPlannedAmount = function() {
	
		var amount = 0

 		for (var i=0;$scope.planned.length > i;i++) {
			if ($scope.planned[i].category_id == this.category.id) {
				amount = $scope.planned[i].planned_amount
			}
		}

		return Number(amount)
	}



	$scope.probvai = function() {
		$scope.categoryColor = colors[$scope.selectedColor]
	}

	$scope.hideElements = function(click) {
		if (click.target.classList[0] != 'category' && $scope.showGraphInfo == true) {
			$scope.showGraphInfo = false;		
		}
	}

	$scope.dsa = function() {
		// highly expiremental
		var this_category = this.category.id
		var sum = 0
 		for (var i=0;$scope.expenses.length > i;i++) {
			if ($scope.expenses[i].category_id == this_category) {
				var number = Number($scope.expenses[i].amount)
				sum = sum + number
				var amount = sum.toFixed(2);
			} else {
				continue
			}
		}
		amount = amount / $scope.thisMonthTotal * 100
		amount = amount.toFixed(2)
		return amount + '%'
	}
	$scope.setCategoryName = function() {
		var this_category = this.expense.category_id

 		for (var i=0;$scope.categories.length > i;i++) {
			if ($scope.categories[i].id == this_category) {
				var name = $scope.categories[i].name
			} else {
				continue
			}
		}

		return name
	}
	$scope.setOnEnter = function(key) {
		if (key.which == ENTER_KEY) {
			// if not set - post
			if (currency == '') {
				$http({
				    method: 'POST',
				    url: 'set_currency',
				    data: {'currency': $scope.currency},
				})
			// if set - put
			} else {
				$http({
				    method: 'PUT',
				    url: 'set_currency',
				    data: {'currency': $scope.currency},
				})
			}

			return false
		}
	}

	$scope.toggleNcButton = function() {
		setTimeout(function() {
			$http({
			    method: 'PUT',
			    url: 'toggleNewCgButton',
			    data: {'show_CategoryCreationForm': $scope.show_CategoryCreationForm},
			})
		}, 3000);
	}

	$scope.editCategoryColor = function(newCategoryColor) {
		this.category.color = colors[newCategoryColor]
		var cat = this.category
		// time for put method in directives...
		if(typeof t !== "undefined"){
		  clearTimeout(t);
		}
		var t = setTimeout(function() {
			Category.updateColor({id: cat.id, color: cat.color})
		}, 3000)
	}

	$scope.editCategoryName = function(click) {
		$scope.contentedit = true
		click.target.style.cursor = 'text'
	}

	$scope.setNameOnEnter = function(key) {
		if (key.which == ENTER_KEY) {
			$scope.contentedit = false
			key.target.style.cursor = 'pointer'
			this.category.name = key.target.textContent
			
			Category.updateName({id: this.category.id, name: this.category.name})
		}
	}

	$scope.deleteCategory = function(idx) {
		if (window.confirm("Delete category " + this.category.name + '?')) {
			Category.delete({id: this.category.id},function() {
				$scope.categories.splice(idx, 1)
			})				
		}
	}

	$scope.setCategoryColor = function() {
		
		// fix this mess
		var vab = this.expense.category_id
 
 		for (var i=0;$scope.categories.length > i;i++) {
			if ($scope.categories[i].id == vab) {
				var color = $scope.categories[i].color
			}
		}

		return color
	}

	$scope.changePassword = function() {
		$http({
		    method: 'POST',
		    url: 'password_change',
		    data: 'csrfmiddlewaretoken=' + encodeURIComponent(csrftoken) + '&data=' + encodeURIComponent($scope.newPass),
		    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).success(function() {
			$scope.newPass = ''
			$scope.showSubmPassButton = false
		})
	}

	$scope.deleteExpense = function(idx) {
		Expense.delete({id: this.expense.id},function() {
			$scope.expenses.splice(idx, 1)
		})
	}
















// Doing things on start
	$scope.setChartColor = function() {

		// fix this mess
		var vab = this.plan.category_id
 
 		for (var i=0;$scope.categories.length > i;i++) {
			if ($scope.categories[i].id == vab) {
				var color = $scope.categories[i].color
			}
		}

		return color
	}

	$scope.setChartHeight = function() {
		// highly expiremental
		var in_percent = this.plan.planned_amount / $scope.nextMonthTotal * 100
		var amount = in_percent.toFixed(2)
		return amount + '%'
	}

	$scope.sumExpenses = function () {
		var sum = 0

		for (var i=0; $scope.expenses.length > i;i++) {

			var number = Number($scope.expenses[i].amount)
			sum = sum + number
		}

		var amount = sum.toFixed(2);
		$scope.thisMonthTotal = amount
	}

	$scope.sumPlanned = function() {
		var sum = 0

		for (var i=0; $scope.planned.length > i;i++) {

			var number = Number($scope.planned[i].planned_amount)
			sum = sum + number
		}

		var amount = sum.toFixed(2);
		$scope.nextMonthTotal = amount
	}


	$scope.sumExpenses();
	$scope.sumPlanned();
});



