import sqlite3
import hashlib
from flask import g

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect('database.db')
        print(db)
    return db

def close_db():
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def add_user(email, password, firstname, familyname, gender, city, country):
    get_db().execute('INSERT INTO users VALUES(?,?,?,?,?,?,?)', (email, password, firstname, familyname, gender, city, country))
    get_db().commit()

def get_user(email):
    cur = get_db().cursor()
    cur.execute('SELECT email, firstname, familyname, gender, city, country FROM users WHERE email=?', (email,))
    return cur.fetchone()

def check_user(email, password):
    cur = get_db().cursor()
    cur.execute('SELECT email FROM users WHERE email=? AND password=?', (email, password))
    return cur.fetchone()

def user_exist(email):
    cur = get_db().cursor()
    cur.execute('SELECT email FROM users WHERE email=?', (email,))
    return cur.fetchone()

def signin_user(token, email):
    get_db().execute('INSERT INTO signed_users VALUES(?,?)', (token, email))
    get_db().commit();

def signout_user(token):
    get_db().execute('DELETE FROM signed_users WHERE token=?', (token,))
    get_db().commit()

def user_signedin(token):
    cur = get_db().cursor()
    cur.execute('SELECT email FROM signed_users WHERE token=?', (token,))
    return cur.fetchone()

def get_password(email):
    cur = get_db().cursor()
    cur.execute('SELECT password FROM users WHERE email=?', (email,))
    return cur.fetchone()

def update_password(email, newPwd):
    get_db().execute('UPDATE users SET password=? WHERE email=?', (newPwd, email))
    get_db().commit()

def get_messages(email):
    cur = get_db().cursor()
    cur.execute('SELECT sender, content FROM messages WHERE receiver=?', (email,))
    return cur.fetchall()

def post_message(sender, receiver, content):
    get_db().execute('INSERT INTO messages VALUES(NULL,?,?,?)', (sender, receiver, content))
    get_db().commit()