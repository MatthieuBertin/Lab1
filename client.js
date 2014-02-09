// Bug : can't erase msg and lmsg in the same function (onchange) or need to identify the parent of this...
// null js
// !==

var token = null;
var userMail = null;
var dataVisible = true;
		
displayView = function () {

	token = JSON.parse(localStorage.getItem("token"));
	if (token != null) {
		profileView();
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

// ##### WELCOME VIEW #####
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

// ##### PROFILE VIEW #####
function profileView() {
		
		document.getElementById("content").innerHTML = document.getElementById("profileview").innerHTML;
	
		// Tab handling
		document.getElementById("home").onclick = selectHome;
		document.getElementById("browse").onclick = selectBrowse;
		document.getElementById("account").onclick = selectAccount;
		
		// Signout
		document.getElementById("signout").onclick = signOut;
		
		selectHome();
		
};

/* Tab Selector */
function selectHome() { 

	document.getElementById("userWallView").innerHTML = "";
	document.getElementById("homePanel").innerHTML = document.getElementById("wallView").innerHTML;
	
	select("home");
	userMail =  null;
	loadWallView();
};

function selectBrowse() { 
	document.getElementById("userWallView").style.display="none";
	document.getElementById("homePanel").innerHTML = "";
	document.getElementById("userWallView").innerHTML = document.getElementById("wallView").innerHTML;
	select("browse"); 
};

function selectAccount() { select("account"); };

function select(tab) { 
	
	var buttons = document.getElementById("tabBar").getElementsByTagName("a");
	for(var i = 0; i < buttons.length; i++)
		buttons.item(i).className = "";
			
	document.getElementById("homePanel").style.display = "none";
	document.getElementById("browsePanel").style.display = "none";
	document.getElementById("accountPanel").style.display = "none";
	
	document.getElementById(tab).className = "selected";
	document.getElementById(tab + "Panel").style.display = "block";
};

function signOut() {
	
	serverstub.signOut(JSON.parse(localStorage.getItem("token")));
	localStorage.removeItem("token");
	displayView();
};

function changePwd() {
	
	console.log("switch");
	
	var oldPwd = document.forms["pwdForm"]["oldPwd"].value;
	var newPwd = document.forms["pwdForm"]["newPwd"].value;
	var reNewPwd = document.forms["pwdForm"]["reNewPwd"].value;
	
	var result = document.getElementById("result");
	
	result.style.color = "red";
	if (!oldPwd || !newPwd || !reNewPwd)
		result.innerHTML = "Empty fields";
	else if (newPwd != reNewPwd) {
		result.innerHTML = "Differents passwords";
		newPwd = reNewPwd = '';
	} else {
		result.innerHTML = "success";
		result.style.color = "green";
	}
	
	
}	

function dataVisibility() {
	document.getElementById("userData").style.display = (dataVisible) ? "block" : "none";
	dataVisible = !dataVisible;
};

function loadWallView() {

	document.getElementById("userName").onclick = dataVisibility;
		
	postFormDefautMsg = "Your message here (max 150 char.)";
	document.forms["postForm"]["msg"].onfocus = function() { 
	if(document.forms["postForm"]["msg"].value == postFormDefautMsg)
		document.forms["postForm"]["msg"].value = "";
		document.forms["postForm"]["msg"].style.border = "";
	}
	document.forms["postForm"]["msg"].onblur = function() {
		if(!document.forms["postForm"]["msg"].value)
			document.forms["postForm"]["msg"].value = postFormDefautMsg;
	}
	document.forms["postForm"]["msg"].value = postFormDefautMsg;

	/* null */
	/***** Load Wall *****/
	var messages = (userMail != null) ? serverstub.getUserMessagesByEmail(token, userMail).data : serverstub.getUserMessagesByToken(token).data;
	
	var html = "";
	if (messages.length > 0)
		for (var i = 0; i < messages.length; i++)
			html += '<li><span class="author">' + messages[i].writer+ ' </span>' + messages[i].content + '</li>';
	else
		html = "<li> No messages </li>";	
	document.getElementById("userWall").innerHTML = html;	
	
	/***** Load Data *****/
	var data = (userMail != null) ? serverstub.getUserDataByEmail(token, userMail).data : serverstub.getUserDataByToken(token).data;
	
	document.getElementById("userName").innerHTML = data.firstname + ' ' + data.familyname;
	var content = '<li>Gender: ' + data.gender + '</li><li>City, Country: ' + data.city + ', ' + data.country + '</li><li>Email: ' + data.email + '</li>';
	document.getElementById("userData").innerHTML = content;
};

function postMessage() {
	
	var content = document.forms["postForm"]["msg"].value.trim();
	
	if(content && content != postFormDefautMsg) {
		var toEmail = (userMail != null) ? userMail : serverstub.tokenToEmail(token);
		serverstub.postMessage(token, content, toEmail);
		document.forms["postForm"]["msg"].value = postFormDefautMsg;
		loadWallView();
	} else
		document.forms["postForm"]["msg"].style.border = "2px inset red";
};

function searchUser() {

	var search = document.forms["searchForm"]["search"].value.trim();
	var searchResult = serverstub.getUserDataByEmail(token, search);
	console.log(searchResult);
	
	if(searchResult.success) {
		userMail = searchResult.data.email;
		document.getElementById("userWallView").style.display = "block";
		dataVisible = true;
		dataVisibility();
		loadWallView();
	} else {
		document.getElementById("userWallView").style.display =  "none";
	}
};
