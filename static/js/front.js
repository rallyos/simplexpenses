var signUpForm = document.getElementsByClassName('signup-form')[0]
var signInForm = document.getElementsByClassName('signin-form')[0]

signUpForm.onsubmit = function() {

	// Store the elements
	csrfmiddlewaretoken = document.getElementsByName('csrfmiddlewaretoken')[1].value;
	user = document.getElementById('reg-user').value;
	pass = document.getElementById('reg-pass').value;
	confirmPass = document.getElementById('reg-confirm-pass').value;

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
	xhr.open('GET', 'login?' + 'csrfmiddlewaretoken=' + encodeURIComponent(csrfmiddlewaretoken) +
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