
'use strict'

window.addEventListener('load', function() {
    FastClick.attach(document.body);
}, false);

function getCookie (sKey) {
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
}  

var csrftoken = getCookie('csrftoken')

var ENTER_KEY = 13;

// Preload image
var tick = new Image()
tick.src = 'https://simplexpenses.herokuapp.com/static/img/rt.png'

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

if (getCookie('show_tooltips') == 'true') {
	var tooltip_cookie = true
}
