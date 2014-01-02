
// ..... don't be shameful of this here... :)
// And change the name of 'planned'
var ENTER_KEY = 13;


var expensesApp = angular.module('expensesApp', ['ngResource', 'ngAnimate']);


expensesApp.config(function($httpProvider) {
	$httpProvider.defaults.headers.post = {'X-CSRFToken': csrftoken, 'Content-Type': 'application/json'}
	$httpProvider.defaults.headers.delete = {'X-CSRFToken': csrftoken, 'Content-Type': 'application/json'}
})

expensesApp.factory('Expense', ['$resource', function($resource) {
	return $resource( '/api/expense/');
}]);

expensesApp.factory('Category', ['$resource', function($resource) {
	return $resource( '/api/category/');
}]);

expensesApp.factory('Planned', ['$resource', function($resource) {
	return $resource( '/api/planned/');
}]);

expensesApp.factory('Expens', ['$resource', function($resource) {
	return $resource( '/api/expense/:id');
}]);


expensesApp.controller('mainController', function($scope, $http, Expense, Category, Planned, Expens) {

	$scope.expenses = expenses
	$scope.categories = categories
	$scope.planned = planned

	$scope.thecolor = '#343534'

	$scope.translateForm = function() {
		$scope.headerClass = !$scope.headerClass;
	}


	$scope.selectCategory = function(soDark) {
		// again highly expiremental
		$scope.selectedCat = soDark.category.id
		catgs = document.getElementsByClassName('add-expense-category')

		for (i=0; catgs.length > i; i++) {
			catgs[i].className = 'add-expense-category';
		}

		this.categoryClass = !this.categoryClass;
	}

	$scope.addExpense = function() {

		Expense.save({'amount': $scope.exp_amount, 'description': $scope.exp_description, 'category_id': $scope.selectedCat},function(response) {
			$scope.expenses.unshift(response);
			$scope.sumExpenses()
			$scope.exp_description = ''
			$scope.exp_amount = '0.00'
		});
	}

	$scope.createOnEnter = function(key) {
		if (key.which == ENTER_KEY) {
			//Category.save({'title': $scope.newCategoryName, 'description': 'a new category', 'color': $scope.thecolor}, function(response) {
				$scope.categories.push({'title': $scope.newCategoryName, 'description': 'a new category', 'color': $scope.thecolor});
			//})

			return false
		}
	}

	$scope.createCategory = function() {
		$scope.categories.push({'title': $scope.newCategoryName, 'description': 'a new category', 'color': $scope.thecolor});
	}

	$scope.showSpendingsOnCategory = function(event) {

		sum = 0;

		$scope.testovobratdisplay = true;

 		for (i=0;$scope.expenses.length > i;i++) {

			if ($scope.expenses[i].category_id == this.category.id) {
				var number = Number($scope.expenses[i].amount)
				sum = sum + number
				var amount = sum.toFixed(2);
			} else {
				continue
			}
		}

		testovobrat = document.getElementsByClassName('testovobrat')[0]
		testovotext = document.getElementsByClassName('testovotext')[0]
		testovobrat.style.background = this.category.color
		testovobrat.style.left = event.target.offsetLeft + 'px'
		testovobrat.style.top = event.target.offsetTop - 100 + 'px'
		testovotext.textContent = 'You spent ' + amount + ' лв. for ' + this.category.title + ' this month.'

	}


	$scope.selectCategory = function(soDark) {
		// again highly expiremental
		$scope.selectedCat = soDark.category.id
		catgs = document.getElementsByClassName('add-expense-category')
		for (i=0; catgs.length > i; i++) {
			catgs[i].className = 'add-expense-category';
		}


		this.categoryClass = !this.categoryClass;
	}

	$scope.setChartColor = function() {

		// fix this mess
		vab = this.plan.category_id
 
 		for (i=0;$scope.categories.length > i;i++) {
			if ($scope.categories[i].id == vab) {
				color = $scope.categories[i].color
			}
		}

		return color
	}

	$scope.setChartHeight = function() {
		// highly expiremental
		in_percent = this.plan.planned_amount / $scope.nextMonthAmount * 100
		amount = in_percent.toFixed(2)
		return amount + '%'
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
		sum = 0

		for (i=0; planned.length > i;i++) {

			var number = Number(planned[i].planned_amount)
			sum = sum + number
		}

		var amount = sum.toFixed(2);
		$scope.nextMonthAmount = amount
	}

	$scope.updatePlanned = function(event) {

		if (event.which == ENTER_KEY) {
			for (i=0; $scope.planned.length > i;i++) {
				if ($scope.planned[i].category_id == this.category.id) {

					$scope.planned[i].planned_amount = Number(event.target.value)

					is_found = true;

					// just testing before i make a method for this...
					$http({
					    method: 'PUT',
					    url: '/api/planned/' + $scope.planned[i].id,
					    data: {planned_amount: $scope.planned[i].planned_amount},
					    headers: {'X-CSRFToken': csrftoken}
					}).success(function() {
						$scope.sumPlanned()
					})
					break
				} else {
					is_found = false;
				}
			}

			if (!is_found) {
				console.log('SAVE SAVE SAVE')
				Planned.save({'category_id': this.category.id, 'planned_amount': event.target.value},function(response) {
						planned.push(response);
						$scope.sumPlanned()
				});
			}
		}

	}

	$scope.showSettings = function() {
		settingsBlock = document.getElementsByClassName('settings-block')[0]

		if (settingsBlock.className == 'settings-block') {
			settingsBlock.className += ' show-settings-block'
		} else {
			settingsBlock.className = 'settings-block'
		}
	}

	$scope.showPlanned = function() {
		plannedBlock = document.getElementsByClassName('plan-right-block')[0]

		if (plannedBlock.className == 'plan-right-block') {
			plannedBlock.className += ' show-plan-right-block'
		} else {
			plannedBlock.className = 'plan-right-block'
		}
	}

	$scope.getPlannedAmount = function() {
	
		amount = 0

 		for (i=0;$scope.planned.length > i;i++) {
			if ($scope.planned[i].category_id == this.category.id) {
				amount = $scope.planned[i].planned_amount
			}
		}

		return amount
	}



	$scope.probvai = function() {
		console.log($scope.tovaetest)
		colors = ['#087E7E', '#1AF923', '#C2474C', '#BFA41A', '#60E879', '#603885',
				'#76CB49', '#91F70D', '#704FF5', '#E15FD6', '#F4BECB', '#C68600',
				'#17249B', '#9320B7', '#C3A31A', '#A2BCEA', '#AC2D9C', '#F0E589',
				'#6F9976', '#874DDC']
		$scope.thecolor = colors[$scope.tovaetest]
	}


	$scope.testclick_clone = function(event) {

		plamount = this.plan.planned_amount

		$scope.testovobratdisplay = true;

		testovobrat = document.getElementsByClassName('testovobrat')[0]

		for (i=0; $scope.categories.length > i; i++) {
			if ( $scope.categories[i].id == this.plan.category_id ) {
				console.log($scope.categories[i])
				color = $scope.categories[i].color
				title = $scope.categories[i].title
			}
		}

		testovobrat.style.background = color
		testovobrat.style.left = event.target.offsetLeft + 'px'
		testovobrat.style.top = event.target.offsetTop - 100 + 'px'
		testovobrat.textContent = 'You plan to spend ' + plamount + ' лв. for ' + title + ' this month.'
		console.log(title + ' - ' + plamount)
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
	$scope.setCategoryName = function() {
		this_category = this.expense.category_id

 		for (i=0;$scope.categories.length > i;i++) {
			if ($scope.categories[i].id == this_category) {
				name = $scope.categories[i].title
			} else {
				continue
			}
		}

		return name
	}
	$scope.setOnEnter = function(key) {
		if (key.which == ENTER_KEY) {

			$http({
			    method: 'POST',
			    url: 'set_currency',
			    data: {'currency': $scope.currency},
			})

			return false
		}
	}








	$scope.setCategoryColor = function() {
		
		// fix this mess
		vab = this.expense.category_id
 
 		for (i=0;$scope.categories.length > i;i++) {
			if ($scope.categories[i].id == vab) {
				color = $scope.categories[i].color
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
			$scope.submPassButton = false
		})
	}

	$scope.deleteExpense = function(idx) {
		Expens.delete({id: this.expense.id},function() {
			$scope.expenses.splice(idx, 1)
		})
	}

	$scope.sumExpenses();
	$scope.sumPlanned();
});


function getCookie (sKey) {
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
}  

csrftoken = getCookie('csrftoken')



