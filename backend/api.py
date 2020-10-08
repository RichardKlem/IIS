from flask import Flask, jsonify, request
from flask_restful import Api
from flask_cors import CORS
import json
import sys

from init import FLASK_HOST
from mysqlConnector import Connector

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
        query = f'DELETE FROM todos WHERE id={data.get("id")};'
        return jsonify(Connector().query(query, expecting_result=False))


@app.route('/todos', methods=['GET', 'POST'])
def todos():
    if request.method == 'POST':
        db = Connector()
        data = json.loads(request.get_data().decode('utf-8'))
        # Insert new todo item with requested title
        query = f'INSERT INTO todos (title) VALUES (\"{data.get("title")}\");'
        db.query(query, expecting_result=False, disconnect=False)
        # Return inserted todo
        query = f'SELECT * FROM todos WHERE id = \"{db.getlastrowid()}\";'
        result = db.query(query)
        return jsonify(result[0])
    elif request.method == 'GET':
        return jsonify(Connector().query('SELECT * FROM todos;'))


@app.route('/registration', methods=['POST'])
def registration():
    data = json.loads(request.get_data().decode('utf-8'))
    query = f'SELECT uzivatel.name FROM uzivatel WHERE (email=\"{data.get("email")}\");'
    result = Connector().query(query)
    if result:
        return jsonify({'status': 'Given email is already registered, please login'})
    query = f'INSERT INTO uzivatel(name, surname, birthDate, phoneNumber, email, password) VALUES (' \
            f'\"{data.get("name")}\",' \
            f'\"{data.get("surname")}\",' \
            f'\"{data.get("birthDate")}\",' \
            f'\"{data.get("phoneNumber")}\",' \
            f'\"{data.get("email")}\",' \
            f'\"{data.get("password")}\");'
    try:
        Connector().query(query, expecting_result=False)
    except Exception as e:
        return jsonify({'status': 'Registration Failed, please contact support'})
    return jsonify({'status': 'Registration Successful, please log-in'})

@app.route('/login', methods=['POST'])
def login():
    """
    Todo
    Login musí vytvořit nějaký (dočasný) uživatelský identifikátor,
    který bude uložen jak v aktuálně běžící instanci api,
    tak u uživatele (u uživatele nejspíše jako cookie,
    musíme zjistit, jak přesně to funguje) díky kterému bude API
    komunikovat s React aplikací a bude nabízet konkrétní
    data pro konkrétního uživatele.
    :return:
    """
    data = json.loads(request.get_data().decode('utf-8'))
    query = f'SELECT uzivatel.id_uz FROM uzivatel WHERE (email=\"{data.get("email")}\" and password=\"{data.get("password")}\");'
    result = Connector().query(query)
    if result:
        return jsonify({'status': 'Login OK', 'statusCode': 200, 'userId': result[0].get("id_uz")})
    else:
        return jsonify({'status': 'Login FAILED'})


@app.route('/account', methods=['POST'])
def account():
    data = json.loads(request.get_data().decode('utf-8'))
    query = f'SELECT * FROM uzivatel WHERE (id_uz = \"{data.get("userId")}\");'
    result = Connector().query(query)
    return jsonify(result[0])


if __name__ == '__main__':
    try:
        app.run(debug=True, host=FLASK_HOST)
    except Exception as e:
        print(e, file=sys.stderr)
