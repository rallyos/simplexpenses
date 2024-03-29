var signUpForm = document.getElementsByClassName('signup-form')[0]
var signInForm = document.getElementsByClassName('signin-form')[0]
var FPForm = document.getElementsByClassName('recover-pass-form')[0]
var rpb = document.getElementsByClassName('recover-pass-block')[0]

signUpForm.onsubmit = function() {

	// Store the elements
	csrfmiddlewaretoken = signUpForm.children[0].value;
	user = signUpForm.children[1].value;
	pass = signUpForm.children[2].value;
	confirmPass = signUpForm.children[3].value;

	var xhr = new XMLHttpRequest()
	xhr.open('POST', 'register_user');
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	xhr.send('csrfmiddlewaretoken=' + encodeURIComponent(csrfmiddlewaretoken) +
	'&username=' + encodeURIComponent(user) +
	'&password1=' + encodeURIComponent(pass) +
	'&password2=' + encodeURIComponent(confirmPass))

	signUpForm.children[4].style.background = '#90E06F'
	document.getElementsByClassName('signup-animation')[0].className = 'signup-animation signup-animation-show'
	signUpForm.children[4].value = ''

	xhr.onreadystatechange = function() {
		if ( xhr.status == 200) {
			location.reload()
		} else if ( xhr.status ==  403) {
			document.getElementsByClassName('signup-animation')[0].className = 'signup-animation'
			signUpForm.children[4].value = 'Sign me up'
		}
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
	'&password=' + encodeURIComponent(pass));
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	xhr.send()
	signInForm.children[4].style.background = '#3E96FF'
	document.getElementsByClassName('signin-animation')[0].className = 'signin-animation signin-animation-show'
	signInForm.children[4].value = ''

	xhr.onreadystatechange = function() {
		if ( xhr.status == 200) {
			signInForm.children[4].style.background = '#90E06F'
			location.reload()
		} else if ( xhr.status == 404) {
			signInForm.children[2].style.borderColor = '#E4794C'
			signInForm.children[1].style.borderColor = '#E4794C'
			signInForm.children[4].style.background = '#92C6FF'
			signInForm.children[4].value = 'Sign in'
			document.getElementsByClassName('signin-animation')[0].className = 'signin-animation'
			var fl = document.getElementsByClassName('forgotten-password')[0]
			fl.style.display = 'block'
			fl.addEventListener('click', showPassRecoverBox)
		};
	}

	return false;
}

function showPassRecoverBox() {
	rpb.style.display = 'block'
	var rpi = document.getElementById('recover-pass')
	rpi.value = signInForm.children[1].value;

	setTimeout(function() {
		rpb.style.opacity = 1
		rpb.style.webkitTransform = 'translateY(50px)'
	}, 100)

	document.getElementById('recover-pass-close').addEventListener('click',function() {
		rpb.style.opacity = 0
		rpb.style.webkitTransform = 'translateY(0)'
		setTimeout(function() {
			rpb.style.display = 'none'
		}, 300)
	});
}

FPForm.onsubmit = function() {
	csrfmiddlewaretoken = FPForm.children[0].value;
	user = document.getElementById('recover-pass').value;

	var xhr = new XMLHttpRequest()
	xhr.open('POST', 'forgotten_password?');
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	xhr.send('csrfmiddlewaretoken=' + encodeURIComponent(csrfmiddlewaretoken) + '&username=' + encodeURIComponent(user))

	xhr.onreadystatechange = function() {
		if ( xhr.status == 200) {

			document.getElementsByClassName('recover-pass-heading')[0].textContent = 'Thank you! Check your email for a message.'
			document.getElementsByClassName('recover-pass-heading')[0].style.color = '#90E06F'

			setTimeout(function() {
				rpb.style.opacity = 0
				FPForm.children[1].backgroundColor = '#90E06F'
				rpb.style.webkitTransform = 'translateY(0)'
			}, 3000)

			setTimeout(function() {
				rpb.style.display = 'none'
			}, 3400)
		} else if ( xhr.status == 404) {
			FPForm.children[1].value = 'User not found'
		}
	}

	return false;
}