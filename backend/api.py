import base64
import json
import os
import sys
import time
from datetime import datetime

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_restful import Api

from backend import FLASK_HOST
from backend.databaseConnector import Connector
from backend.iisUtils import hash_password, random_uuid, verify_password

app = Flask(__name__)
cors = CORS(app, resources={r"*": {"origins": "*"}})
api = Api(app)


@app.route('/time')
def get_current_time():
    return jsonify({'time': time.asctime(time.localtime(time.time()))})



@app.route('/registration', methods=['POST'])
def registration():
    data = json.loads(request.get_data().decode('utf-8'))
    query = f'SELECT uzivatel.name ' \
            f'FROM uzivatel WHERE ' \
            f'(email=\"{data.get("email")}\");'
    result = Connector().query(query)
    if result:
        return jsonify({'status': 'Given email is already registered, please login', 'statusCode': 300})
    else:
        try:
            query = f'INSERT INTO uzivatel(name, birth_date, phone_number, email) VALUES (' \
                    f'\"{data.get("name")}\",' \
                    f'\"{data.get("birth_date")}\",' \
                    f'\"{data.get("phone_number")}\",' \
                    f'\"{data.get("email")}\");'
            if data.get("birth_date") is not None:
                query = f'INSERT INTO uzivatel(name, phone_number, email) VALUES (' \
                        f'\"{data.get("name")}\",' \
                        f'\"{data.get("phone_number")}\",' \
                        f'\"{data.get("email")}\");'
            db = Connector()
            db.query(query, expecting_result=False, disconnect=False)
            query = f'INSERT INTO password_table ' \
                    f'VALUES ({db.get_last_row_id()}, \"{hash_password(data.get("password"))}\");'
            db.query(query, expecting_result=False)
        except Exception as e:
            print(e)
            return jsonify({'status': 'Registration Failed, please contact support', 'statusCode': 400})
        return jsonify({'status': 'Registration Successful, please log-in', 'statusCode': 200})


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
            return jsonify({'status': 'Login Successful', 'status_code': 200, 'cookie_id': random_key})
        else:
            return jsonify({'status': 'Login FAILED'})


@app.route('/account', methods=['POST'])
def account():
    data = json.loads(request.get_data().decode('utf-8'))
    query = f'SELECT uzivatel.name, uzivatel.email, uzivatel.phone_number, uzivatel.address, uzivatel.birth_date, uzivatel.role ' \
            f'FROM uzivatel NATURAL JOIN session_table ' \
            f'WHERE (session_table.id_session = \"{data.get("CookieUserID")}\");'
    result = Connector().query(query)
    print(result)
    # serialize date
    if result:
        result[0]["birth_date"] = (lambda: result[0]["birth_date"], lambda: result[0]["birth_date"].strftime("%Y-%m-%d"))[
            result[0]["birth_date"] is not None]()
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
            f'address = \"{data.get("address")}\"' \
            f'WHERE (id_user = \"{result[0].get("id_user")}\");'
    if data.get("birth_date") is not None:
        query = f'UPDATE uzivatel ' \
                f'SET name = \"{data.get("name")}\", ' \
                f'email = \"{data.get("email")}\",' \
                f'phone_number = \"{data.get("phone_number")}\", ' \
                f'birth_date = \"{data.get("birth_date")}\",' \
                f'address = \"{data.get("address")}\"' \
                f'WHERE (id_user = \"{result[0].get("id_user")}\");'

    db.query(query, expecting_result=False)
    return "User information updated successfully."

@app.route('/updateUser', methods=['POST'])
def update_user():
    data = json.loads(request.get_data().decode('utf-8'))
    query = f'UPDATE uzivatel ' \
            f'SET name = \"{data.get("name")}\", ' \
            f'email = \"{data.get("email")}\",' \
            f'phone_number = \"{data.get("phone_number")}\", ' \
            f'address = \"{data.get("address")}\", ' \
            f'WHERE (id_user = \"{data.get("id_user")}\");'
    if data.get("birth_date") is not None:
        query = f'UPDATE uzivatel ' \
                f'SET name = \"{data.get("name")}\", ' \
                f'email = \"{data.get("email")}\",' \
                f'phone_number = \"{data.get("phone_number")}\", ' \
                f'address = \"{data.get("address")}\", ' \
                f'birth_date = \"{data.get("birth_date")}\"' \
                f'WHERE (id_user = \"{data.get("id_user")}\");'
    Connector().query(query, expecting_result=False)
    return "User information updated successfully."


@app.route('/removeUser', methods=['POST'])
def remove_user():
    data = json.loads(request.get_data().decode('utf-8'))
    query = f'DELETE FROM uzivatel ' \
            f'WHERE id_user = \"{data.get("id_user")}\";'
    Connector().query(query, expecting_result=False)
    return "User removed successfully."


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
                user["birth_date"] = (lambda: user["birth_date"], lambda: user["birth_date"].strftime("%Y-%m-%d"))[user["birth_date"] is not None]()
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


@app.route('/getProfileImage', methods=['POST'])
def get_profile_image():
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


@app.route('/getUserName', methods=['POST'])
def get_user_name():
    db = Connector()
    data = json.loads(request.get_data().decode('utf-8'))
    query = f'SELECT uzivatel.name ' \
            f'FROM uzivatel NATURAL JOIN session_table ' \
            f'WHERE (session_table.id_session = \"{data.get("CookieUserID")}\");'
    result = db.query(query)
    return jsonify(result[0])


@app.route('/getUserRole', methods=['POST'])
def get_user_role():
    db = Connector()
    data = json.loads(request.get_data().decode('utf-8'))
    query = f'SELECT uzivatel.role ' \
            f'FROM uzivatel NATURAL JOIN session_table ' \
            f'WHERE (session_table.id_session = \"{data.get("CookieUserID")}\");'
    result = db.query(query)
    return jsonify(result[0])

@app.route('/getHotels', methods=['GET'])
def get_hotel_by_id():
    query = f'SELECT hotels_table.*, MIN(rooms_table.price_night) AS price_night FROM hotels_table join rooms_table where hotels_table.hotel_id = rooms_table.hotel_id GROUP BY hotels_table.hotel_id;'
    hotels = Connector().query(query)
    for hotel in hotels:
        for key in hotel:
            if hotel[key] == "None":
                hotel[key] = ""
    return jsonify(hotels)

@app.route('/getHotelsAdmin', methods=['GET'])
def get_hotels_admin():
    query = f'SELECT * FROM hotels_table;'
    hotels = Connector().query(query)
    for hotel in hotels:
        for key in hotel:
            if hotel[key] == "None":
                hotel[key] = ""
    return jsonify(hotels)

@app.route('/getHotel', methods=['POST'])
def get_hotels():
    data = json.loads(request.get_data().decode('utf-8'))
    query = f'SELECT * FROM hotels_table WHERE (hotel_id = \"{data.get("hotel_id")}\" );'
    hotel = Connector().query(query)[0]
    for key in hotel:
        if hotel[key] == "None":
            hotel[key] = ""
    return jsonify(hotel)


@app.route('/getHotelImage', methods=['POST'])
def get_hotel_image():
    data = json.loads(request.get_data().decode('utf-8'))
    img_file = os.getcwd() + f'/static/hotels/{data.get("hotel_id")}.jpg'
    if not os.path.isfile(img_file):
        img_file = os.getcwd() + '/static/hotels/default.png'
    with open(img_file, "rb") as f:
        im_b64 = base64.b64encode(f.read())
    return im_b64


@app.route('/removeHotel', methods=['POST'])
def remove_hotel():
    data = json.loads(request.get_data().decode('utf-8'))
    query = f'DELETE FROM hotels_table ' \
            f'WHERE hotel_id={data.get("hotel_id")};'
    return jsonify(Connector().query(query, expecting_result=False))


@app.route('/removeBooking', methods=['POST'])
def remove_booking():
    data = json.loads(request.get_data().decode('utf-8'))
    query = f'DELETE FROM reservation_table ' \
            f'WHERE id_reservation={data.get("id_reservation")};'
    Connector().query(query, expecting_result=False)
    return jsonify("Booking removed successfully")


@app.route('/updateBooking', methods=['POST'])
def update_booking():
    db = Connector()
    data = json.loads(request.get_data().decode('utf-8'))
    query = f'UPDATE reservation_table ' \
            f'SET check_in = \"{data.get("check_in")}\", ' \
            f'check_out = \"{data.get("check_out")}\",' \
            f'approved = \"{data.get("approved")}\"' \
            f'WHERE id_reservation={data.get("id_reservation")};'
    db.query(query, expecting_result=False)
    return "User information updated successfully."



@app.route('/addHotel', methods=['POST'])
def add_hotel():
    db = Connector()
    data = json.loads(request.get_data().decode('utf-8'))
    rating = 0
    if data.get("rating") is not None:
        rating = data.get("rating")
    # Insert new todos item with requested title
    query = f'INSERT INTO hotels_table ' \
            f'(name, description, category, address, email, phone_number, rating, free_cancellation, no_prepayment,' \
            f'free_wifi, gym, spa, swimming_pool)' \
            f' VALUES (\"{data.get("name")}\", \"{data.get("description")}\", \"{data.get("category")}\",' \
            f'\"{data.get("address")}\", \"{data.get("email")}\", \"{data.get("phone_number")}\",' \
            f'{rating}, {data.get("free_cancellation")}, {data.get("no_prepayment")},' \
            f'{data.get("free_wifi")}, {data.get("gym")}, {data.get("spa")}, {data.get("swimming_pool")});'
    db.query(query, expecting_result=False, disconnect=False)
    # Return inserted todos
    return jsonify(str(db.get_last_row_id()))


@app.route('/uploadHotelImg/<id_hotel>', methods=['POST'])
def upload_hotel_image(id_hotel):
    file = request.files['file']
    if file:
        file.save(os.getcwd() + '/static/hotels/' + id_hotel + ".jpg")
    return jsonify("ok")


@app.route('/editHotel', methods=['POST'])
def edit_hotel():
    data = json.loads(request.get_data().decode('utf-8'))
    rating = 0
    if data.get("rating") is not None:
        rating = data.get("rating")

    query = f'UPDATE hotels_table ' \
            f'SET name = \"{data.get("name")}\", ' \
            f'description = \"{data.get("description")}\",' \
            f'address = \"{data.get("address")}\", ' \
            f'email = \"{data.get("email")}\",' \
            f'phone_number = \"{data.get("phone_number")}\",'\
            f'rating = {rating}, ' \
            f'category = \"{data.get("category")}\", ' \
            f'free_cancellation = {data.get("free_cancellation")}, '\
            f'no_prepayment = {data.get("no_prepayment")}, ' \
            f'free_wifi = {data.get("free_wifi")}, ' \
            f'gym = {data.get("gym")}, ' \
            f'spa = {data.get("spa")}, ' \
            f'swimming_pool = {data.get("swimming_pool")} ' \
            f'WHERE (hotel_id = \"{data.get("hotel_id")}\");'
    Connector().query(query, expecting_result=False)
    return jsonify("OK")


@app.route('/getHotelRooms', methods=['POST'])
def get_room_by_hotel_id():
    data = json.loads(request.get_data().decode('utf-8'))
    query = f'SELECT * from rooms_table where rooms_table.hotel_id={data.get("hotel_id")};'
    rooms = Connector().query(query)
    for room in rooms:
        for key in room:
            if room[key] == "None":
                room[key] = ""
    return jsonify(rooms)


@app.route('/getRoom', methods=['POST'])
def get_room():
    data = json.loads(request.get_data().decode('utf-8'))
    query = f'SELECT * FROM rooms_table WHERE id_room = \"{data.get("id_room")}\";'
    room = Connector().query(query)[0]
    for key in room:
        if room[key] == "None":
            room[key] = ""
    return jsonify(room)


@app.route('/getRoomImage', methods=['POST'])
def get_room_image():
    data = json.loads(request.get_data().decode('utf-8'))
    hotel_id = data.get("hotel_id")
    if not data.get("hotel_id"):
        query = f'SELECT hotel_id FROM rooms_table WHERE id_room = \"{data.get("id_room")}\";'
        hotel_id = Connector().query(query)[0]
        hotel_id = hotel_id.get("hotel_id")
    img_file = os.getcwd() + f'/static/hotels/{hotel_id}/{data.get("id_room")}.jpg'
    if not os.path.isfile(img_file):
        img_file = os.getcwd() + '/static/hotels/0/default.png'
    with open(img_file, "rb") as f:
        im_b64 = base64.b64encode(f.read())
    return im_b64


@app.route('/removeRoom', methods=['POST'])
def remove_room():
    data = json.loads(request.get_data().decode('utf-8'))
    query = f'DELETE FROM rooms_table ' \
            f'WHERE id_room={data.get("id_room")};'
    return jsonify(Connector().query(query, expecting_result=False))


@app.route('/addRoom', methods=['POST'])
def add_room():
    db = Connector()
    data = json.loads(request.get_data().decode('utf-8'))
    room_size = 30
    if data.get("room_size"):
       room_size = data.get("room_size")
    # Insert new todos item with requested title
    query = f'insert into rooms_table (hotel_id, name, bed_count, category, description, room_size, ' \
            f'price_night, bed_type, free_breakfast, count, pre_price )' \
            f' VALUES ({data.get("hotel_id")},\"{data.get("name")}\",\"{data.get("bed_count")}\", ' \
            f'\"{data.get("category")}\",\"{data.get("description")}\", \"{room_size}\", ' \
            f'\"{data.get("price_night")}\", \"{data.get("bed_type")}\", {data.get("free_breakfast")}, ' \
            f'\"{data.get("count")}\", {data.get("pre_price")});'
    db.query(query, expecting_result=False, disconnect=False)
    # Return inserted todos
    return jsonify(str(db.get_last_row_id()))


@app.route('/uploadRoomImg/<id>', methods=['POST'])
def upload_room_image(id):
    file = request.files['file']
    if file:
        path = os.getcwd() + '/static/hotels/' + id.split("_")[0] + "/"
        if not os.path.isdir(path):
            os.mkdir(path)
        file.save(path + id.split("_")[1] + ".jpg")
    return jsonify("ok")


@app.route('/editRoom', methods=['POST'])
def edit_room():
    db = Connector()
    data = json.loads(request.get_data().decode('utf-8'))
    query = f'UPDATE rooms_table ' \
            f'SET name = \"{data.get("name")}\", ' \
            f'description = \"{data.get("description")}\",' \
            f'bed_count = \"{data.get("bed_count")}\", ' \
            f'room_size = \"{data.get("room_size")}\",' \
            f'price_night = \"{data.get("price_night")}\",' \
            f'free_breakfast = \"{data.get("free_breakfast")}\",' \
            f'pre_price = \"{data.get("pre_price")}\"' \
            f'WHERE (id_room = \"{data.get("id_room")}\");'
    db.query(query, expecting_result=False, disconnect=False)
    return jsonify(str(db.get_last_row_id()))


@app.route('/bookRoom', methods=['POST'])
def book_room():
    db = Connector()
    data = json.loads(request.get_data().decode('utf-8'))
    query = f'SELECT id_user ' \
            f'FROM uzivatel NATURAL JOIN session_table ' \
            f'WHERE (session_table.id_session = \"{data.get("CookieUserID")}\");'
    id_user = db.query(query, disconnect=False)[0]['id_user']
    query = f'SELECT price_night, pre_price ' \
            f'FROM rooms_table ' \
            f'WHERE (rooms_table.id_room = \"{data.get("id_room")}\");'
    price_per_night = db.query(query, disconnect=False)[0]['price_night']
    pre_price_per_night = db.query(query, disconnect=False)[0]['pre_price']
    start_date = datetime.strptime(data.get("start_date"), "%Y-%m-%d")
    end_date = datetime.strptime(data.get("end_date"), "%Y-%m-%d")
    total_price = int((end_date - start_date).days) * int(price_per_night) * int(data.get("room_count"))
    total_pre_price = int((end_date - start_date).days) * int(pre_price_per_night) * int(data.get("room_count"))
    query = f'insert into reservation_table (id_user, id_room, start_date, end_date, adult_count, child_count, room_count, total_price, approved, pre_price) ' \
            f'values ({id_user}, {data.get("id_room")}, \"{data.get("start_date")}\", \"{data.get("end_date")}\", {data.get("adult_count")}, {data.get("child_count")}, {data.get("room_count")}, {total_price}, {data.get("approved")}, {total_pre_price});'
    db.query(query, expecting_result=False, disconnect=False)
    return jsonify("Reservation completed")


@app.route('/nonRegBooking', methods=['POST'])
def non_reg_booking():
    data = json.loads(request.get_data().decode('utf-8'))
    query = f'SELECT uzivatel.name ' \
            f'FROM uzivatel WHERE ' \
            f'(email=\"{data.get("email")}\");'
    result = Connector().query(query)
    if result:
        return jsonify({'status': 'Given email is already registered, please login'})
    else:
        try:
            query = f'INSERT INTO uzivatel(name, phone_number, address, email) VALUES (' \
                    f'\"{data.get("name")}\",' \
                    f'\"{data.get("phone_number")}\",' \
                    f'\"{data.get("address")}\",' \
                    f'\"{data.get("email")}\");'
            if data.get("birth_date") is not None:
                query = f'INSERT INTO uzivatel(name, birth_date, phone_number, address, email) VALUES (' \
                        f'\"{data.get("name")}\",' \
                        f'\"{data.get("birth_date")}\",' \
                        f'\"{data.get("phone_number")}\",' \
                        f'\"{data.get("address")}\",' \
                        f'\"{data.get("email")}\");'
            db = Connector()
            db.query(query, expecting_result=False, disconnect=False)
            id_user = db.get_last_row_id()
            query = f'SELECT price_night, pre_price ' \
                    f'FROM rooms_table ' \
                    f'WHERE (rooms_table.id_room = \"{data.get("id_room")}\");'
            price_per_night = db.query(query, disconnect=False)[0]['price_night']
            pre_price_per_night = db.query(query, disconnect=False)[0]['pre_price']
            start_date = datetime.strptime(data.get("start_date"), "%Y-%m-%d")
            end_date = datetime.strptime(data.get("end_date"), "%Y-%m-%d")
            total_price = int((end_date - start_date).days) * int(price_per_night) * int(data.get("room_count"))
            total_pre_price = int((end_date - start_date).days) * int(pre_price_per_night) * int(data.get("room_count"))
            query = f'insert into reservation_table (id_user, id_room, start_date, end_date, adult_count, child_count, room_count, total_price, approved, pre_price) ' \
                    f'values ({id_user}, {data.get("id_room")}, \"{data.get("start_date")}\", \"{data.get("end_date")}\", {data.get("adult_count")}, {data.get("child_count")}, {data.get("room_count")}, {total_price}, {data.get("approved")}, {total_pre_price});'
            db.query(query, expecting_result=False)
        except Exception as e:
            print(e)
            return jsonify({'status': 'Booking Failed, please contact support'})
        return jsonify("Booking completed")


@app.route('/regBooking', methods=['POST'])
def reg_booking():
    data = json.loads(request.get_data().decode('utf-8'))
    query = f'SELECT uzivatel.name ' \
            f'FROM uzivatel WHERE ' \
            f'(email=\"{data.get("email")}\");'
    result = Connector().query(query)
    if result:
        return jsonify({'status': 'Given email is already registered, please login'})
    else:
        try:
            query = f'INSERT INTO uzivatel(name, phone_number, address, email) VALUES (' \
                    f'\"{data.get("name")}\",' \
                    f'\"{data.get("phone_number")}\",' \
                    f'\"{data.get("address")}\",' \
                    f'\"{data.get("email")}\");'

            if data.get("birth_date") is not None:
                query = f'INSERT INTO uzivatel(name, birth_date, phone_number, address, email) VALUES (' \
                        f'\"{data.get("name")}\",' \
                        f'\"{data.get("birth_date")}\",' \
                        f'\"{data.get("phone_number")}\",' \
                        f'\"{data.get("address")}\",' \
                        f'\"{data.get("email")}\");'
            db = Connector()
            db.query(query, expecting_result=False, disconnect=False)
            id_user = db.get_last_row_id()
            query = f'INSERT INTO password_table ' \
                    f'VALUES ({id_user}, \"{hash_password(data.get("password"))}\");'
            db.query(query, expecting_result=False, disconnect=False)
            query = f'SELECT price_night, pre_price ' \
                    f'FROM rooms_table ' \
                    f'WHERE (rooms_table.id_room = \"{data.get("id_room")}\");'
            price_per_night = db.query(query, disconnect=False)[0]['price_night']
            pre_price_per_night = db.query(query, disconnect=False)[0]['pre_price']
            start_date = datetime.strptime(data.get("start_date"), "%Y-%m-%d")
            end_date = datetime.strptime(data.get("end_date"), "%Y-%m-%d")
            total_price = int((end_date - start_date).days) * int(price_per_night) * int(data.get("room_count"))
            total_pre_price = int((end_date - start_date).days) * int(pre_price_per_night) * int(data.get("room_count"))
            query = f'insert into reservation_table (id_user, id_room, start_date, end_date, adult_count, child_count, room_count, total_price, approved, pre_price) ' \
                    f'values ({id_user}, {data.get("id_room")}, \"{data.get("start_date")}\", \"{data.get("end_date")}\", {data.get("adult_count")}, {data.get("child_count")}, {data.get("room_count")}, {total_price}, {data.get("approved")}, {total_pre_price});'
            db.query(query, expecting_result=False)
        except Exception as e:
            print(e)
            return jsonify({'status': 'Booking Failed, please contact support'})
        return jsonify("Booking completed")




@app.route('/getBookings', methods=['POST'])
def get_bookings():
    if request.method == 'POST':
        db = Connector()
        data = json.loads(request.get_data().decode('utf-8'))
        query = f'SELECT hotels_table.free_cancellation, uzivatel.name, uzivatel.address, uzivatel.birth_date, uzivatel.phone_number, uzivatel.email, uzivatel.email, reservation_table.approved, reservation_table.id_room, reservation_table.pre_price, reservation_table.total_price, reservation_table.id_reservation, reservation_table.check_in, reservation_table.check_out, reservation_table.start_date, reservation_table.end_date, rooms_table.name as room_name, hotels_table.name as hotel_name ' \
                f'FROM session_table NATURAL JOIN uzivatel NATURAL JOIN reservation_table JOIN rooms_table ON reservation_table.id_room=rooms_table.id_room JOIN hotels_table ON rooms_table.hotel_id=hotels_table.hotel_id ' \
                f'WHERE (session_table.id_session = \"{data.get("CookieUserID")}\");'
        result = db.query(query, disconnect=False)
        for res in result:
            res["birth_date"] = (lambda: res["birth_date"], lambda: res["birth_date"].strftime("%Y-%m-%d"))[
                res["birth_date"] is not None]()
            res["start_date"] = (lambda: res["start_date"], lambda: res["start_date"].strftime("%Y-%m-%d"))[
                res["start_date"] is not None]()
            res["end_date"] = (lambda: res["end_date"], lambda: res["end_date"].strftime("%Y-%m-%d"))[
                res["end_date"] is not None]()
        return jsonify(result)


@app.route('/getAllBookings', methods=['POST'])
def get_all_bookings():
    if request.method == 'POST':
        db = Connector()
        data = json.loads(request.get_data().decode('utf-8'))
        query = f'SELECT uzivatel.role ' \
                f'FROM uzivatel NATURAL JOIN session_table ' \
                f'WHERE (session_table.id_session = \"{data.get("CookieUserID")}\");'
        result = db.query(query, disconnect=False)
        if int(result[0]["role"]) < 4:
            query = f'SELECT uzivatel.name, uzivatel.address, uzivatel.birth_date, uzivatel.phone_number, uzivatel.email, uzivatel.email, reservation_table.pre_price, reservation_table.approved, reservation_table.id_reservation, reservation_table.check_in, reservation_table.check_out, reservation_table.start_date, reservation_table.end_date, reservation_table.total_price, rooms_table.name as room_name, hotels_table.name as hotel_name ' \
                    f'FROM uzivatel NATURAL JOIN reservation_table JOIN rooms_table ON reservation_table.id_room=rooms_table.id_room JOIN hotels_table ON rooms_table.hotel_id=hotels_table.hotel_id;'
            result = db.query(query, disconnect=False)
            for res in result:
                res["birth_date"] = (lambda: res["birth_date"], lambda: res["birth_date"].strftime("%Y-%m-%d"))[res["birth_date"] is not None]()
                res["start_date"] = (lambda: res["start_date"], lambda: res["start_date"].strftime("%Y-%m-%d"))[res["start_date"] is not None]()
                res["end_date"] = (lambda: res["end_date"], lambda: res["end_date"].strftime("%Y-%m-%d"))[res["end_date"] is not None]()
                for key in res:
                    if res[key] == "None":
                        res[key] = ""
            return jsonify(result)
        else:
            return jsonify([])


@app.route('/checkDates', methods=['POST'])
def check_dates():
    db = Connector()
    data = json.loads(request.get_data().decode('utf-8'))
    query = f'SELECT * FROM reservation_table WHERE (reservation_table.id_room = \"{data.get("id_room")}\") AND ' \
            f'(reservation_table.start_date BETWEEN \"{data.get("start_date")}\" AND \"{data.get("end_date")}\" OR ' \
            f'reservation_table.end_date BETWEEN \"{data.get("start_date")}\" AND \"{data.get("end_date")}\" OR ' \
            f'\"{data.get("start_date")}\" BETWEEN reservation_table.start_date AND reservation_table.end_date);'
    res_result = db.query(query, disconnect=False)
    reserved_rooms = 0
    for reservation in res_result:
        reserved_rooms = reserved_rooms + reservation["room_count"]
    query = f'SELECT count FROM rooms_table WHERE (rooms_table.id_room = \"{data.get("id_room")}\");'
    result = db.query(query)
    if result[0]["count"] >= reserved_rooms + data.get("room_count"):
        return jsonify(True)
    else:
        return jsonify(False)


@app.route('/searchHotels', methods=['POST'])
def search_hotel():
    data = json.loads(request.get_data().decode('utf-8'))
    print(data)
    db = Connector()
    query = f'SELECT rooms_table.id_room, rooms_table.bed_count FROM hotels_table join rooms_table where {data.get("hotel_id")} = rooms_table.hotel_id;'
    rooms = db.query(query, disconnect=False)
    print(rooms)
    hotel_ok = False
    for room in rooms:
        room_count = round(int(data.get("adult_count"))/int(room["bed_count"]))
        query = f'SELECT * FROM reservation_table WHERE (reservation_table.id_room = \"{room["id_room"]}\") AND ' \
                f'(reservation_table.start_date BETWEEN \"{data.get("start_date")}\" AND \"{data.get("end_date")}\" OR ' \
                f'reservation_table.end_date BETWEEN \"{data.get("start_date")}\" AND \"{data.get("end_date")}\" OR ' \
                f'\"{data.get("start_date")}\" BETWEEN reservation_table.start_date AND reservation_table.end_date);'
        res_result = db.query(query, disconnect=False)
        print(res_result)
        reserved_rooms = 0
        for reservation in res_result:
            reserved_rooms = reserved_rooms + reservation["room_count"]
        query = f'SELECT count FROM rooms_table WHERE (rooms_table.id_room = \"{room["id_room"]}\");'
        result = db.query(query, disconnect=False)
        print(result, "\n")
        if result[0]["count"] >= reserved_rooms + room_count:
            hotel_ok = True
    if hotel_ok:
        return jsonify({"status": True})
    else:
        return jsonify({"status": False})

if __name__ == '__main__':
    try:
        app.run(debug=True, host=FLASK_HOST)
    except Exception as e:
        print(e, file=sys.stderr)
