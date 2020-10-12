import base64
import os

from flask import Flask, jsonify, request
from flask_restful import Api
from flask_cors import CORS
import json
import sys

from init import FLASK_HOST
from databaseConnector import Connector
from iisUtils import hash_password, verify_password, random_uuid

app = Flask(__name__)
cors = CORS(app, resources={r"*": {"origins": "*"}})
api = Api(app)


@app.route('/person', methods=['GET'])
def get_person_table():
    if request.method == 'GET':
        return jsonify(Connector().query('SELECT * from person'))


@app.route('/delTodos', methods=['POST'])
def delTodos():
    if request.method == 'POST':
        data = json.loads(request.get_data().decode('utf-8'))
        query = f'DELETE FROM todos ' \
                f'WHERE id={data.get("id")};'
        return jsonify(Connector().query(query, expecting_result=False))


@app.route('/todos', methods=['GET', 'POST'])
def todos():
    if request.method == 'POST':
        db = Connector()
        data = json.loads(request.get_data().decode('utf-8'))
        # Insert new todos item with requested title
        query = f"""INSERT INTO todos (title) VALUES (
                    {str(data.get("title"))});"""
        db.query(query, expecting_result=False, disconnect=False)
        # Return inserted todos
        query = f"""SELECT * FROM todos
                    WHERE id = {str(db.get_last_row_id())};"""
        result = db.query(query)
        return jsonify(result[0])
    elif request.method == 'GET':
        query = f"""SELECT * FROM todos;"""
        return jsonify(Connector().query(query))


@app.route('/registration', methods=['POST'])
def registration():
    data = json.loads(request.get_data().decode('utf-8'))
    query = f'SELECT uzivatel.name ' \
            f'FROM uzivatel WHERE ' \
            f'(email=\"{data.get("email")}\");'
    result = Connector().query(query)
    if result:
        return jsonify({'status': 'Given email is already registered, please login'})
    else:
        try:
            query = f'INSERT INTO uzivatel(name, birth_date, phone_number, email) VALUES (' \
                    f'\"{data.get("name")}\",' \
                    f'\"{data.get("birth_date")}\",' \
                    f'\"{data.get("phone_number")}\",' \
                    f'\"{data.get("email")}\");'
            db = Connector()
            db.query(query, expecting_result=False, disconnect=False)
            query = f'INSERT INTO password_table ' \
                    f'VALUES ({db.get_last_row_id()}, \"{hash_password(data.get("password"))}\");'
            db.query(query, expecting_result=False)
        except Exception as e:
            return jsonify({'status': 'Registration Failed, please contact support'})
        return jsonify({'status': 'Registration Successful, please log-in'})


@app.route('/login', methods=['POST'])
def login():
    data = json.loads(request.get_data().decode('utf-8'))
    query = f'SELECT uzivatel.id_user FROM uzivatel WHERE (email=\"{data.get("email")}\");'
    result = Connector().query(query)
    if not result:
        return jsonify({'status': 'Login FAILED'})
    else:
        user_id = result[0].get("id_user")
        query = f'SELECT password_table.password ' \
                f'FROM password_table ' \
                f'WHERE (id_user=\"{user_id}\");'
        result = Connector(secure=True).query(query)
        condition = verify_password(result[0].get("password"), data.get("password"))
        if condition:
            random_key = random_uuid()
            query = f'INSERT INTO session_table(id_user, id_session) ' \
                    f'VALUES (\"{user_id}\", \"{random_key}\");'
            Connector().query(query, expecting_result=False)
            return jsonify({'status': 'Login OK', 'status_code': 200, 'cookie_id': random_key})
        else:
            return jsonify({'status': 'Login FAILED'})


@app.route('/account', methods=['POST'])
def account():
    data = json.loads(request.get_data().decode('utf-8'))
    query = f'SELECT uzivatel.name, uzivatel.email, uzivatel.phone_number, uzivatel.birth_date ' \
            f'FROM uzivatel NATURAL JOIN session_table ' \
            f'WHERE (session_table.id_session = \"{data.get("CookieUserID")}\");'
    result = Connector().query(query)
    # serialize date
    if result:
        result[0]["birth_date"] = result[0]["birth_date"].strftime("%Y-%m-%d")
        return jsonify(result[0])


@app.route('/updateAccount', methods=['POST'])
def update_account():
    db = Connector()
    data = json.loads(request.get_data().decode('utf-8'))
    query = f'SELECT uzivatel.id_user ' \
            f'FROM uzivatel NATURAL JOIN session_table ' \
            f'WHERE (session_table.id_session = \"{data.get("CookieUserID")}\");'
    result = db.query(query, disconnect=False)
    query = f'UPDATE uzivatel ' \
            f'SET name = \"{data.get("name")}\", ' \
            f'email = \"{data.get("email")}\",' \
            f'phone_number = \"{data.get("phone_number")}\", ' \
            f'birth_date = \"{data.get("birth_date")}\"' \
            f'WHERE (id_user = \"{result[0].get("id_user")}\");'
    db.query(query, expecting_result=False)
    return "User information updated successfully."


@app.route('/getUsers', methods=['POST'])
def get_users():
    if request.method == 'POST':
        db = Connector()
        data = json.loads(request.get_data().decode('utf-8'))
        query = f'SELECT uzivatel.role ' \
                f'FROM uzivatel NATURAL JOIN session_table ' \
                f'WHERE (session_table.id_session = \"{data.get("CookieUserID")}\");'
        result = db.query(query, disconnect=False)
        if result and result[0]["role"] == 0:
            result = db.query('SELECT * from uzivatel WHERE role != 0;')
            for user in result:
                user["birth_date"] = user["birth_date"].strftime("%Y-%m-%d")
            return jsonify(result)
        else:
            return jsonify(False)


@app.route('/upload/<id>', methods=['POST'])
def upload_user_image(id):
    file = request.files['file']
    db = Connector()
    query = f'SELECT uzivatel.id_user ' \
            f'FROM uzivatel NATURAL JOIN session_table ' \
            f'WHERE (session_table.id_session = \"{id}\");'
    result = db.query(query)
    file.save(os.getcwd() + '/static/users/' + str(result[0].get("id_user")) + ".jpg")
    return jsonify("ok")


@app.route('/display', methods=['POST'])
def display_image():
    db = Connector()
    data = json.loads(request.get_data().decode('utf-8'))
    query = f'SELECT uzivatel.id_user ' \
            f'FROM uzivatel NATURAL JOIN session_table ' \
            f'WHERE (session_table.id_session = \"{data.get("CookieUserID")}\");'
    result = db.query(query)
    img_file = os.getcwd() + f'/static/users/{result[0].get("id_user")}.jpg'
    if not os.path.isfile(img_file):
        img_file = os.getcwd() + '/static/users/default.png'
    with open(img_file, "rb") as f:
        im_b64 = base64.b64encode(f.read())
    return im_b64


if __name__ == '__main__':
    try:
        app.run(debug=True, host=FLASK_HOST)
    except Exception as e:
        print(e, file=sys.stderr)
