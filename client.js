// Bug : can't erase msg and lmsg in the same function (onchange) or need to identify the parent of this...


displayView = function() {
	
	if (localStorage.getItem("token") != null) {
		document.getElementById("content").innerHTML = document.getElementById("profileview").innerHTML;
		
		// Tab handling
		document.getElementById("home").onclick = tabHandlerHome;
		document.getElementById("browse").onclick = tabHandlerBrowse;
		document.getElementById("account").onclick = tabHandlerAccount;
		
		// Signout
		document.getElementById("signout").onclick = signOut;
	}
	else {
		document.getElementById("content").innerHTML = document.getElementById("welcomeview").innerHTML;
		var inputs = document.getElementsByTagName("input");
		for (var i = 0; i < inputs.length; i++)
			inputs.item(i).onchange = function() { document.getElementById("msg").innerHTML = ""; this.style.border = "2px inset"; };	
	}
};

window.onload = function() {
	
	displayView();
	
//	document.forms["signup"].onsubmit = signUp();
//	document.forms["login"].onsubmit = login();
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
	
	if(pwd.value != repwd.value) {
		pwd.value = repwd.value = "";
		err = true;
	}
	
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
		
		if (!result.success) {
		
			document.forms["signup"]["email"].style.border = "2px inset red";
			document.getElementById("msg").style.color = "red";
			document.getElementById("msg").innerHTML = result.message;
			
		} else {
		
			document.getElementById("msg").style.color = "green";
			document.getElementById("msg").innerHTML = result.message;
			
			var fields = document.forms["signup"].getElementsByTagName("input");
			for (var i = 0; i < fields.length; i++) 
				fields.item(i).value = "";
		}
	}
};

function login() {

	var email = document.forms["login"]["lemail"];
	var password = document.forms["login"]["lpwd"];
	
	if (!email.value) email.style.border = "2px inset red";
	if (!password.value) password.style.border = "2px inset red";
	
	if (email.value && password.value) {
	
		var result = serverstub.signIn(email.value, password.value);
	
		if (!result.success) {
			email.style.border = "2px inset red";
			password.style.border = "2px inset red";
			document.getElementById("lmsg").style.color = "red";
			document.getElementById("lmsg").innerHTML = result.message;
		} else {
			localStorage.setItem("token", JSON.stringify(result.data));
			displayView();
		}
	}
};

function tabHandlerHome() { tabHandler("home"); };
function tabHandlerBrowse() { tabHandler("browse"); };
function tabHandlerAccount() { tabHandler("account"); };

function tabHandler(tab) { 
			console.log("tabHandler : " + tab);
			var buttons = document.getElementById("tabBar").getElementsByTagName("a");
			for(var i = 0; i < buttons.length; i++)
				buttons.item(i).className = "";
			
			document.getElementById("homePanel").style.display = "none";
			document.getElementById("browsePanel").style.display = "none";
			document.getElementById("accountPanel").style.display = "none";
			
			document.getElementById(tab).className="selected";
			document.getElementById(tab + "Panel").style.display = "block";
};

function signOut() {
	
	serverstub.signOut(localStorage.getItem("token"));
	localStorage.removeItem("token");
	displayView();
};
