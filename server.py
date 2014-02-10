from flask import Flask
import hashlib
import database_helper
import json
import random

app = Flask(__name__)
app.config['DEBUG'] = True

@app.route('/sign_in/<email>/<password>')
def sign_in(email, password):
    pwd = hashlib.sha512(password.encode('utf-8'))
    if database_helper.check_user(email, pwd.digest()) is None:
        return json.dump({"success": False, "message": "Wrong username or password."})

    rand = random.random()
    rand.seed()
    letters = "abcdefghiklmnopqrstuvwwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
    token = ""
    for i in range(40):
        token[i] = letters[rand.randint(0, len(letters)-1)]

    database_helper.signin_user(token, email)
    return json.dump({"success": True, "message": "Successfully signed in.", "data": token})


@app.route('/sign_up/<email>/<password>/<firstname>/<familyname>/<gender>/<city>/<country>')
def sign_up(email, password, firstname, familyname, gender, city, country):

    if(database_helper.user_exist(email)):
        return json.dump({"success": False, "message": "User already exists."})

    if(not email or not password or not firstname or not familyname or not gender or not city or not country):
        return json.dump({"success": False, "message": "Formdata not complete."})

    database_helper.add_user(email, hashlib.sha512(password.encode('utf-8')).digest(), firstname, familyname, gender, city, country)

    return json.dump({"success": True, "message": "Successfully created a new user."})


@app.route('/sign_out/<token>')
def sign_out(token):
    if database_helper.user_signedin(token) is None:
        return json.dump({"success": False, "message": "You are not signed in."})

    database_helper.signout_user(token)
    return json.dump({"success": True, "message": "Successfully signed out."})


@app.route('/change_password/<token>/<old_password>/<new_password>')
def change_password(token, old_password, new_password):

    user = database_helper.user_signedin(token)
    if user is None:
        return json.dump({"success": False, "message": "You are not logged in."})

    if database_helper.get_password(user) != hashlib.sha512(old_password.encode('utf-8')).digest():
        return json.dump({"success": False, "message": "Wrong password."})

    database_helper.update_password(user, hashlib.sha512(new_password.encode('utf-8')).digest())
    return json.dump({"success": True, "message": "Password changed."})


@app.route('/get_user_messages_by_token/<token>')
def get_user_messages_by_token(token):
    return get_user_messages_by_email(token, database_helper.user_signedin(token))


@app.route('/get_user_messages_by_email/<token>/<email>')
def get_user_messages_by_email(token, email):
    if email is None:
        return json.dump({"success": False, "message": "You are not signed in."})

    data = database_helper.get_messages(email)
    if data is None:
        return json.dump({"success": False, "message": "No such user."})

    return json.dump({"success": True, "message": "User messages retrieved..", "data": data})


@app.route('/get_user_data_by_token/<token>')
def get_user_data_by_token(token):
    return get_user_data_by_email(token, database_helper.user_signedin(token))


@app.route('/get_user_data_by_email/<token>/<email>')
def get_user_data_by_email(token, email):
    if email is None:
        return json.dump({"success": False, "message": "You are not signed in."})

    data = database_helper.get_user(email)
    if data is None:
        return json.dump({"success": False, "message": "No such user."})

    return json.dump({"success": True, "message": "User data retrieved..", "data": data})


@app.route('/post_message/<token>/<message>/<email>')
def post_message(token, message, email):

    user = database_helper.user_signedin(token)
    if user is None:
        return json.dump({"success": False, "message": "You are not signed in."})

    if database_helper.user_exist(email) is None:
        return json.dump({"success": False, "message": "No such user."})

    database_helper.post_message(user, email, message)
    return json.dump({"success": True, "message": "Message posted"})


@app.teardown_appcontext
def teardown_app(exception):
    database_helper.close_db()

if __name__ == '__main__':
    app.run()