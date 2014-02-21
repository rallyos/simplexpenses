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

// Doing things on start

	// Set expense date
	var date = new Date()
	// format month and day...
	var month = date.getMonth() + 1
	if (month < 10) { month = '0' + month }
	var day = date.getDate()
	if (day < 10) { day = '0' + day }

	$scope.expense_date = date.getFullYear() + '-' + month + '-' + day

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

	// Set the chart height based on the % of 100
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

	//
	$scope.deleteExpense = function(idx) {
		if (window.confirm('Delete expense?')) {	
			Expense.delete({id: this.expense.id},function() {
				$scope.expenses.splice(idx, 1)
				$scope.checkArrays();
			})
		}
	}

	// Set the height of this planned chart based on % of total planned amounts
	$scope.setPlanChartHeight = function() {
		var in_percent = this.plan.planned_amount / $scope.nextMonthTotal * 100
		var amount = in_percent.toFixed(2)
		return amount + '%'
	}

	// Set the color of the graph
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

	// Get planned amount for this category
	$scope.getPlannedAmount = function() {
		var cgid = this.category.id
		var amount = 0

		// Loop over planned to find related category
 		for (var i=0;$scope.planned.length > i;i++) {
			if ($scope.planned[i].category_id == cgid) {
				amount = $scope.planned[i].planned_amount
			}
		}

		return Number(amount)
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

// Adding expenses

	$scope.selectCategory = function() {

		// Store the id for syncing 
		$scope.selectedCategory = this.category.id

		var catgs = document.getElementsByClassName('add-expense-category')

		// Loop over the elements to reset the previously selected category
		for (var i=0; catgs.length > i; i++) {
			catgs[i].className = 'add-expense-category';
		}

		// Apply the .selected class#
		this.categoryClass = !this.categoryClass;

	}

	$scope.addDashes = function(key) {
		if (key.which != 8) {
			if ($scope.expense_date.length == 4 || $scope.expense_date.length == 7) {
				$scope.expense_date += '-'
			}
		}
	}

	$scope.addExpense = function() {

		$scope.display_error = document.getElementsByClassName('add-expense-error')[0]
		$scope.formErrors = 0

		if (!$scope.exp_description) {
			$scope.display_error.innerHTML += '<li>Please provide a description for this expense.</li>'
			$scope.showHideFormError()
			$scope.formErrors += 1
		}

		if ($scope.exp_amount == 0) {
			$scope.display_error.innerHTML += '<li>Please set a positive amount for the expense.</li>' 
			$scope.showHideFormError()
			$scope.formErrors += 1
		}

		if (!$scope.selectedCategory) {
			$scope.display_error.innerHTML += '<li>Please select a category.</li>' 
			$scope.showHideFormError()
			$scope.formErrors += 1
		}
		// Very basic validation
		// It will be expanded
		if ($scope.expense_date.substring(0,4) > date.getFullYear() || isNaN($scope.expense_date.substring(0,4)) ||
			$scope.expense_date.substring(5,7) > 12 || isNaN($scope.expense_date.substring(5,7)) ||
			$scope.expense_date.substring(8,10) > 31 || isNaN($scope.expense_date.substring(8,10))) {

				$scope.display_error.innerHTML += '<li>Please use this format for the date - YYYY-MM-DD</li>' 
				$scope.showHideFormError()
				$scope.formErrors += 1
		}

		if (!$scope.formErrors) {
			Expenses.save({'amount': $scope.exp_amount, 'description': $scope.exp_description, 'category_id': $scope.selectedCategory, 'date': $scope.expense_date}, function(response) {
				$scope.expenses.unshift(response);
				$scope.sumExpenses()
				$scope.exp_description = ''
				$scope.exp_amount = '0.00'
				// not sure about this
				$scope.checkArrays();
			});
		}
	}

	$scope.showHideFormError = function() {
			$scope.display_error.className = 'add-expense-error add-expense-error-show'
			setTimeout(function() {
				$scope.display_error.innerHTML = ''
				$scope.display_error.className = 'add-expense-error'
			}, 5000)		
	}

	$scope.editExpense = function(event, editMode) {
		if (editMode) {
			$scope.newExpenseAmount = this.expense.amount
			$scope.newExpenseDescription = this.expense.description
			$scope.newExpenseDate = this.expense.date
		} else {
			Expense.update(this.expense)
			$scope.sumExpenses();
		}
	}

	$scope.expenseEditDate = function(key) {
		if (key.which != 8) {
			if ($scope.newExpenseDate.length == 4 || $scope.newExpenseDate.length == 7) {
				$scope.newExpenseDate += '-'
			}
		}
		console.log($scope.newExpenseDate)
	}

	$scope.expenseEditCategory = function(expense) {
		// console.log(this)
		$scope.newExpenseCategoryId = this.category.id
		expense.category_id = $scope.newExpenseCategoryId
		// console.log(expense)
	}

	// Changing color based on slider value when creating category
	$scope.changeColor = function() {
		$scope.categoryColor = colors[$scope.selectedColor]
	}

	// Create category
	$scope.createOnEnter = function(key) {
		if (key.which == ENTER_KEY) {
			Categories.save({'name': $scope.newCategoryName, 'color': $scope.categoryColor}, function(response) {
				$scope.categories.push(response);
			
				$scope.newCategoryName = ''
				$scope.categoryColor = colors[Math.floor((Math.random() * 35) + 0)]

				// not sure about this either
				$scope.checkArrays();
			})
			return false
		}
	}


// Show window with planned or summed expenses
// This function is packed from old 2, no need for separated funcs for now

	// Show the window and calculate
	// Simplify the calculations in the future
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
		detailsDesplay.style.left = event.target.offsetLeft + 'px'
		detailsDesplay.style.top = event.target.offsetTop - 100 + 'px'
		detailsText.textContent = info
	}

// Show and hide settings and plan blocks
	
	$scope.showSettings = function() {

		// Show
		settingsBlock.toggleClass('show-settings-block')

		// Hide block when clicked outside and remove listener
		// Checks if the click is not somewhere in the block (bugs expected)
		var closeSettingsOnClick = function(click) {
			if (click.target.offsetParent.classList[0] != 'settings-block' && click.target.offsetParent.classList[0] != 'menu-block') {
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

	// Show settings on mobile | Scroll to 0 because the block won't be visible
	$scope.mobileSettings = function() {
		window.scrollTo(0)
		settingsBlock.toggleClass('show-settings-block')
	}

	// Show planned on mobile | Scroll to 0 because the block won't be visible
	$scope.mobilePlanned = function() {
		window.scrollTo(0)
		plannedBlock.toggleClass('show-plan-expenses-block')
	}

	// Update planend amount
	$scope.updatePlanned = function(event) {
		//delete
		//cgid = this.category.id

		// On enter
		if (event.which == ENTER_KEY) {

			// Loop over planned to find related category
			for (var i=0; $scope.planned.length > i;i++) {
				if ($scope.planned[i].category_id == this.category.id) {

					// Update the planned amount
					$scope.planned[i].planned_amount = Number(event.target.value)

					// Set is(related category)_find to true
					var is_found = true;

					// Sync with the server
					Plan.planCategory({id: this.category.id, planned_amount: $scope.planned[i].planned_amount}, function() {
						$scope.sumPlanned()
					})
					break
				} else {
					// Related category is not found, therefor send post request to server
					var is_found = false;
				}
			}

			// Send post request to create new planned object
			if (!is_found) {
				Planned.save({'category_id': this.category.id, 'planned_amount': event.target.value},function(response) {
						$scope.planned.push(response);
						$scope.sumPlanned()
				});
			}
		}

	}

// Edit categories block
	
	// Called when slider position is changed
	// On change a 3s timeout is called to sync with the server
	$scope.editCategoryColor = function(newCategoryColor) {
		// Set color
		this.category.color = colors[newCategoryColor]

		// If timeout t is running - stop it
		if(typeof t !== "undefined"){
		  clearTimeout(t);
		}

		// Sync with the server
		var t = setTimeout(function() {
			Category.updateColor({id: this.category.id, color: this.category.color})
		}, 3000)
	}

	// On click change element to contenteditable
	$scope.editCategoryName = function(click) {
		$scope.contentedit = true
		click.target.style.cursor = 'text'
	}

	// On Enter return the element to it's default form
	// Change name and sync with the server
	$scope.setNameOnEnter = function(key) {
		if (key.which == ENTER_KEY) {
			$scope.contentedit = false
			key.target.style.cursor = 'pointer'
			this.category.name = key.target.textContent
			Category.updateName({id: this.category.id, name: this.category.name})
		}
	}

	// Delete on confirmation
	$scope.deleteCategory = function(idx) {
		if (window.confirm('Are you sure? This will delete all expenses categorized as ' + this.category.name)) {
			Category.delete({id: this.category.id},function() {
				$scope.categories.splice(idx, 1)
				$scope.checkArrays();
			})
		}
	}

	// Get the category of this expense
	$scope.getCategoryName = function() {

		var cgid = this.expense.category_id

		// Loop over the categories to find the related one
 		for (var i=0;$scope.categories.length > i;i++) {
			if ($scope.categories[i].id == cgid) {
				var name = $scope.categories[i].name
			} else {
				continue
			}
		}

		return name
	}

	// Get the category color of this expense
	$scope.getCategoryColor = function() {

		var cgid = this.expense.category_id
 		
 		// Loop over to get the color
 		for (var i=0;$scope.categories.length > i;i++) {
			if ($scope.categories[i].id == cgid) {
				var color = $scope.categories[i].color
			}
		}

		return color
	}

// App settings
	
	// Set used currency
	$scope.setOnEnter = function(key) {
		if (key.which == ENTER_KEY) {
/*
			// If not set before - create new model object
			if (currency == '') {
				$http({
				    method: 'POST',
				    url: 'set_currency',
				    data: {'currency': $scope.currency},
				})
			// If set - update
			} else {
*/
				$http({
				    method: 'PUT',
				    url: 'set_currency',
				    data: {'currency': $scope.currency},
				})
			// }

			return false
		}
	}

	// Show or hide New category creation block
	$scope.toggleNcButton = function() {

		// When checked/unchecked set timeout to sync with server after 3s
		setTimeout(function() {
			$http({
			    method: 'PUT',
			    url: 'toggleNewCgButton',
			    data: {'show_CategoryCreationForm': $scope.show_CategoryCreationForm},
			})
		}, 3000);
	}

	// Change password
	// ToDo (Confirmation message needed)
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

	// Sum on load
	$scope.sumExpenses();
	$scope.sumPlanned();
	$scope.checkArrays();
});