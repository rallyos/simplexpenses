
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
// TEEEEEST
expensesApp.factory('Expens', ['$resource', function($resource) {
	return $resource( '/api/expense/:id');
}]);

expensesApp.controller('mainController', function($scope, $http, Expense, Category, Planned, Expens) {

	$scope.expenses = expenses
	$scope.categories = categories
	$scope.planned = planned

	$scope.testclick = function(event) {

		sum = 0;

 		for (i=0;$scope.expenses.length > i;i++) {

			if ($scope.expenses[i].category_id == this.category.id) {
				console.log('initial value is ' + $scope.expenses[i].amount)
				var number = Number($scope.expenses[i].amount)
				sum = sum + number
				console.log('then the sum variable becomes ' + sum)
				var amount = sum.toFixed(2);
				console.log('and the final amount is ' + amount)
			} else {
				continue
			}
		}

		//amount = amount.toFixed(2)
		$scope.testovobratdisplay = true;

		testovobrat = document.getElementsByClassName('testovobrat')[0]

		console.log(amount)
		//testovobrat.style.display = 'block'
		testovobrat.style.background = this.category.color
		testovobrat.style.left = event.target.offsetLeft + 'px'
		testovobrat.style.top = event.target.offsetTop - 100 + 'px'
		testovobrat.textContent = 'You spent ' + amount + ' лв. for ' + this.category.title + ' this month.'
		console.log(this.category.title + ' - ' + amount)

	}

	$scope.testclick_clone = function(event) {

		plamount = this.plan.planned_amount

		//amount = amount.toFixed(2)
		$scope.testovobratdisplay = true;

		testovobrat = document.getElementsByClassName('testovobrat')[0]

		for (i=0; $scope.categories.length > i; i++) {
			if ( $scope.categories[i].id == this.plan.category_id ) {
				console.log($scope.categories[i])
				color = $scope.categories[i].color
				title = $scope.categories[i].title
			}
		}

		//testovobrat.style.display = 'block'
		testovobrat.style.background = color
		testovobrat.style.left = event.target.offsetLeft + 'px'
		testovobrat.style.top = event.target.offsetTop - 100 + 'px'
		testovobrat.textContent = 'You planned to spend ' + plamount + ' лв. for ' + title + ' this month.'
		console.log(title + ' - ' + plamount)
	}

	$scope.testam = function() {

		description = 'from the form'
		Expense.save({'amount': $scope.exp_amount, 'description': $scope.exp_description, 'category_id': $scope.selectedCat},function(response) {
			$scope.expenses.unshift(response);
			$scope.sumExpenses()
			$scope.exp_description = ''
			$scope.exp_amount = '0.00'
		});
	}

	$scope.testamdve = function(event) {

		$scope.addCategoryButton = event.target
		$scope.addCategoryButton.textContent = ''
		$scope.addCategoryButton.setAttribute('contenteditable', 'true')
		$scope.addCategoryButton.style.cursor = 'text'
		$scope.addCategoryButton.focus()

		// Temporary solution till I find how to chain it...
		/*setTimeout(function() {
			lastCategory = event.target.previousElementSibling
			lastCategory.setAttribute('contenteditable', 'true')
			lastCategory.focus()
			lastCategory.style.cursor = 'text'
		}, 50)
*/
	}

	$scope.addCategory = function(key) {
		if (key.which == ENTER_KEY) {
			var title = key.target.textContent
			Category.save({'title': title, 'description': 'a new category', 'color': '#ff6138'}, function(response) {
				$scope.categories.push(response);
				$scope.addCategoryButton.textContent = 'Add Category'
				$scope.addCategoryButton.removeAttribute('contenteditable')
				$scope.addCategoryButton.style.cursor = 'pointer'
			})

			return false
		}
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

	$scope.dsa_clone = function() {
		// highly expiremental
		in_percent = this.plan.planned_amount / $scope.nextMonthAmount * 100
		amount = in_percent.toFixed(2)
		return amount + '%'
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

	$scope.testas_clone = function() {

		// fix this mess
		vab = this.plan.category_id
 
 		for (i=0;$scope.categories.length > i;i++) {
			if ($scope.categories[i].id == vab) {
				color = $scope.categories[i].color
			}
		}

		return color
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
					$scope.sumPlanned()
				}
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

	$scope.del_test = function(idx) {
		// until i found a way to use $resource for this
		console.log('its now working???')
		Expens.delete({id: this.expense.id},function() {
			$scope.expenses.splice(idx, 1)
		})
	}
/*
		$http({
		    method: 'DELETE',
		    url: 'api/expense/' + this.expense.id,
		    headers: {'X-CSRFToken': csrftoken}
		}).success(function() {
			$scope.expenses.splice(idx, 1)
		})
	}
*/
});


function getCookie (sKey) {
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
}  

csrftoken = getCookie('csrftoken')



