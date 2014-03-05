from flask import Flask, request	
import hashlib
import database_helper
import json
import random
import string
from geventwebsocket.handler import WebSocketHandler
from gevent.pywsgi import WSGIServer


app = Flask(__name__)
app.config['DEBUG'] = True
userList = []

@app.route('/sign_in/', methods=['POST'])
def sign_in():
    email=request.form['email']
    password=request.form['password']
    pwd = hashlib.sha512(password.encode('utf-8'))
    if database_helper.check_user(email, pwd.hexdigest()) is None:
        return json.dumps({"success": False, "message": "Wrong username or password."})

    chars = string.digits + string.ascii_letters
    token = ''.join(random.choice(chars) for x in range(40))

    database_helper.signin_user(token, email)
    return json.dumps({"success": True, "message": "Successfully signed in.", "data": token})


@app.route('/sign_up/', methods=['POST'])
def sign_up():
    email=request.form['email']
    password=request.form['password']
    firstname=request.form['firstname']
    familyname=request.form['familyname']
    gender=request.form['gender']
    city=request.form['city']
    country=request.form['country']
  
    print(database_helper.user_exist(email))

    if(database_helper.user_exist(email)):
        return json.dumps({"success": False, "message": "User already exists."})

    if(not email or not password or not firstname or not familyname or not gender or not city or not country):
        return json.dumps({"success": False, "message": "Formdata not complete."})

    database_helper.add_user(email, hashlib.sha512(password.encode('utf-8')).hexdigest(), firstname, familyname, gender, city, country)

    return json.dumps({"success": True, "message": "Successfully created a new user."})


@app.route('/sign_out/<token>')
def sign_out(token):
    if database_helper.user_signedin(token) is None:
        return json.dumps({"success": False, "message": "You are not signed in."})

    database_helper.signout_user(token)
    return json.dumps({"success": True, "message": "Successfully signed out."})


@app.route('/change_password/', methods=['POST'])
def change_password():
    token=request.form['token']
    old_password=request.form['old_password']
    new_password=request.form['new_password']
    user = database_helper.user_signedin(token)
    if user is None:
        return json.dumps({"success": False, "message": "You are not logged in."})

    if database_helper.get_password(user[0])[0] != hashlib.sha512(old_password.encode('utf-8')).hexdigest():
        return json.dumps({"success": False, "message": "Wrong password."})

    database_helper.update_password(user[0], hashlib.sha512(new_password.encode('utf-8')).hexdigest())
    return json.dumps({"success": True, "message": "Password changed."})


@app.route('/get_user_messages_by_token/<token>')
def get_user_messages_by_token(token):
  signed_in = database_helper.user_signedin(token)
  if signed_in is None:
    return json.dumps({"success": False, "message": "You are not signed in."})
  
  return get_user_messages_by_email(token, database_helper.user_signedin(token)[0])


#def getuserMessagesByyEmail(tokenh email):
#    db.getmessagesagesByyEmail
#   return messages

@app.route('/get_user_messages_by_email/<token>/<email>')
def get_user_messages_by_email(token, email):
    signed_in = database_helper.user_signedin(token)
    if email is None or signed_in is None:
        return json.dumps({"success": False, "message": "You are not signed in."})

    data = database_helper.get_messages(email)
    if data is None:
        return json.dumps({"success": False, "message": "No such user."})

    return json.dumps({"success": True, "message": "User messages retrieved..", "data": data})


@app.route('/get_user_data_by_token/<token>')
def get_user_data_by_token(token):
    return get_user_data_by_email(token, database_helper.user_signedin(token)[0])


@app.route('/get_user_data_by_email/<token>/<email>')
def get_user_data_by_email(token, email):
    if email is None:
        return json.dumps({"success": False, "message": "You are not signed in."})
    data = database_helper.get_user(email)
    if data is None:
        return json.dumps({"success": False, "message": "No such user."})

    return json.dumps({"success": True, "message": "User data retrieved..", "data": data})


@app.route('/post_message/<token>/<message>/<email>')
def post_message(token, message, email):

    user = database_helper.user_signedin(token)
    if user is None:
        return json.dumps({"success": False, "message": "You are not signed in."})

    if database_helper.user_exist(email) is None:
        return json.dumps({"success": False, "message": "No such user."})

    for item in userList:
        if item[1] == email:
            item[0].send(json.dumps({"sender": user[0], "content": message}))

    database_helper.post_message(user[0], email, message)
    return json.dumps({"success": True, "message": "Message posted"})


@app.teardown_appcontext
def teardown_app(exception):
    database_helper.close_db()


@app.route('/auto_update')
def auto_update():
    if request.environ.get('wsgi.websocket'):
        ws = request.environ['wsgi.websocket']
        
        while 1:
	  data = json.loads(ws.receive())
	 # ws.send(getuserMessagesByyEmail([email] , data[token]))
	  print(data)
	  userList.append((ws, data["email"]))

if __name__ == '__main__':
    http_server = WSGIServer(('',5000), app, handler_class=WebSocketHandler)
    http_server.serve_forever()
   # app.run()