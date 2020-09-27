import time
from flask import Flask, jsonify
import mysql.connector
import sys

from backend import AUTH_PLUGIN, DATABASE, HOST, PASSWORD, USER


class Connector:
    def __init__(self):
        self.connection = None
        self.cursor = None
        self.reconnect()

    def reconnect(self):
        if self.connection:
            self.disconnect()

        self.connection = mysql.connector.connect(
          host=HOST,
          user=USER,
          password=PASSWORD,
          database=DATABASE,
          auth_plugin=AUTH_PLUGIN
        )
        self.cursor = self.connection.cursor(buffered=True)

    def select_from_table(self, select='*', table='*'):
        self.reconnect()
        query = f'SELECT {select} FROM {table};'
        self.cursor.execute(query)
        output = ''
        for description in self.cursor:
            output += str(description)
        return str(output)

    def disconnect(self):
        self.connection.close()
        self.cursor.close()


app = Flask(__name__)
myDB = Connector()


@app.route('/time')
def get_current_time():
    return jsonify({'time': time.time()})


@app.route('/person')
def get_person_table():
    return jsonify({'table': str(myDB.select_from_table('*', 'person'))})


if __name__ == '__main__':
    try:
        app.run()
    except Exception as e:
        print(e)
    finally:
        myDB.disconnect()
