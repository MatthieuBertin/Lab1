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




var signup = function(formData) {

	var msg = "";
	
	if (!formData.firstname.value) {
		document.getElementById("firstname").style.border = "2px inset red";
		
		
		//&& formData.familyname.value && formData.gender.value && formData.city.value && formData.country.value 
		//&& formData.email.value && formData.pwd.value && formData.repwd.value)
		
		if(formData.pwd.value == formData.repwd.value)
			console.log("all work");
		else
			msg = "Different password";
	}	
	else 
		msg = "There is an empty field";
		
	document.getElementById("msg").innerHTML = msg;
};

var login = function(formData) {

	var msg = "";
	if (formData.lemail.value && formData.lpwd) 
		console.log("all work");
	else
		msg = "There is an empty field";
	
	document.getElementById("lmsg").innerHTML = msg;
};
