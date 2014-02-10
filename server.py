from flask import Flask
import hashlib
import database_helper
import json

app = Flask(__name__)
app.config['DEBUG'] = True

@app.route('/sign_in/<email>/<password>')
def sign_in(email, password):
    pwd = hashlib.sha512()
    pwd.update(password)
    result = database_helper.check_user(email, pwd.digest())
    if result is None:
        return json.dump({"success": False, "message": "Wrong username or password."})

    database_helper.signin_user(123, email)

@app.route('/sign_up/<email>/<password>/<firstname>/<familyname>/<gender>/<city>/<country>')
def sign_up(email, password, firstname, familyname, gender, city, country):
    pwd = hashlib.sha512()
    pwd.update(password)

    pass

@app.route('/sign_out/<token>')
def sign_out(token):
    pass

@app.route('/change_password/<token>/<old_password>/<new_password>')
def change_password(token, old_password, new_password):
    pass

@app.route('/get_user_data_by_token/<token>')
def get_user_data_by_token(token):
    pass

@app.route('/get_user_data_by_email/<token>/<email>')
def get_user_data_by_email(token, email):
    pass

@app.route('/get_user_messages_by_token/<token>')
def get_user_messages_by_token(token):
    pass

@app.route('/get_user_messages_by_email/<token>/<email>')
def get_user_messages_by_email(token, email):
    pass

@app.route('/post_message/<token>/<message>/<email>')
def post_message(token, message, email):
    pass

@app.teardown_appcontext
def teardown_app(exception):
    database_helper.close_db()

if __name__ == '__main__':
    app.run()