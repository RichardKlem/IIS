import mysql.connector

from init import HOST, USER, PASSWORD, DATABASE, AUTH_PLUGIN


class Connector:
    def __init__(self):
        self.connection = mysql.connector.connect(
            host=HOST,
            user=USER,
            password=PASSWORD,
            database=DATABASE,
            auth_plugin=AUTH_PLUGIN
        )
        self.cursor = self.connection.cursor(dictionary=True, buffered=True)

    def query(self, query, expecting_result=True, disconnect=True):
        self.cursor.execute(query)
        self.connection.commit()
        output = []
        if expecting_result:
            for result in self.cursor:
                output.append(result)
        if disconnect:
            self.disconnect()
        return output

    def getlastrowid(self):
        return self.cursor.lastrowid

    def disconnect(self):
        self.connection.close()
        self.cursor.close()
