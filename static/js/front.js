var signUpForm = document.getElementsByClassName('signup-form')[0]
var signInForm = document.getElementsByClassName('signin-form')[0]

signUpForm.onsubmit = function() {

	// Store the elements
	csrfmiddlewaretoken = signUpForm.children[0].value;
	user = signUpForm.children[1].value;
	pass = signUpForm.children[2].value;
	confirmPass = signUpForm.children[3].value;

	var xhr = new XMLHttpRequest()
	xhr.open('POST', 'register_user', false);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	xhr.send('csrfmiddlewaretoken=' + encodeURIComponent(csrfmiddlewaretoken) +
	'&username=' + encodeURIComponent(user) +
	'&password1=' + encodeURIComponent(pass) +
	'&password2=' + encodeURIComponent(confirmPass))

	if ( xhr.status == 200) {
		location.reload()
	} else if ( xhr.status ==  403) {

	}

	return false;
}

signInForm.onsubmit = function() {

	csrfmiddlewaretoken = signInForm.children[0].value;
	user = signInForm.children[1].value;
	pass = signInForm.children[2].value;

	var xhr = new XMLHttpRequest()
	xhr.open('GET', 'login_user?' + 'csrfmiddlewaretoken=' + encodeURIComponent(csrfmiddlewaretoken) +
	'&username=' + encodeURIComponent(user) +
	'&password=' + encodeURIComponent(pass), false);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	xhr.send()

	if ( xhr.status == 200) {
		location.reload()
	} else if ( xhr.status == 404) {

	};

	return false;
}