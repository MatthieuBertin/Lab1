var token = null;
var userMail = null;
var dataVisible = true;

displayView = function () {
  
  token = JSON.parse(localStorage.getItem("token"));
  if (token !== null) {
    profileView();
  }
  else {
    document.getElementById("content").innerHTML = document.getElementById("welcomeview").innerHTML;
    var inputs = document.getElementsByTagName("input");
    for (var i = 0; i < inputs.length; i++)
    {
      inputs.item(i).onkeypress = function() {this.style.border = "2px inset"; document.getElementById("msg").innerHTML = ""; document.getElementById("lmsg").innerHTML = ""; };
    }
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
  {
    if (!fields.item(i).value) {
      fields.item(i).style.border = "2px inset red";
      err = true;
    }
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
    
    
    xmlhttp_signup=new XMLHttpRequest()
    xmlhttp_signup.onreadystatechange=function() {
      if (xmlhttp_signup.readyState==4 && xmlhttp_signup.status==200)
      {
	var result=xmlhttp_signup.responseText;

	
	try {
	  var newres = JSON.parse(result);

	  
	} catch (e) {
	  console.error("Parsing error:", e); 
	}
	//Error handling sign up field
	if (!newres.success) {
	  document.forms["signup"]["email"].style.border = "2px inset red";
	  document.getElementById("msg").style.color = "red";
	  document.getElementById("msg").style.fontSize = "10px";
	  document.getElementById("msg").innerHTML = newres.message;
	  
	} else {
	  
	  document.getElementById("msg").style.color = "green";
	  document.getElementById("msg").style.fontSize = "10px";
	  document.getElementById("msg").innerHTML = newres.message;
	  
	  var fieldsignup = document.forms["signup"].getElementsByTagName("input");
	  for (var i = 0; i < fieldsignup.length-1; i++)
	    fieldsignup.item(i).value = "";
	}
      }
    }
    xmlhttp_signup.open("POST","http://localhost:5000/sign_up/", true);
    xmlhttp_signup.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp_signup.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    var para="email="+user.email+"&password="+user.password+"&firstname="+user.firstname+"&familyname="+user.familyname+"&gender="+user.gender+"&city="+user.city+"&country="+user.country;
    xmlhttp_signup.send(para);
    
  }
}


function login() {
  
  var email = document.forms["login"]["lemail"];
  var password = document.forms["login"]["lpwd"];
  
  //Error handling login field
  if (!email.value) email.style.border = "2px inset red ";
  if (!password.value) password.style.border = "2px inset red";
  
  if (email.value && password.value) {
    
    //var result = serverstub.signIn(email.value, password.value);
    
    xmlhttp_login=new XMLHttpRequest()
    xmlhttp_login.onreadystatechange=function() {
      if (xmlhttp_login.readyState==4 && xmlhttp_login.status==200)
      {
	var result=xmlhttp_login.responseText;

	try {
	  var newres = JSON.parse(result);

	  
	} catch (e) {
	  console.error("Parsing error:", e); 
	}
	
	
	if (!newres.success) {
	  email.style.border = "2px inset red";
	  password.style.border = "2px inset red";
	  document.getElementById("lmsg").style.color = "red";
	  document.getElementById("lmsg").style.fontSize = "10px";
	  document.getElementById("lmsg").innerHTML = newres.message;
	} else {
	  localStorage.setItem("token", JSON.stringify(newres.data));
	  displayView();
	}
      }
    }
    xmlhttp_login.open("POST","http://localhost:5000/sign_in/", true);
    xmlhttp_login.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp_login.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    var para="email="+email.value+"&password="+password.value;
    xmlhttp_login.send(para);
    
  }
}

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
  
}

/* Tab Selector */
function selectHome() { 
  
  document.getElementById("userWallView").innerHTML = "";
  document.getElementById("homePanel").innerHTML = document.getElementById("wallView").innerHTML;
  
  select("home");
  userMail =  null;
  
  loadWallView();
}

function selectBrowse() { 
  document.getElementById("userWallView").style.display="none";
  document.getElementById("homePanel").innerHTML = "";
  document.getElementById("userWallView").innerHTML = document.getElementById("wallView").innerHTML;
  select("browse"); 
}

function selectAccount() { select("account"); }

function select(tab) { 
  
  var buttons = document.getElementById("tabBar").getElementsByTagName("a");
  for(var i = 0; i < buttons.length; i++)
    buttons.item(i).className = "";
  
  document.getElementById("homePanel").style.display = "none";
  document.getElementById("browsePanel").style.display = "none";
  document.getElementById("accountPanel").style.display = "none";
  
  document.getElementById(tab).className = "selected";
  document.getElementById(tab + "Panel").style.display = "block";
}

function signOut() {
  
  xmlhttp_signout=new XMLHttpRequest()
  xmlhttp_signout.onreadystatechange=function() {
    if (xmlhttp_signout.readyState==4 && xmlhttp_signout.status==200)
    {
      var result=xmlhttp_signout.responseText;

      try {
	var newres = JSON.parse(result);
	
      } catch (e) {
	console.error("Parsing error:", e); 
      }
    }
    
  }
  xmlhttp_signout.open("GET","http://localhost:5000/sign_out/"+JSON.parse(localStorage.getItem("token")), true);
  xmlhttp_signout.send();
  localStorage.removeItem("token");
  
  displayView();
}

function changePwd() { 
  var oldPwd = document.forms["pwdForm"]["oldPwd"].value;
  var newPwd = document.forms["pwdForm"]["newPwd"].value;
  var reNewPwd = document.forms["pwdForm"]["reNewPwd"].value;  
  var result = document.getElementById("result");  
  
  //Check if input for Pwd change correct
  result.style.color = "red";
  if (!oldPwd || !newPwd || !reNewPwd)
    result.innerHTML = "Empty fields";
  else if (newPwd != reNewPwd) {
    result.innerHTML = "Different passwords";
    document.forms["pwdForm"]["newPwd"].value = '';
    document.forms["pwdForm"]["reNewPwd"].value = '';
  }
  else if (newPwd === oldPwd) {
    result.innerHTML = "New password needed";
    document.forms["pwdForm"]["newPwd"].value = '';
    document.forms["pwdForm"]["reNewPwd"].value = '';
  }
  else {
    // var res = serverstub.changePassword(token, oldPwd, newPwd);
    xmlhttp_pw=new XMLHttpRequest()
    xmlhttp_pw.onreadystatechange=function() {
      if (xmlhttp_pw.readyState==4 && xmlhttp_pw.status==200)
      {
	var resulttext=xmlhttp_pw.responseText;
	try {
	  var res = JSON.parse(resulttext);
	  
	} catch (e) {
	  console.error("Parsing error:", e); 
	}
	
	
	
	if (!res.success)
	  result.innerHTML = res.message;
	else {
	  result.innerHTML = "Success";
	  result.style.color = "green";
	  document.forms["pwdForm"]["newPwd"].value = '';
	  document.forms["pwdForm"]["reNewPwd"].value = '';
	  document.forms["pwdForm"]["oldPwd"].value = '';
	}
      }
    }
    xmlhttp_pw.open("POST","http://localhost:5000/change_password/", true);
    xmlhttp_pw.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp_pw.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    var para="token="+token+"&old_password="+oldPwd+"&new_password="+newPwd;
    xmlhttp_pw.send(para);
  }
}

//Hide user information
function dataVisibility() {
  document.getElementById("userData").style.display = (dataVisible) ? "block" : "none";
  dataVisible = !dataVisible;
}

function loadWallView() {
  
  
  
  document.getElementById("userName").onclick = dataVisibility;
//  document.getElementById("refreshButton").onclick = loadWallView;
  
  postFormDefautMsg = "Your message here (max 150 char.)";
  document.forms["postForm"]["msg"].onfocus = function() { 
    if(document.forms["postForm"]["msg"].value == postFormDefautMsg)
    {
      document.forms["postForm"]["msg"].value = "";
      document.forms["postForm"]["msg"].style.border = "";
    }
  };
  
  document.forms["postForm"]["msg"].onblur = function() {
    if(!document.forms["postForm"]["msg"].value)
    {
      document.forms["postForm"]["msg"].value = postFormDefautMsg;
    }
  };
  document.forms["postForm"]["msg"].value = postFormDefautMsg;
  
  /* null */
  /***** Load Wall *****/
  
  
  
  if (userMail !== null) 
  {
    // var xmlhttp_data3= xmlreqUserdata();
    console.log("Op "+userMail);
    loadWallEmail(userMail);
    
  }
  
  
  else {
    var xmlhttp_data3=new XMLHttpRequest()
    xmlhttp_data3.onreadystatechange=function() {
      if (xmlhttp_data3.readyState==4 && xmlhttp_data3.status==200)
      {
	var result=xmlhttp_data3.responseText;
	try {
	  var newres = JSON.parse(result);
	  var data =  newres.data;
	  console.log("t  "+data[0]);
	  loadWallEmail(data[0]);
	  
	} catch (e) {
	  console.error("Parsing error:", e); 
	}
      }
      
    }
    xmlhttp_data3.open("GET","http://localhost:5000/get_user_data_by_token/"+token, true);
    xmlhttp_data3.send();
    
  }
  
  
  
  
  /***** Load Data *****/
  
  if(userMail !== null)
  {
    var xmlhttp_data1= xmlreqUserdata();
    xmlhttp_data1.open("GET","http://localhost:5000/get_user_data_by_email/"+token+"/"+userMail, true);
    xmlhttp_data1.send();
    
  }
  else {
    var xmlhttp_data2= xmlreqUserdata();
    xmlhttp_data2.open("GET","http://localhost:5000/get_user_data_by_token/"+token, true);
    xmlhttp_data2.send();    
  }
  
}

function xmlreqGetMessages ()
  {
    var xmlhttp_wall1=new XMLHttpRequest()
    xmlhttp_wall1.onreadystatechange=function() {
      if (xmlhttp_wall1.readyState==4 && xmlhttp_wall1.status==200)
      {
	var result=xmlhttp_wall1.responseText;

	try {
	  var newres = JSON.parse(result);
	  var messages =  newres.data;
	  var html = "";
	  
	  if (messages.length > 0) {
	    for (var i = 0; i < messages.length; i++) {  
	      //Check for words longer than 40characters and split them
	      if (messages[i][1].length >= 40) {
		var parts = messages[i][1].split(' ');
		html += '<li><span class="author">' + messages[i][0]+ ' </span>';
		for (var a = 0; a < parts.length; a++) {
		  if (parts[a].length >=40) {
		    var splits = parts[a].match(/.{1,40}/g);
		    for (var b = 0; b < splits.length; b++)
		      html += splits[b] + ' ';
		  }		
		  else 
		    html += parts[a]+ ' ';
		}
		html += '</li>';
	      }
	      else
		html += '<li><span class="author">' + messages[i][0]+ ' </span>' + messages[i][1] + '</li>';
	    }
	  }
	  else
	    html = "<li> No messages </li>";	
	  document.getElementById("userWall").innerHTML = html;	
	  
	} catch (e) {
	  console.error("Parsing error:", e); 
	}
      }
      
    }
    return xmlhttp_wall1;
  }

function xmlreqUserdata() {
  var xmlhttp_data1=new XMLHttpRequest()
  xmlhttp_data1.onreadystatechange=function() {
    if (xmlhttp_data1.readyState==4 && xmlhttp_data1.status==200)
    {
      var result=xmlhttp_data1.responseText;

      try {
	var newres = JSON.parse(result);
	var data =  newres.data;
	document.getElementById("userName").innerHTML = data[1] + ' ' + data[2];
	var content = '<li>Gender: ' + data[3] + '</li><li>City, Country: ' + data[4] + ', ' + data[5] + '</li><li>Email: ' + data[0] + '</li>';
	document.getElementById("userData").innerHTML = content;
	//PROBLEM with connection.send results in Parsing error
	//connection.send(data[0]);
	
      } catch (e) {
	console.error("Parsing error:", e); 
      }
    }
    
  }
  return xmlhttp_data1;
}

//FIX CODE IN SEPERATE FUNCTION
function postMessage() {
  
  var content = document.forms["postForm"]["msg"].value.trim();
  
  if(content && content != postFormDefautMsg) {
    
    var toEmail
    if (userMail !== null) {
      toEmail = userMail;
      xmlhttp_post3=new XMLHttpRequest()
      xmlhttp_post3.onreadystatechange=function() {
	if (xmlhttp_post3.readyState==4 && xmlhttp_post3.status==200)
	{
	  var result=xmlhttp_post3.responseText;
	  try {
	    var newres = JSON.parse(result);
	    var success =  newres;
	    
	  } catch (e) {
	    console.error("Parsing error:", e); 
	  }
	}
	
      }
      console.log("user before send:"+toEmail); //Socket is dead ...
      xmlhttp_post3.open("GET","http://localhost:5000/post_message/"+token+"/"+content+"/"+toEmail, true);
      xmlhttp_post3.send();
      
    }
    else {
      xmlhttp_post1=new XMLHttpRequest()
      xmlhttp_post1.onreadystatechange=function() {
	if (xmlhttp_post1.readyState==4 && xmlhttp_post1.status==200)
	{
	  var result=xmlhttp_post1.responseText;
	  try {
	    var newres = JSON.parse(result);
	    toEmail =  newres.data[0];
	    
	  } catch (e) {
	    console.error("Parsing error:", e); 
	  }
	  xmlhttp_post2=new XMLHttpRequest()
	  xmlhttp_post2.onreadystatechange=function() {
	    if (xmlhttp_post2.readyState==4 && xmlhttp_post2.status==200)
	    {
	      var result=xmlhttp_post2.responseText;
	      try {
		var newres = JSON.parse(result);
		var success =  newres;
		loadWallView();
	      } catch (e) {
		console.error("Parsing error:", e); 
	      }
	    }
	    
	  }
	  console.log("user before send:"+toEmail); //Socket is dead ...
	  xmlhttp_post2.open("GET","http://localhost:5000/post_message/"+token+"/"+content+"/"+toEmail, true);
	  xmlhttp_post2.send();
	}
	
      }
      xmlhttp_post1.open("GET","http://localhost:5000/get_user_data_by_token/"+token, true);
      xmlhttp_post1.send();
    }
    
    
    
    document.forms["postForm"]["msg"].value = postFormDefautMsg;
    loadWallView();
  } else
    document.forms["postForm"]["msg"].style.border = "2px inset red";
}

function searchUser() {
  
  var search = document.forms["searchForm"]["search"].value.trim();
  
  xmlhttp_search=new XMLHttpRequest()
  xmlhttp_search.onreadystatechange=function() {
    if (xmlhttp_search.readyState==4 && xmlhttp_search.status==200)
    {
      var result=xmlhttp_search.responseText;
      console.log("Search"+result);
      try {
	var newres = JSON.parse(result);
	var searchResult = newres;
	if(searchResult.success) {
	  userMail = searchResult.data[0];
	  document.getElementById("userWallView").style.display = "block";
	  dataVisible = true;
	  dataVisibility();
	  loadWallView();
	} else {
	  document.getElementById("userWallView").style.display =  "none";
	}
	
      } catch (e) {
	console.error("Parsing error:", e); 
      }
    }
    
  }
  xmlhttp_search.open("GET","http://localhost:5000/get_user_data_by_email/"+token+"/"+search, true);
  xmlhttp_search.send();
  
  //var searchResult = serverstub.getUserDataByEmail(token, search);
  
}

var lwEmail = null;

function loadWallEmail(email) {
    lwEmail = email;
        var xmlhttp_wall1 = xmlreqGetMessages();
      xmlhttp_wall1.open("GET","http://localhost:5000/get_user_messages_by_email/"+token+"/"+lwEmail, true);
      xmlhttp_wall1.send();
      var connection = new WebSocket('ws://localhost:5000/auto_update');
  connection.onopen = function(evt) { console.log("connection ok"); 
    var msg = { "email": lwEmail }; connection.send(JSON.stringify(msg)) ; }; 
    connection.onclose = function(evt) { console.log("connection closed"); }; 
    connection.onmessage = function(evt) {loadWallView();}; 
    connection.onerror = function(evt) { console.log(evt.data) }; 
}