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
    query = f'SELECT uzivatel.jmeno FROM uzivatel WHERE (email=\"{data.get("email")}\" and password=\"{data.get("password")}\");'
    result = Connector().query(query)
    if result:
        return jsonify({'status': 'Login OK'})
    else:
        return jsonify({'status': 'Login FAILED'})


if __name__ == '__main__':
    try:
        app.run(debug=True, host=FLASK_HOST)
    except Exception as e:
        print(e, file=sys.stderr)
