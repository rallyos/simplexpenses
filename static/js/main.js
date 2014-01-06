
// ..... don't be shameful of this here... :)
// And change the name of 'planned'
var ENTER_KEY = 13;

// maybe delete when the classes if you have own toggle func
var tick = new Image()
tick.src = 'http://simplexpenses.herokuapp.com/static/img/rt.png'

var expensesApp = angular.module('expensesApp', ['ngResource', 'ngAnimate']);


expensesApp.config(function($httpProvider) {
	$httpProvider.defaults.headers.post = {'X-CSRFToken': csrftoken, 'Content-Type': 'application/json'}
	$httpProvider.defaults.headers.delete = {'X-CSRFToken': csrftoken, 'Content-Type': 'application/json'}
	$httpProvider.defaults.headers.put = {'X-CSRFToken': csrftoken, 'Content-Type': 'application/json'}
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

expensesApp.factory('Catego', ['$resource', function($resource) {
	return $resource( '/api/category/:id');
}]);

expensesApp.controller('mainController', function($scope, $http, Expense, Category, Planned, Expens, Catego) {

	$scope.categories = JSON.parse(c)
	$scope.expenses = JSON.parse(e);
	$scope.planned = JSON.parse(p);
	$scope.currency = currency

	$scope.showNewCatButton = showNewCatButton

	testovobrat = document.getElementsByClassName('graph-information')[0]
	testovotext = document.getElementsByClassName('graph-information-text')[0]
	wrapper = document.getElementsByClassName('wrapper')[0]

	$scope.exp_amount = '0.00'

	$scope.tovaetest = '#343534' // should be random color


	colors = ['#5b009c', '#a086d3', '#c7c5e6', '#003580', '#0039a6', '#0060a3', '#3b5998', '#005cff', '#59a3fc', '#2d72da', '#1d8dd5', '#3287c1',
			'#126567', '#5e8b1d', '#16a61e', '#7eb400', '#00a478', '#40a800', '#81b71a', '#8cc83b', '#82b548', '#9aca3c', '#5cb868',
			'#ffcc00', '#ffcc33', '#db7132', '#e47911', '#ff8700', '#dd4814', '#f0503a', '#e51937', '#e54a4f', '#dd4b39', '#cc0f16', '#a82400', '#b9070a']

	$scope.thecolor = colors[Math.floor((Math.random() * 35) + 0)]


	// offfff :( delete these two lines
	settingsBlock = document.getElementsByClassName('settings-block')[0]
	plannedBlock = document.getElementsByClassName('plan-expenses-block')[0]

	$scope.translateForm = function() {
		$scope.headerClass = !$scope.headerClass;
	}


	$scope.selectCategory = function() {
		// again highly expiremental
		$scope.selectedCat = this.category.id
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
			Category.save({'title': $scope.newCategoryName, 'description': 'a new category', 'color': $scope.thecolor}, function(response) {
				$scope.categories.push(response);
			})

			return false
		}
	}

	$scope.showPlnCatDetails = function() {

			plamount = this.plan.planned_amount

			$scope.showGraphInfo = true;


			for (i=0; $scope.categories.length > i; i++) {
				if ( $scope.categories[i].id == this.plan.category_id ) {
					color = $scope.categories[i].color
					title = $scope.categories[i].title
				}
			}

			testovobrat.style.background = color
			testovobrat.style.left = event.target.offsetLeft + 'px'
			testovobrat.style.top = event.target.offsetTop - 100 + 'px'
			testovotext.textContent = 'You plan to spend ' + plamount + ' лв. for ' + title + ' this month.'
	}

	$scope.showExpCatDetails = function() {		
			sum = 0;

			$scope.showGraphInfo = true;

	 		for (i=0;$scope.expenses.length > i;i++) {

				if ($scope.expenses[i].category_id == this.category.id) {
					var number = Number($scope.expenses[i].amount)
					sum = sum + number
					var amount = sum.toFixed(2);
				} else {
					continue
				}
			}

			testovobrat.style.background = this.category.color
			testovobrat.style.left = event.target.offsetLeft + 'px'
			testovobrat.style.top = event.target.offsetTop - 100 + 'px'
			testovotext.textContent = 'You spent ' + amount + ' лв. for ' + this.category.title + ' this month.'
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
		in_percent = this.plan.planned_amount / $scope.nextMonthTotal * 100
		amount = in_percent.toFixed(2)
		return amount + '%'
	}

	$scope.sumExpenses = function () {
		sum = 0

		for (i=0; $scope.expenses.length > i;i++) {

			var number = Number($scope.expenses[i].amount)
			sum = sum + number
		}

		var amount = sum.toFixed(2);
		$scope.thisMonthTotal = amount
	}

	$scope.sumPlanned = function() {
		sum = 0

		for (i=0; $scope.planned.length > i;i++) {

			var number = Number($scope.planned[i].planned_amount)
			sum = sum + number
		}

		var amount = sum.toFixed(2);
		$scope.nextMonthTotal = amount
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
						$scope.planned.push(response);
						$scope.sumPlanned()
				});
			}
		}

	}

	$scope.showSettings = function() {

		settingsBlock = document.getElementsByClassName('settings-block')[0]

		if (settingsBlock.className == 'settings-block') {
			settingsBlock.className += ' show-settings-block'

			closeSettingsOnClick = function(click) {
				// settings
				if (click.target.offsetParent.classList[0] != 'settings-block' && click.target.offsetParent.classList[0] != 'menu-block') {
					settingsBlock.className = 'settings-block'
					wrapper.removeEventListener('click', closeSettingsOnClick)
				}
			}

			wrapper.addEventListener('click', closeSettingsOnClick)

		} else {
			settingsBlock.className = 'settings-block'
		}
	}

	$scope.showPlanned = function() {

		plannedBlock = document.getElementsByClassName('plan-expenses-block')[0]

		if (plannedBlock.className == 'plan-expenses-block') {
			plannedBlock.className += ' show-plan-expenses-block'

			closePlannedOnClick = function(click) {
				if (click.target.offsetParent.classList[0] != 'plan-expenses-block' && click.target.offsetParent.classList[0] != 'menu-block') {
					plannedBlock.className = 'plan-expenses-block'
					wrapper.removeEventListener('click', closePlannedOnClick)
				}				
			}

			wrapper.addEventListener('click', closePlannedOnClick)
		} else {
			plannedBlock.className = 'plan-expenses-block'
		}
	}

	$scope.getPlannedAmount = function() {
	
		amount = 0

 		for (i=0;$scope.planned.length > i;i++) {
			if ($scope.planned[i].category_id == this.category.id) {
				amount = $scope.planned[i].planned_amount
			}
		}

		return Number(amount)
	}



	$scope.probvai = function() {
		$scope.thecolor = colors[$scope.tovaetest]
	}

	$scope.hideElements = function(click) {
		if (click.target.classList[0] != 'category' && $scope.showGraphInfo == true) {
			$scope.showGraphInfo = false;		
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
		amount = amount / $scope.thisMonthTotal * 100
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
			    data: {'showNewCatButton': $scope.showNewCatButton},
			})
		}, 3000);
	}

	$scope.editCategoryColor = function(newCategoryColor) {
		this.category.color = colors[newCategoryColor]
		cat = this.category
		// time for put method in directives...
		if(typeof t !== "undefined"){
		  clearTimeout(t);
		}
		t = setTimeout(function() {
			$http({
			    method: 'PUT',
			    url: '/api/category/' + cat.id,
			    // remove title, description and tell the backend not to need them
			    data: {title: cat.title, description: 'Edited',color: cat.color},
			    headers: {'X-CSRFToken': csrftoken}
			})
	
			console.log('started')
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
			this.category.title = key.target.textContent
			console.log(this.category.title)
			$http({
			    method: 'PUT',
			    url: '/api/category/' + this.category.id,
			    // remove title, description and tell the backend not to need them
			    data: {title: this.category.title, description: 'Edited', color: this.category.color},
			    headers: {'X-CSRFToken': csrftoken}
			})			
		}
	}

	$scope.deleteCategory = function(idx) {
		Catego.delete({id: this.category.id},function() {
			$scope.categories.splice(idx, 1)
		})		
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
			$scope.showSubmPassButton = false
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



