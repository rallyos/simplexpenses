// Most of the controller functions need urgent refactor
// check them when you have time

expensesApp.controller('mainController', function($scope,  $rootScope, $filter, $http, Expenses, Categories, Planned, Expense, Category, Plan) {
// Set globals

	// Data collections
	// Maybe use services or something?
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

	// All category colors for now
	// Replace with some color palette
	window.COLORS = ['#5b009c', '#a086d3', '#c7c5e6', '#003580', '#0039a6', '#0060a3', '#3b5998', '#005cff', '#59a3fc', '#2d72da', '#1d8dd5', '#3287c1',
			'#126567', '#5e8b1d', '#16a61e', '#7eb400', '#00a478', '#40a800', '#81b71a', '#8cc83b', '#82b548', '#9aca3c', '#5cb868',
			'#ffcc00', '#ffcc33', '#db7132', '#e47911', '#ff8700', '#dd4814', '#f0503a', '#e51937', '#e54a4f', '#dd4b39', '#cc0f16', '#a82400', '#b9070a']

	// Store the blocks
	var settingsBlock = document.getElementsByClassName('settings-block')[0]
	var plannedBlock = document.getElementsByClassName('plan-expenses-block')[0]

	// Checks if user has any data
	$scope.checkArrays = function() {
		if ($scope.categories.length > 0) {
			$scope.no_categories = false;
		} else {
			$scope.no_categories = true;
		}

		if ($scope.expenses.length > 0) {
			$scope.no_expenses = false;
		} else {
			$scope.no_expenses = true;
		}		
	}

	// Sets the chart height based on the % of 100
	// Refactor needed
	$scope.chartHeight = function() {

		// Store category id
		var cgid = this.category.id
		var sum = 0

		// Loop over the expenses and sum the expenses
		// !! Since this loop is used couple of times, maybe one function that accepts category id parameter and return the sum will be helpful.
 		for (var i=0;$scope.expenses.length > i;i++) {
			if ($scope.expenses[i].category_id == cgid) {
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


	// Sets the height of this planned chart based on % of total planned amounts
	$scope.setPlanChartHeight = function() {
		var in_percent = this.plan.planned_amount / $scope.nextMonthTotal * 100
		var amount = in_percent.toFixed(2)
		return amount + '%'
	}

	// Sets the color of the graph
	$scope.setPlanChartColor = function() {
		var cgid = this.plan.category_id
 		
 		// Loop over categories to find the color of the related one
 		for (var i=0;$scope.categories.length > i;i++) {
			if ($scope.categories[i].id == cgid) {
				var color = $scope.categories[i].color
			}
		}

		return color
	}

	// Sum all expenses
	$scope.sumExpenses = function () {
		var sum = 0
		// Loop over the expenses to sum
		for (var i=0; $scope.expenses.length > i;i++) {
			var number = Number($scope.expenses[i].amount)
			sum = sum + number
		}

		$scope.thisMonthTotal = sum.toFixed(2);
	}

	// Sum planned
	$scope.sumPlanned = function() {
		var sum = 0

		// Loop over the planned to sum
		for (var i=0; $scope.planned.length > i;i++) {

			var number = Number($scope.planned[i].planned_amount)
			sum = sum + number
		}

		$scope.nextMonthTotal = sum.toFixed(2);
	}

	// Refactor and comments please!
	$scope.calcAverages = function() {
		// Get expenses dates
		var spent_by_days = []
		today = new Date()
		days_count = new Date(today.getFullYear(), today.getMonth()+1, 0).getDate()

		for (var i = 1; i <= days_count; i++) {
			v = 0
			for (var ii = 0; ii <= $scope.expenses.length-1; ii++) {
				if ($filter('date')($scope.expenses[ii].date, 'dd') == i) {
					v = v + Number($scope.expenses[ii].amount)
				}
			};
			if (v) {
				spent_by_days.push(v)
			}
		};
		//  Important > Use it in the other functions
		if ($scope.expenses.length > 1) {
			var summed = spent_by_days.reduce(function(a, b) {
			    	return a + b;
				});
		 	return summed / spent_by_days.length
		 } else {
		 	return 0
		 }
	}




// Show window with planned or summed expenses
// This function is packed from old 2, no need for separated funcs for now

	// Show the window and calculate
	// Simplify the calculations in the future
	// !!Refactor this mess!!
	$scope.showDetailsWindow = function(event, is_expenses) {
		// Show 

		$scope.showGraphInfo = true;
		var sum = 0

		// Tired of how ng-animation works and
		// Trying to fix the angular delay
		setTimeout(function() {
			detailsDesplay.classList.add('graph-information-show')
		}, 50)
		// Is expenses, or planned?
		if (is_expenses) {

			// Store color and name of the category
			var color = this.category.color;
			var name = this.category.name
			var cgid = this.category.id

			// Loop over the expenses 
			// If expense's category id are equal with this category - get the amount 
			// sum all amounts and store the number
			// Angular .get method will be helpful when added...
		 	for (var i=0; $scope.expenses.length > i; i++) {
				if ($scope.expenses[i].category_id == cgid) {
					var number = Number($scope.expenses[i].amount)
					sum = sum + number
					var amount = sum.toFixed(2);
				}
			}

			// If undefined - show 0 (Fixing 'You spent <undefined> for ...')
			if (!amount) {
				var amount = 0
			}

			// Show the information
			$scope.updateDetailsWindow(event, color, 'You spent ' + amount + ' ' + $scope.currency +' for ' + name + ' this month.')
		} else {

			// Store related category id and planned amount
			var cgid = this.plan.category_id
			var amount = this.plan.planned_amount

			// Loop over the categories
			// When the related category is found - store color and name, then break the loop
			// Angular .get method will be helpful when added...
			for (var i=0; $scope.categories.length > i; i++) {
				if ( $scope.categories[i].id == cgid ) {
					var color = $scope.categories[i].color
					var name = $scope.categories[i].name
					break
				}
			}

			// If undefined - show 0 (Fixing 'You spent <undefined> for ...')
			if (!amount) {
				var amount = 0
			}

			// Show the information
			$scope.updateDetailsWindow(event, color, 'You plan to spend ' + amount + ' '+ $scope.currency +' for ' + name + ' this month.')
		}

	}

	// Set window color like the category color and show the information
	$scope.updateDetailsWindow = function(event, color, info) {
		detailsDesplay.style.background = color
		detailsText.textContent = info
		detailsDesplay.style.left = event.target.offsetLeft - (detailsDesplay.clientWidth / 2) + 'px'
		detailsDesplay.style.top = event.target.offsetTop - 100 + 'px'
	}

// Show and hide settings and plan blocks
	
	$scope.showSettings = function() {

		// Show
		settingsBlock.toggleClass('show-settings-block')

		// Hide block when clicked outside and remove listener
		// Checks if the click is not somewhere in the block (bugs expected)
		var closeSettingsOnClick = function(click) {
			if (click.target.offsetParent.classList[0] != 'settings-block' && 
				click.target.offsetParent.classList[0] != 'menu-block' && 
				click.target.className != 'ng-valid ng-dirty') {
					settingsBlock.toggleClass('show-settings-block')
					wrapper.removeEventListener('click', closeSettingsOnClick)
			}
		}

		// Add listener for click outside the block to close (BASIC VERSION)
		wrapper.addEventListener('click', closeSettingsOnClick)
	}

	$scope.showPlanned = function() {

		// show
		plannedBlock.toggleClass('show-plan-expenses-block')

		// Hide block when clicked outside and remove listener
		// Checks if the click is not somewhere in the block (bugs expected)
		var closePlannedOnClick = function(click) {
			if (click.target.offsetParent.classList[0] != 'plan-expenses-block' && click.target.offsetParent.classList[0] != 'menu-block') {
				plannedBlock.toggleClass('show-plan-expenses-block')
				wrapper.removeEventListener('click', closePlannedOnClick)
			}				
		}

		// Add listener for click outside the block to close (BASIC VERSION)
		wrapper.addEventListener('click', closePlannedOnClick)
	}

	// Hide other elements (detailsDisplay for now)
	// Activated by click in wrapper...
	$scope.hideElements = function(click) {
		if (click.target.classList[0] != 'category' && $scope.showGraphInfo == true) {
			detailsDesplay.classList.remove('graph-information-show')
			setTimeout(function() {
				$scope.showGraphInfo = false;		
			}, 300)
		}
	}

	$scope.hideExpMenu = function(expense_menu_show, click) {
		
		// Hide block when clicked outside and remove listener
		// Checks if the click is not somewhere in the block (bugs expected)
		var hideMenu = function(click) {
			if (click.target.offsetParent.classList[0] != 'expense' && click.target.offsetParent.classList[0] != 'expense-menu') {
				wrapper.removeEventListener('click', hideMenu)
			}				
		}
		// Add listener for click outside the block to close (BASIC VERSION)
		wrapper.addEventListener('click', hideMenu)

	}

	// Show settings on mobile | Scroll to 0 because the block won't be visible
	$scope.mobileSettings = function() {
		window.scrollTo(0, 0)
		settingsBlock.toggleClass('show-settings-block')
	}

	// Show planned on mobile | Scroll to 0 because the block won't be visible
	$scope.mobilePlanned = function() {
		window.scrollTo(0, 0)
		plannedBlock.toggleClass('show-plan-expenses-block')
	}

	// Just testing
	$scope.$watchCollection('expenses', function() {
		$scope.sumExpenses();
		$scope.sumPlanned();
		$scope.checkArrays();
		$scope.avgDaily = $scope.calcAverages().toFixed(2)
		$scope.highest_expense = $scope.calcHighest()
		$scope.highest_savings = $scope.calcSavings()
		$scope.the_day = $scope.calcDays()
		$scope.$emit('draw')
	});

	window.onresize = function() {
		setTimeout(function() {
			$scope.$emit('draw')
		}, 1000)
	};

	$scope.$watch('planned', function() {
		$scope.sumPlanned();
		$scope.checkArrays();
	}, true);

	$scope.$watchCollection('categories', function() {
		$scope.checkArrays();
	});

	$scope.$on('expense_changed', function(){
		$scope.sumExpenses();
		$scope.avgDaily = $scope.calcAverages().toFixed(2)
		$scope.highest_expense = $scope.calcHighest()
		$scope.calcSavings
		$scope.$emit('draw')
	});
});