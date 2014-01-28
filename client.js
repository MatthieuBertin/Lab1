displayView = function() {

};

window.onload = function() {
	document.getElementById("content").innerHTML = document.getElementById("welcomeview").innerHTML;
	var inputs = document.getElementsByTagName("input");
	var i;
	console.log(inputs.length);
	for (i = 0; i < inputs.length; i++) {
		console.log("lol");
		inputs.item(i).onchange = function() { console.log("ok"); this.style.border = "2px inset"; };
	}
	
};




function signUp() {

	var err = false;
	
	// Check empty fields
	var fields = document.forms["signup"].getElementsByTagName("input");
	for (var i = 0; i < fields.length; i++) 
		if (!fields.item(i).value) {
			fields.item(i).style.border = "2px inset red";
			err = true;
		}
	
	// Check passwords
	var pwd = document.forms["signup"]["pwd"];
	var repwd = document.forms["signup"]["repwd"];
	
	if(err = pwd.value != repwd.value) 
		pwd.value = repwd.value = "";

	
	if(!err) {		
		var user = new Object();
		user.email = document.forms["signup"]["email"].value;
		user.password = document.forms["signup"]["pwd"].value;
		user.firstname = document.forms["signup"]["firstname"].value;
		user.familyname = document.forms["signup"]["familyname"].value;
		user.gender = document.forms["signup"]["gender"].value;
		user.city = document.forms["signup"]["city"].value;
		user.country = document.forms["signup"]["country"].value;
		
		
		var result = serverstub.signUp(user);
		console.log(result);
		if (!result.success) {
		console.log("foiré");
			document.forms["signup"]["email"].style.border = "2px inset red";
			document.getElementById("msg").style.color = "red";
			document.getElementById("msg").innerHTML = result.message;
		} else {
		console.log("ok");
	/*		document.getElementById("msg").style.color = green;
			document.getElementById("msg").innerHTML = result.message;
			
			var fields = document.forms["signup"].getElementsByTagName("input");
			for (var i = 0; i < fields.length; i++) 
				fields.item(i).value = "";*/
		}
	}
};

var login = function(formData) {

	var msg = "";
	if (formData.lemail.value && formData.lpwd) 
		console.log("all work");
	else
		msg = "There is an empty field";
	
	document.getElementById("lmsg").innerHTML = msg;
};
