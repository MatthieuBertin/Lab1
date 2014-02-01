// Bug : can't erase msg and lmsg in the same function (onchange) or need to identify the parent of this...

displayView = function () {

	if (localStorage.getItem("token") !== null) {
		document.getElementById("content").innerHTML = document.getElementById("profileview").innerHTML;

		// Tab handling
		document.getElementById("home").onclick = tabHandlerHome;
		document.getElementById("browse").onclick = tabHandlerBrowse;
		document.getElementById("account").onclick = tabHandlerAccount;
		
		// Signout
		document.getElementById("signout").onclick = signOut;
		
		// Home
		document.getElementById("name").onclick = dataVisibility;
		document.forms["postForm"]["msg"].onfocus = function() { 
			console.log("ONFOCUS "+document.forms["postForm"]["msg"].value);
			if(document.forms["postForm"]["msg"].value == "Post a message on your wall (max 150 char.)")
				document.forms["postForm"]["msg"].value = "";
			document.forms["postForm"]["msg"].style.border = "";
		}
		document.forms["postForm"]["msg"].onblur = function() { 
		console.log("ONBLUR "+document.forms["postForm"]["msg"].value);
			if(!document.forms["postForm"]["msg"].value)
				document.forms["postForm"]["msg"].value = "Post a message on your wall (max 150 char.)";
		}
		
		var data = true;
		
		loadData();
		loadWall();
	}
	else {
		document.getElementById("content").innerHTML = document.getElementById("welcomeview").innerHTML;
		var inputs = document.getElementsByTagName("input");
		for (var i = 0; i < inputs.length; i++)
			inputs.item(i).onkeypress = function() { document.getElementById("msg").innerHTML = ""; this.style.border = "2px inset"; };	
	}
};

window.onload = function() {
	displayView();
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
	
	if(pwd.value !== repwd.value) {
		pwd.value = repwd.value = "";
		pwd.style.border = "2px inset red";
		repwd.style.border = "2px inset red";
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
			document.getElementById("msg").style.fontSize = "10px";
			document.getElementById("msg").innerHTML = result.message;
			
		} else {
		
			document.getElementById("msg").style.color = "green";
			document.getElementById("msg").style.fontSize = "10px";
			document.getElementById("msg").innerHTML = result.message;
			
			var fields = document.forms["signup"].getElementsByTagName("input");
			for (var i = 0; i < fields.length-1; i++)
				fields.item(i).value = "";
		}
	}
};

function login() {

	var email = document.forms["login"]["lemail"];
	var password = document.forms["login"]["lpwd"];
	
	if (!email.value) email.style.border = "2px inset red ";
	if (!password.value) password.style.border = "2px inset red";
	
	if (email.value && password.value) {
	
		var result = serverstub.signIn(email.value, password.value);
	
		if (!result.success) {
			email.style.border = "2px inset red";
			password.style.border = "2px inset red";
			document.getElementById("lmsg").style.color = "red";
			document.getElementById("lmsg").style.fontSize = "10px";
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
	
	serverstub.signOut(JSON.parse(localStorage.getItem("token")));
	localStorage.removeItem("token");
	displayView();
};

function dataVisibility() {
	console.log("test");
	if(data)
		document.getElementById("data").style.display = "none";
	else
		document.getElementById("data").style.display = "block";
		
	data = !data;
};

function loadWall() {
	var token = JSON.parse(localStorage.getItem("token"));
	var messages = serverstub.getUserMessagesByToken(token).data;
	var html = "";
	
	if (messages.length > 0)
	for (var i = 0; i < messages.length; i++)
		html += '<li><span class="author">' + messages[i].writer+ ' </span>' + messages[i].content + '</li>';
	else
		html = "<li> No messages </li>";
		
	document.getElementById("wall").innerHTML = html;	
};

function loadData() {
	var token = JSON.parse(localStorage.getItem("token"));
	var data = serverstub.getUserDataByToken(token).data;
	console.log(data);
	document.getElementById("name").innerHTML = data.firstname + ' ' + data.familyname;
	
	var content = '<li>Gender: ' + data.gender + '</li><li>City, Country: ' + data.city + ', ' + data.country + '</li><li>Email: ' + data.email + '</li>';
	console.log(content);
	document.getElementById("data").innerHTML = content;
};

function postMessage() {
	
	var content = document.forms["postForm"]["msg"].value.trim();
	
	if(content && content !== "Post a message on your wall (max 150 char.)") {
		var token = JSON.parse(localStorage.getItem("token"));
		var toEmail = serverstub.tokenToEmail(token);
		serverstub.postMessage(token, content, toEmail);
		document.forms["postForm"]["msg"].value = "Post a message on your wall (max 150 char.)";
		loadWall();
	} else
		document.forms["postForm"]["msg"].style.border = "2px inset red";
};

function postMessageOnView() {
	
	var content = document.forms["vPostForm"]["vMsg"].value.trim();
	
	if(content && content !== "Post a message on the wall (max 150 char.)") {
		var token = JSON.parse(localStorage.getItem("token"));
		var toEmail = serverstub.tokenToEmail(viewToken);
		serverstub.postMessage(token, content, toEmail);
		document.forms["vPostForm"]["vMsg"].value = "Post a message on the wall (max 150 char.)";
		loadViewedWall();
	} else
		document.forms["vPostForm"]["vMsg"].style.border = "2px inset red";
};

function searchUser() {

	var search = document.forms["searchForm"]["search"].value.trim();
	var token = JSON.parse(localStorage.getItem("token"));

	var user = serverstub.getUserDataByEmail(token, search);

	if(user.success) {
		
		user = user.data;

		document.getElementById("vName").innerHTML = user.firstname + ' ' + user.familyname;
		var content = '<li>Gender: ' + user.gender + '</li><li>City, Country: ' + user.city + ', ' + user.country + '</li><li>Email: ' + user.email + '</li>';
		document.getElementById("vData").innerHTML = content;
		
		document.getElementById("vInfo").style.display = "block";
	
		var messages = serverstub.getUserMessagesByEmail(token, search);

		if(messages.success) {
			messages = messages.data;
			var html = "";
			
			if (messages.length > 0)
			for (var i = 0; i < messages.length; i++)
				html += '<li><span class="author">' + messages[i].writer+ ' </span>' + messages[i].content + '</li>';
			else
				html = "<li> No messages </li>";
				
			document.getElementById("vWall").innerHTML = html;	
			document.getElementById("vWall").style.display = "block";
		}
	}
	else {
		document.getElementById("vWall").style.display = "none";
		document.getElementById("vInfo").style.display = "none";
	}
};
