// Separate to files
expensesApp.directive('expenseform', ['Expenses', 'Expense', 'Categories', '$rootScope', function(Expenses, Expense, Categories, $rootScope) {
	return {
		restrict: 'A',

		link: function($scope, elem, attrs) {

			// Adds dashes to format date
			angular.element(elem.find('input')[3]).on('keyup', function(key) {
				if (key.which != 8) {
					if ($scope.expense_date.length == 4 || $scope.expense_date.length == 7) {
						$scope.expense_date += '-'
						$scope.$apply()
					}
				}
			});

			// Gets today :)
			function today() {
				var date = new Date()

				// ... in yyyy-mm-dd format
				var month = date.getMonth() + 1
				if (month < 10) { month = '0' + month }
				
				var day = date.getDate()
				if (day < 10) { day = '0' + day }

				return date.getFullYear() + '-' + month + '-' + day
			}

			// Shows tooltip how to add categories because it's not so obvious
			$scope.showTooltip = function() {
				if (tooltip_cookie) {
					$scope.showTip = true
				}
			}

			// Disables tooltips
			$scope.removeCookie = function() {
				document.cookie='show_tooltips=false';
			}

			// Selects category when adding expense
			// Needs refinement
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

			// Submit if enter is pressed
			$scope.submitOnEnter = function(event) {
				if (event.which == ENTER_KEY) {
					$scope.addExpense()
				}
			}

			// Validation and expense adding
			// Needs refactor
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
				date = new Date()
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
						$scope.exp_description = ''
						$scope.exp_amount = '0.00'
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

			// Changing color based on slider value when creating category
			$scope.changeColor = function() {
				$scope.categoryColor = COLORS[$scope.selectedColor]
			}

			// Create category
			$scope.createOnEnter = function(key) {
				if (key.which == ENTER_KEY) {
					Categories.save({'name': $scope.newCategoryName, 'color': $scope.categoryColor}, function(response) {
						$scope.categories.push(response);
					
						$scope.newCategoryName = ''
						$scope.categoryColor = COLORS[Math.floor((Math.random() * 35) + 0)]
					})
					return false
				}
			}

			// Set expense date
			$scope.expense_date = today()
			$scope.exp_amount = '0.00'
			
			// Select random color on load
			$scope.categoryColor = COLORS[Math.floor((Math.random() * 35) + 0)]
		}
	}
}]);

// Expense
expensesApp.directive('expense', ['Expense', function(Expense) {
	return {
		restrict: 'A',

		link: function($scope, elem, attrs) {

			// Adds dashes when the user is editing the expense date
			// (- What can be done-)
			// 		(-) this elem.children.children is ugly, find better way.
			angular.element(elem[0].children[3].children[0]).on('keyup', function(key) {
				if (key.which != 8) {
					if ($scope.newExpenseDate.length == 4 || $scope.newExpenseDate.length == 7) {
						$scope.newExpenseDate += '-'
						$scope.$apply()
					}
				}
			});

			// Finds the category that the expense is connected to
			// (- What can be done-)
			// 		(-) Angular has foreach func, investigate further :)
			$scope.getCategory = function() {

				var cgid = this.expense.category_id

				// Loop over the categories to find the related one
		 		for (var i=0;$scope.categories.length > i;i++) {
					if ($scope.categories[i].id == cgid) {
						var name = $scope.categories[i].name
						var color = $scope.categories[i].color
					}
				}

				return {'name': name, 'color': color}
			}

			// Changes expense category
			$scope.expenseEditCategory = function(expense) {
				expense.category_id = this.category.id
				$scope.$emit('expense_changed')
			}

			// Triggered when the edit button is clicked again in expense menu
			// Edits all expense attrs at once
			// (- What can be done-)
			// 		(-) The function doesn't check if attrs are changed, it just updates them
			// 			with the values from the input fields.
			//			Add 'changed' check
			$scope.editExpense = function(editMode) {
				// If edit mode is on, stores the current values to the inputs
				if (editMode) {
					$scope.newExpenseAmount = this.expense.amount
					$scope.newExpenseDescription = this.expense.description
					$scope.newExpenseDate = this.expense.date
				// edit mode off - update and trigger event
				} else {
					Expense.update(this.expense)
					this.$emit('expense_changed');
				}
			}

			// Delete
			$scope.deleteExpense = function(idx) {
				if (window.confirm('Delete expense?')) {	
					Expense.delete({id: this.expense.id},function() {
						$scope.expenses.splice(idx, 1)
					})
				}
			}

			// Custom event usually triggered when expense attrs are changed
			$scope.$on('expense_changed', function() {
				$scope.categoryName = $scope.getCategory().name
				$scope.categoryColor = $scope.getCategory().color
			})

			// Trigger change on compile
			// A bit hacky but this stays for now
			$scope.$emit('expense_changed')
		}
	}
}]);

// Category edit
expensesApp.directive('categorysettings', ['Category', function(Category) {
	return {
		restrict: 'A',
		link: function($scope, elem, attrs) {

			// Called when slider position is changed
			// On change a 3s timeout is called before sync with the server
			$scope.editCategoryColor = function(newCategoryColor) {

				// Set color
				$scope.category.color = COLORS[newCategoryColor]

				// If timeout t is running - stop it
				if(typeof t !== "undefined"){
				  clearTimeout(t);
				}

				// Sync with the server
				var t = setTimeout(function() {
					Category.updateColor({id: $scope.category.id, color: $scope.category.color})
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
					$scope.category.name = key.target.textContent
					Category.updateName({id: $scope.category.id, name: $scope.category.name})
				}
			}

			// Delete on confirmation
			$scope.deleteCategory = function(idx) {
				if (window.confirm('Are you sure? this will delete all expenses categorized as ' + $scope.category.name)) {
					Category.delete({id: $scope.category.id},function() {
						$scope.categories.splice(idx, 1)
					})
				}
			}
		}
	}
}])

// Planned
expensesApp.directive('planned', ['Planned', 'Plan', function(Planned, Plan) {
	
	return {
		restrict: 'A',
		link: function($scope, elem, attrs) {

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

			// Plan spendings for this month
			// (- What can be done-)
			// 		(-) Event listeners
			elem.on('keydown', function(event) {
				if (event.which == ENTER_KEY) {
					// Loop over planned to find related category
					for (var i=0; $scope.planned.length > i;i++) {
						if ($scope.planned[i].category_id == $scope.category.id) {

							// Update the planned amount
							$scope.planned[i].planned_amount = Number(event.target.value)

							// Set is(related category)_find to true
							var is_found = true;

							// Sync with the server
							Plan.planCategory({id: $scope.planned[i].id, planned_amount: $scope.planned[i].planned_amount, category_id: $scope.category.id})
							break
						} else {
							// Related category is not found, therefor send post request to server
							var is_found = false;
						}
					}

					// Send post request to create new planned object
					if (!is_found) {
						Planned.save({'category_id': $scope.category.id, 'planned_amount': event.target.value},function(response) {
								$scope.planned.push(response);
						});
					}
				}

			});

			$scope.planned_amount = $scope.getPlannedAmount()
		}
	}
}]);

// 
expensesApp.directive('highestexpense', function() {
	return {
		restrict: 'A',

		link: function($scope, elem, attrs) {
			$scope.calcHighest = function() {
				var expenses_copy = $scope.expenses.slice()

				expenses_copy.sort(function (a, b) {
				    if (Number(a.amount) > Number(b.amount))
				      return 1;
				    if (Number(a.amount) < Number(b.amount))
				      return -1;
				    // a must be equal to b
				    return 0;
				});

				return expenses_copy.reverse()[0].amount
			}

			$scope.highest_expense = $scope.calcHighest()

		}
	}
});

// 
expensesApp.directive('highestsavings', function() {
	return {
		restrict: 'A',

		link: function($scope, elem, attrs) {
			var spent_by_category = []
			$scope.calcSavings = function() {

				for (var i = 0; $scope.categories.length > i; i++) {

					var amount = 0
					for (var ii = 0; $scope.expenses.length > ii; ii++) {
						if ($scope.categories[i].id == $scope.expenses[ii].category_id) {
							amount = amount + Number($scope.expenses[ii].amount)
						}
					};

					planned_amount = 0
					for (var iii = 0; $scope.planned.length > iii; iii++) {
						if ($scope.categories[i].id == $scope.planned[iii].category_id) {
							planned_amount = planned_amount + Number($scope.planned[iii].planned_amount)
						}
					};

					spent_by_category.push({'name': $scope.categories[i].name, 'color': $scope.categories[i].color, 'spent': amount, 'planned': planned_amount})
				};


				var g = []
				for (var i = 0; spent_by_category.length > i; i++) {
					g.push({'name': spent_by_category[i].name, 'color': spent_by_category[i].color,'saved': spent_by_category[i].spent - spent_by_category[i].planned})
				};

				g.sort(function (a, b) {
				    if (Number(a.saved) > Number(b.saved))
				      return 1;
				    if (Number(a.saved) < Number(b.saved))
				      return -1;
				    // a must be equal to b
				    return 0;
				});

				return g[0]
			}

			$scope.highest_savings = $scope.calcSavings()
		}
	}
});

// 
expensesApp.directive('spendingsonday', function(){
	return {
		restrict: 'A',
		link: function($scope, elem, attrs) {
			$scope.calcDays = function() {
				days_of_week = [
					{'day':'Sunday', 'amount': 0},
					{'day':'Monday', 'amount': 0},
					{'day':'Tuesday', 'amount': 0},
					{'day':'Wednesday', 'amount': 0},
					{'day':'Thursday', 'amount': 0},
					{'day':'Friday', 'amount': 0},
					{'day':'Saturday', 'amount': 0}
				]
				for (var i = 0; $scope.expenses.length > i; i++) {
					var d = new Date($scope.expenses[i].date).getDay()
					var da = days_of_week[d]
					days_of_week[d].amount += Number($scope.expenses[i].amount)
				};

				days_of_week.sort(function (a, b) {
				    if (Number(a.amount) > Number(b.amount))
				      return 1;
				    if (Number(a.amount) < Number(b.amount))
				      return -1;
				    // a must be equal to b
				    return 0;
				});

				return days_of_week.reverse()[0].day
			}

			$scope.the_day = $scope.calcDays()

			// Just a test
			$scope.$on('forced', function() {
				$scope.the_day = $scope.calcDays()
			});
		}
	};
});

// App settings
expensesApp.directive('settings', ['$http', function($http) {
	return {
		restrict: 'A',
		link: function($scope, elem, attrs) {

			
			// Set used currency
			$scope.setOnEnter = function(key) {
				if (key.which == ENTER_KEY) {
					$http({
					    method: 'PUT',
					    url: 'set_currency',
					    data: {'currency': $scope.currency},
					})
					return false
				}
			}

			// Show or hide New category creation block
			$scope.toggleNcButton = function() {
				// When checked/unchecked set timeout to sync with server after 3s
				setTimeout(function() {
					$http({
					    method: 'PUT',
					    url: 'toggle_new_category_form',
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

		}
	}
}]);

expensesApp.directive('thisweekchart', function(){
	return {
		restrict: 'A',

		link: function($scope, elem, attrs) {

			// test func
			function calculateChart() {
				var date = new Date()
				var daystart = date.getDate() - 7
				var dayend = date.getDate()

				$scope.chart_data = []

				// Add dates of week with spent 0
				for (var i = daystart; i != dayend ; i++) {
					if (i >= 0) {
						$scope.chart_data.push({date: i+1, spent: 0})
					} else {
						$scope.chart_data.push({date: i, spent: 0})
					}
				};

				// Loop over the expenses
				// This can be simplified (to not loop 7 times over the array)
				for (var i = 0; $scope.chart_data.length > i; i++) {
					var date = new Date()
					for (var ii = 0; $scope.expenses.length > ii; ii++) {
						expense_date = new Date($scope.expenses[ii].date).getDate()
						if (expense_date == $scope.chart_data[i].date) {
							$scope.chart_data[i].spent = $scope.chart_data[i].spent + Number($scope.expenses[ii].amount)
						}
					};
				};
			}

			// Store chart parent
			var chart_wrap = elem[0]

			function drawChart() {

				// Copy
				var chart_data_clone = $scope.chart_data.slice()

				// Sort array copy by spent to get highest
				chart_data_clone.sort(function (a, b) {
				    if (Number(a.spent) > Number(b.spent))
				      return 1;
				    if (Number(a.spent) < Number(b.spent))
				      return -1;
				    // a must be equal to b
				    return 0;
				});

				// Get highest amount so we can scale the chart
				var highest = chart_data_clone.reverse()[0].spent * 1.5

				// A primitive way to remove the days under 1
				// (I think this works (and is useful) only when the month starts)
				del = 0
				for (var i = 0; $scope.chart_data.length > i; i++) {
					if ($scope.chart_data[i].date < 0) {
						del++
					}
				};
				$scope.chart_data.splice(0, del-1)

				// Get canvas and add width(based on parent - which width is based on % of wrapper) and height
				var canvasa = document.getElementById('the-graph')
				canvasa.width = chart_wrap.clientWidth
				canvasa.height = chart_wrap.clientHeight

				// Line length width based on the canvas width divided by 7 (days of week)
				var canvas_line_length = (chart_wrap.clientWidth / 7)

				var context = canvasa.getContext('2d');
				context.beginPath();

				for(var i = 1; i != 7; i++) {
					context.moveTo(0, (canvasa.clientHeight / 7)*i);
					context.lineTo(687, (canvasa.clientHeight / 7)*i);

					context.moveTo(canvas_line_length*i, 0);
					context.lineTo(canvas_line_length*i, canvasa.clientWidth);

					context.strokeStyle = '#E2E2E2'
					context.lineWidth = 0;
				}			
				context.stroke();

				// Init canvas and start drawing
				var context = canvasa.getContext('2d');
				context.beginPath();

				$scope.coords = []

				for (var i = 0; $scope.chart_data.length > i; i++) {

					// Percentage of the highest
					var y = $scope.chart_data[i].spent / highest * 100

					// percentage of 315
					y = (y / 100) * chart_wrap.clientHeight

					// 315 - y ( so that the lines starts from bottom)
					y = chart_wrap.clientHeight - y

					// If first then start and end on the same height
					if (i == 0) {
						starty = y
						endy = y
					}

					// Start line Y point from where the previous ended
					var starty = endy
					// End line Y point based on above calcs
					var endy = y

					// Start line based on that calc ex.(first: 86 * i(0) = 86,
					// second: 86*i(1) = 86, third: 86*i(2) = 172 and so on )
					var startx = canvas_line_length * i


					// Create line
					context.moveTo(startx, starty - 6);
					context.lineTo(canvas_line_length + startx, endy - 6);
					context.strokeStyle = '#81B71A'
					context.lineWidth = 2;
					context.stroke();

					console.log(centerX, centerY)

					// Create circle
					var centerX = canvas_line_length + startx
					var centerY = endy - 6
					var radius = 4;
					context.beginPath();
					context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
					context.fillStyle = '#81B71A';
					context.fill();
					context.lineWidth = 2;
					context.strokeStyle = '#81B71A';

					$scope.coords.push({'x': centerX, 'y': centerY, 'amount': $scope.chart_data[i].spent})
				}
				console.log($scope.coords)
				context.stroke();

			};
			
			var graph = document.getElementById('the-graph')
			var show_am = document.getElementById('showAm')

			graph.addEventListener('mousemove', showAmount)
			graph.addEventListener('click', showAmount)

			function showAmount(mouse) {

				for (var i = 0; $scope.coords.length > i; i++) {
					var mouseX = mouse.offsetX,
						mouseY = mouse.offsetY;

					if ( (mouseX < $scope.coords[i].x + 5 && mouseX > $scope.coords[i].x - 5) && (mouseY < $scope.coords[i].y + 5 && mouseY > $scope.coords[i].y - 5) ) {
						show_am.style.left = (mouseX - 20) + 'px'
						show_am.style.top = (mouseY - 50) + 'px'
						show_am.textContent = $scope.coords[i].amount.toFixed(2)
						show_am.style.opacity = 1
						break				
					}

					show_am.style.opacity = 0
				};
			};


			$scope.$on('draw', function() {
				graph.width = graph.width

				if ($scope.expenses.length > 0) {
					calculateChart()
					drawChart()
				}
			});
		}
	};
});