from flask import Flask, jsonify, request
from flask_restful import reqparse, abort, Api, Resource
from flask_cors import CORS
import json
import mysql.connector
import sys

from init import AUTH_PLUGIN, DATABASE, HOST, PASSWORD, USER


class Connector:
    def __init__(self):
        self.connection = None
        self.cursor = None
        self.reconnect()

    def reconnect(self):
        self.connection = mysql.connector.connect(
          host=HOST,
          user=USER,
          password=PASSWORD,
          database=DATABASE,
          auth_plugin=AUTH_PLUGIN
        )
        self.cursor = self.connection.cursor(dictionary=True, buffered=True)

    def select_from_table(self, select='*', table='*'):
        self.reconnect()
        query = f'SELECT {select} FROM {table};'
        self.cursor.execute(query)

        output = []
        for description in self.cursor:
            output.append(description)

        self.disconnect()
        return jsonify(output)

    #note todos requesting object not array !
    def select_from_table_where(self, select, table, where):
        self.reconnect()
        query = f'SELECT {select} FROM {table} WHERE {where};'
        self.cursor.execute(query)

        for description in self.cursor:
            return description

    def delete_from_table(self, table, where):
        self.reconnect()
        query = f'DELETE FROM {table} WHERE {where};'
        self.cursor.execute(query)
        self.connection.commit()
        self.disconnect()
        return "OK"

    def insert_into(self, table, column, value):
        self.reconnect()
        query = f'INSERT INTO {table} ({column}) VALUES (\"{value}\");'
        #query = f'INSERT INTO todos (title) VALUES (\"tes3\");'
        self.cursor.execute(query)
        self.connection.commit()
        where = f'{column} = \"{value}\"'
        response = self.select_from_table_where("*", "todos", where)
        print(response, file=sys.stdout)
        self.disconnect()
        return jsonify(response)

    def disconnect(self):
        self.connection.close()
        self.cursor.close()


app = Flask(__name__)
cors = CORS(app, resources={r"*": {"origins": "*"}})
api = Api(app)
myDB = Connector()


@app.route('/person')
def get_person_table():
    return myDB.select_from_table('*', 'person')


@app.route('/delTodos', methods=['POST'])
def delTodos():
    if request.method == 'POST':
        print(request, file=sys.stdout)
        data = json.loads(request.get_data().decode('utf-8'))
        where = f'id={data.get("id")}'
        print(data, file=sys.stdout)
        return myDB.delete_from_table('todos', where)

@app.route('/todos', methods=['GET', 'POST'])
def todos():
    if request.method == 'POST':
        data = json.loads(request.get_data().decode('utf-8'))
        return myDB.insert_into("todos", "title", data.get("title"))
    elif request.method == 'GET':
        return myDB.select_from_table('*', 'todos')


if __name__ == '__main__':
    try:
        app.run(debug = True, host="127.0.0.1")
    except Exception as e:
        print(e)
    finally:
        myDB.disconnect()
