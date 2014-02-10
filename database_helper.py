import sqlite3
import hashlib
from flask import g

def get_db():
    db = getattr(g, 'database', None)
    if (db is None):
        db = sqlite3.connect('database.db')
    return db

def close_db():
    get_db().close()

def add_user(email, password, firstname, familyname, gender, city, country):
    get_db().execute('INSERT INTO users VALUES(?,?,?,?,?,?,?)', (email, password, firstname, familyname, gender, city, country))

def check_user(email, password):
    cur = get_db().cursor()
    cur.execute('SELECT email FROM users WHERE email=? AND password=?', (email, password))
    return cur.fetchone()

def user_exist(email):
    cur = get_db().cursor()
    cur.execute('SELECT email FROM users WHERE email=?', email)
    return cur.fetchone()

def signin_user(token, email):
    get_db().execute('INSERT INTO signed_user VALUES(?,?)', (token, email))

def signout_user(token):
    get_db().execute('DELETE * FROM signed_user WHERE token=?', token)


def remove_contact(firstname, familyname):
    pass
       #code for removing a contact
