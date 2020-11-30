import base64

from flask import Flask, request
from flask_restful import Api
from flask_cors import CORS

import json
import sys

from backend import FLASK_HOST
from backend.iisUtils import *

app = Flask(__name__)
cors = CORS(app, resources={r"*": {"origins": "*"}})
api = Api(app)


# Login and Registration
@app.route("/registration", methods=["POST"])
def registration():
    """
    Registration handler
    checks email validity, adds new user to database
    :return: status - msg for user, statusCode - error code
    """
    data = json.loads(request.get_data().decode("utf-8"))
    result = get_user_name_by_email(data.get("email"))
    if result:
        return jsonify(
            {
                "status": "Given email is already registered, please login",
                "statusCode": 300,
            }
        )
    else:
        try:
            user_id = register_user(
                data.get("name"),
                data.get("birth_date"),
                data.get("phone_number"),
                data.get("address"),
                data.get("email"),
            )
            register_password(user_id, data.get("password"))
            return jsonify(
                {"status": "Registration Successful, please log-in", "statusCode": 200}
            )
        except Exception as ex:
            print(ex)
            return jsonify(
                {
                    "status": "Registration Failed, please contact support",
                    "statusCode": 500,
                }
            )


@app.route("/login", methods=["POST"])
def login():
    """
    Login handler
    checks credentials validity
    :return: status - msg for user, statusCode - error code, cookie_id - unique session id
    """
    data = json.loads(request.get_data().decode("utf-8"))
    query = (
        f'SELECT uzivatel.id_user FROM uzivatel WHERE (email="{data.get("email")}");'
    )
    result = Connector().query(query)
    if not result:
        return jsonify({"status": "Email not found"})
    else:
        user_id = result[0].get("id_user")
        query = (
            f"SELECT password_table.password "
            f"FROM password_table "
            f'WHERE (id_user="{user_id}");'
        )
        result = Connector(secure=True).query(query)
        condition = verify_password(result[0].get("password"), data.get("password"))
        if condition:
            random_key = random_uuid()
            query = (
                f"INSERT INTO session_table(id_user, id_session) "
                f'VALUES ("{user_id}", "{random_key}");'
            )
            Connector().query(query, expecting_result=False)
            return jsonify(
                {
                    "status": "Login Successful",
                    "status_code": 200,
                    "cookie_id": random_key,
                }
            )
        else:
            return jsonify({"status": "Login not successful"})


# User account management functions
@app.route("/account", methods=["POST"])
def account():
    """
    Account information handler
    :return: user data from database
    """
    data = json.loads(request.get_data().decode("utf-8"))
    query = (
        f"SELECT uzivatel.name, uzivatel.email, uzivatel.phone_number, uzivatel.address, uzivatel.birth_date, uzivatel.role "
        f"FROM uzivatel NATURAL JOIN session_table "
        f'WHERE (session_table.id_session = "{data.get("CookieUserID")}");'
    )
    result = Connector().query(query)
    if result:
        for key in result[0]:
            result[0][key] = serialize_string(result[0][key])
        return jsonify(result[0])
    else:
        return jsonify([])


@app.route("/getUserName", methods=["POST"])
def get_user_name():
    """
    User name handler
    :return: user name
    """
    db = Connector()
    data = json.loads(request.get_data().decode("utf-8"))
    query = (
        f"SELECT uzivatel.name "
        f"FROM uzivatel NATURAL JOIN session_table "
        f'WHERE (session_table.id_session = "{data.get("CookieUserID")}");'
    )
    result = db.query(query)
    if result:
        return jsonify(result[0])
    return "Username"


@app.route("/getUserRole", methods=["POST"])
def get_role():
    """
    User role handler
    :return: user role
    """
    data = json.loads(request.get_data().decode("utf-8"))
    return jsonify(get_user_role(data.get("CookieUserID")))


@app.route("/updateAccount", methods=["POST"])
def update_account():
    """
    Update account handler
    :return: message for user
    """
    data = json.loads(request.get_data().decode("utf-8"))
    try:
        result = get_user_id_by_session(data.get("CookieUserID"))[0]
    except IndexError:
        result = dict()
    try:
        update_user(
            data.get("name"),
            data.get("email"),
            data.get("phone_number"),
            data.get("birth_date"),
            data.get("address"),
            result.get("id_user"),
        )
        return jsonify("User information updated successfully.")
    except Exception as ex:
        print(ex)
        return jsonify("Update failed, please contact support.")


# Administrators user management functions
@app.route("/getUsers", methods=["POST"])
def get_users():
    """
    Get users handler
    :return: List of existing users
    """
    if request.method == "POST":
        db = Connector()
        data = json.loads(request.get_data().decode("utf-8"))
        query = (
            f"SELECT uzivatel.role "
            f"FROM uzivatel NATURAL JOIN session_table "
            f'WHERE (session_table.id_session = "{data.get("CookieUserID")}");'
        )
        result = db.query(query, disconnect=False)
        if result and result[0]["role"] == 0:
            result = db.query("SELECT * FROM uzivatel WHERE role != 0;")
            for user in result:
                for key in user:
                    user[key] = serialize_string(user[key])
            return jsonify(result)
        else:
            return jsonify(False)


@app.route("/updateUser", methods=["POST"])
def update_user_request():
    """
    Update user handler
    :return: message for user
    """
    data = json.loads(request.get_data().decode("utf-8"))
    try:
        query = (
            f"UPDATE uzivatel "
            f'SET name = "{data.get("name")}", '
            f'email = "{data.get("email")}", '
            f'phone_number = "{data.get("phone_number")}", '
            f'address = "{data.get("address")}", '
            f'role = "{data.get("role")}" '
            f'WHERE (id_user = "{data.get("id_user")}");'
        )
        if data.get("birth_date") is not None:
            query = (
                f"UPDATE uzivatel "
                f'SET name = "{data.get("name")}", '
                f'email = "{data.get("email")}", '
                f'phone_number = "{data.get("phone_number")}", '
                f'address = "{data.get("address")}", '
                f'role = "{data.get("role")}", '
                f'birth_date = "{data.get("birth_date")}" '
                f'WHERE (id_user = "{data.get("id_user")}");'
            )
        Connector().query(query, expecting_result=False)
        return jsonify("User information updated successfully.")
    except Exception as ex:
        print(ex)
        return jsonify("User information update has failed, please contact support.")


@app.route("/removeUser", methods=["POST"])
def remove_user():
    """
    Remove user handler
    :return: message for user
    """
    data = json.loads(request.get_data().decode("utf-8"))
    query = f'DELETE FROM uzivatel WHERE id_user = "{data.get("id_user")}";'
    try:
        Connector().query(query, expecting_result=False)
        return jsonify("User removed successfully.")
    except Exception as ex:
        print(ex)
        return jsonify("User removal successfully has failed, please contact support.")


# Image functions
@app.route("/upload/<user_id>", methods=["POST"])
def upload_user_image(user_id):
    """
    Upload User profile photo handler
    :return: message for user
    """
    file = request.files["file"]
    try:
        user_id_res = get_user_id_by_session(user_id)[0]
        if file:
            save_image(file, user_id=user_id_res.get("id_user"))
        return jsonify("Profile photo successfully uploaded")
    except Exception as ex:
        print(ex)
        return jsonify("Profile photo upload has failed, , please contact support.")


@app.route("/getProfileImage", methods=["POST"])
def get_profile_image():
    """
    User profile photo handler
    :return: message for user
    """
    data = json.loads(request.get_data().decode("utf-8"))
    try:
        user_id_res = get_user_id_by_session(data.get("CookieUserID"))[0]
        img_file = USERS_PATH + str(user_id_res.get("id_user")) + IMG_EXTENSION
    except IndexError:
        img_file = DEFAULT_IMG
    if not os.path.isfile(img_file):
        img_file = DEFAULT_IMG
    with open(img_file, "rb") as f:
        im_b64 = base64.b64encode(f.read())
    return im_b64


@app.route("/uploadHotelImg/<id_hotel>", methods=["POST"])
def upload_hotel_image(id_hotel):
    """
    Upload hotel photo handler
    :return: image in base64 encoding
    """
    file = request.files["file"]
    if file:
        save_image(file, hotel_id=id_hotel)
    return jsonify("ok")


@app.route("/getHotelImage", methods=["POST"])
def get_hotel_image():
    """
    Hotel photo handler
    :return: image in base64 encoding
    """
    data = json.loads(request.get_data().decode("utf-8"))
    img_file = HOTELS_PATH + str(data.get("hotel_id")) + IMG_EXTENSION
    if not os.path.isfile(img_file):
        img_file = DEFAULT_IMG
    with open(img_file, "rb") as f:
        im_b64 = base64.b64encode(f.read())
    return im_b64


@app.route("/uploadRoomImg/<room_id>", methods=["POST"])
def upload_room_image(room_id):
    """
    Upload room photo handler
    :return: image in base64 encoding
    """
    try:
        file = request.files["file"]
        id_hotel = room_id.split("_")[0]
        room_id = room_id.split("_")[1]
        if file:
            save_image(file, hotel_id=id_hotel, room_id=room_id)
    except IndexError:
        return jsonify("not ok")
    return jsonify("ok")


@app.route("/getRoomImage", methods=["POST"])
def get_room_image():
    """
    Room photo handler
    :return: image in base64 encoding
    """
    data = json.loads(request.get_data().decode("utf-8"))
    hotel_id = data.get("hotel_id")
    if not data.get("hotel_id"):
        hotel_id = hotel_id_by_room(data.get("id_room"))
    img_file = (
        HOTELS_PATH + str(hotel_id) + "/" + str(data.get("id_room")) + IMG_EXTENSION
    )
    if not os.path.isfile(img_file):
        img_file = DEFAULT_IMG
    with open(img_file, "rb") as f:
        im_b64 = base64.b64encode(f.read())
    return im_b64


# Hotel functions
@app.route("/getHotels", methods=["GET"])
def get_available_hotels():
    """
    Hotels handler
    :return: hotels data
    """
    query = (
        f"SELECT hotels_table.*, MIN(rooms_table.price_night) AS price_night FROM "
        f"hotels_table JOIN rooms_table WHERE hotels_table.hotel_id = rooms_table.hotel_id AND "
        f"hotels_table.is_available = 1 and rooms_table.is_available = 1 "
        f"GROUP BY hotels_table.hotel_id;"
    )
    hotels = Connector().query(query)
    for hotel in hotels:
        for key in hotel:
            hotel[key] = serialize_string(hotel[key])
    return jsonify(hotels)


@app.route("/getHotelsAdmin", methods=["GET"])
def get_hotels_admin():
    """
    Hotels management handler
    :return: all hotels data
    """
    query = f"SELECT * FROM hotels_table;"
    hotels = Connector().query(query)
    for hotel in hotels:
        for key in hotel:
            hotel[key] = serialize_string(hotel[key])
    return jsonify(hotels)


@app.route("/getHotel", methods=["POST"])
def get_hotels():
    """
    Hotel management handler
    :return: hotel data by id
    """
    data = json.loads(request.get_data().decode("utf-8"))
    query = f'SELECT * FROM hotels_table WHERE (hotel_id = "{data.get("hotel_id")}" );'
    hotel = Connector().query(query)
    if hotel:
        for key in hotel[0]:
            hotel[key] = serialize_string(hotel[key])
        return jsonify(hotel)


@app.route("/removeHotel", methods=["POST"])
def remove_hotel():
    """
    Remove hotel handler
    :return:
    """
    data = json.loads(request.get_data().decode("utf-8"))
    img_file = HOTELS_PATH + str(data.get("hotel_id")) + IMG_EXTENSION
    if os.path.exists(img_file):
        os.remove(img_file)
    query = f'DELETE FROM hotels_table WHERE hotel_id = "{data.get("hotel_id")}";'
    return jsonify(Connector().query(query, expecting_result=False))


@app.route("/isHotelReserved", methods=["POST"])
def is_hotel_reserved():
    """
    Hotel reservation checker
    :return: status if hotel has rooms which are reserved
    """
    data = json.loads(request.get_data().decode("utf-8"))
    query = f'SELECT reservation_table.* FROM reservation_table JOIN rooms_table ON reservation_table.id_room = rooms_table.id_room JOIN hotels_table ON rooms_table.hotel_id = hotels_table.hotel_id WHERE hotels_table.hotel_id = "{data.get("hotel_id")}" AND reservation_table.end_date > NOW();'
    reserved = Connector().query(query)
    if not reserved:
        return jsonify({"status": False})
    else:
        return jsonify({"status": True})


@app.route("/addHotel", methods=["POST"])
def add_hotel():
    """
    Add hotel handler
    :return: new hotel id
    """
    db = Connector()
    data = json.loads(request.get_data().decode("utf-8"))
    rating = 0
    if data.get("rating") is not None:
        rating = data.get("rating")
    query = (
        f"INSERT INTO hotels_table "
        f"(name, description, category, address, email, phone_number, rating, free_cancellation, no_prepayment, "
        f"free_wifi, gym, spa, swimming_pool, is_available) "
        f'VALUES ("{data.get("name")}", "{data.get("description")}", "{data.get("category")}", '
        f'"{data.get("address")}", "{data.get("email")}", "{data.get("phone_number")}", '
        f'{rating}, {data.get("free_cancellation")}, {data.get("no_prepayment")}, '
        f'{data.get("free_wifi")}, {data.get("gym")}, {data.get("spa")}, {data.get("swimming_pool")}, {data.get("is_available")});'
    )
    db.query(query, expecting_result=False, disconnect=False)
    return jsonify(str(db.get_last_row_id()))


@app.route("/editHotel", methods=["POST"])
def edit_hotel():
    """
    Edit hotel handler
    :return: message for user
    """
    data = json.loads(request.get_data().decode("utf-8"))
    rating = 0
    if data.get("rating") is not None:
        rating = data.get("rating")
    query = (
        f"UPDATE hotels_table "
        f'SET name = "{data.get("name")}", '
        f'description = "{data.get("description")}", '
        f'address = "{data.get("address")}", '
        f'email = "{data.get("email")}", '
        f'phone_number = "{data.get("phone_number")}", '
        f"rating = {rating}, "
        f'category = "{data.get("category")}", '
        f'free_cancellation = {data.get("free_cancellation")}, '
        f'no_prepayment = {data.get("no_prepayment")}, '
        f'free_wifi = {data.get("free_wifi")}, '
        f'gym = {data.get("gym")}, '
        f'spa = {data.get("spa")}, '
        f'swimming_pool = {data.get("swimming_pool")}, '
        f'is_available = {data.get("is_available")} '
        f'WHERE (hotel_id = "{data.get("hotel_id")}");'
    )
    try:
        Connector().query(query, expecting_result=False)
        return jsonify("Hotel update successful")
    except Exception as ex:
        print(ex)
        return jsonify("Hotel update successful")


# Room functions
@app.route("/getHotelRooms", methods=["POST"])
def get_room_by_hotel_id():
    """
    Rooms by hotel id handler
    :return: Rooms list for requested hotel (only available rooms)
    """
    data = json.loads(request.get_data().decode("utf-8"))
    query = f'SELECT * FROM rooms_table WHERE rooms_table.hotel_id = "{data.get("hotel_id")}" and rooms_table.is_available = 1;'
    rooms = Connector().query(query)
    for room in rooms:
        for key in room:
            room[key] = serialize_string(room[key])
    return jsonify(rooms)


@app.route("/getHotelRoomsAdmin", methods=["POST"])
def get_room_by_hotel_id_admin():
    """
    Rooms by hotel id handler
    :return: Rooms list for requested hotel
    """
    data = json.loads(request.get_data().decode("utf-8"))
    query = f'SELECT * FROM rooms_table WHERE rooms_table.hotel_id = "{data.get("hotel_id")}";'
    rooms = Connector().query(query)
    for room in rooms:
        for key in room:
            room[key] = serialize_string(room[key])
    return jsonify(rooms)


@app.route("/getRoom", methods=["POST"])
def get_room():
    """
    Room information handler
    :return: room info requested by id
    """
    data = json.loads(request.get_data().decode("utf-8"))
    query = f'SELECT * FROM rooms_table WHERE id_room = "{data.get("id_room")}";'
    room = Connector().query(query)
    if room:
        for key in room[0]:
            room[key] = serialize_string(room[key])
        return jsonify(room)


@app.route("/removeRoom", methods=["POST"])
def remove_room():
    """
    Remove room by id handler
    :return:
    """
    data = json.loads(request.get_data().decode("utf-8"))
    hotel_id = data.get("hotel_id")
    if not data.get("hotel_id"):
        hotel_id = hotel_id_by_room(data.get("id_room"))
    img_file = (
        HOTELS_PATH + str(hotel_id) + "/" + str(data.get("id_room")) + IMG_EXTENSION
    )
    if os.path.exists(img_file):
        os.remove(img_file)
    query = f'DELETE FROM rooms_table WHERE id_room={data.get("id_room")};'
    return jsonify(Connector().query(query, expecting_result=False))


@app.route("/isRoomReserved", methods=["POST"])
def is_room_reserved():
    """
    Room reservation checker
    :return: status if room is reserved
    """
    data = json.loads(request.get_data().decode("utf-8"))
    query = f'SELECT reservation_table.* FROM reservation_table JOIN rooms_table ON reservation_table.id_room = rooms_table.id_room WHERE rooms_table.hotel_id = "{data.get("id_room")}" AND reservation_table.end_date > NOW();'
    reserved = Connector().query(query)
    if not reserved:
        return jsonify({"status": False})
    else:
        return jsonify({"status": True})



@app.route("/addRoom", methods=["POST"])
def add_room():
    """
    Add room handler
    :return: new room id
    """
    db = Connector()
    data = json.loads(request.get_data().decode("utf-8"))
    room_size = 0
    if data.get("room_size"):
        room_size = data.get("room_size")
    query = (
        f"INSERT INTO rooms_table (hotel_id, name, bed_count, category, description, room_size, "
        f"price_night, bed_type, free_breakfast, is_available, count, pre_price) "
        f'VALUES ({data.get("hotel_id")}, "{data.get("name")}", "{data.get("bed_count")}", '
        f'"{data.get("category")}", "{data.get("description")}", "{room_size}", '
        f'"{data.get("price_night")}", "{data.get("bed_type")}", "{data.get("free_breakfast")}", '
        f'"{data.get("is_available")}", '
        f'"{data.get("count")}", {data.get("pre_price")});'
    )
    db.query(query, expecting_result=False, disconnect=False)
    return jsonify(str(db.get_last_row_id()))


@app.route("/editRoom", methods=["POST"])
def edit_room():
    """
    Edit room handler
    :return: message for user
    """
    data = json.loads(request.get_data().decode("utf-8"))
    query = (
        f"UPDATE rooms_table "
        f'SET name = "{data.get("name")}", '
        f'description = "{data.get("description")}", '
        f'bed_count = "{data.get("bed_count")}", '
        f'room_size = "{data.get("room_size")}", '
        f'price_night = "{data.get("price_night")}", '
        f'free_breakfast = "{data.get("free_breakfast")}", '
        f'is_available = "{data.get("is_available")}", '
        f'pre_price = "{data.get("pre_price")}" '
        f'WHERE (id_room = "{data.get("id_room")}");'
    )
    try:
        Connector().query(query, expecting_result=False)
        return jsonify("Room update successful")
    except Exception as ex:
        print(ex)
        return jsonify("Room update successful")



# Booking functions
@app.route("/bookRoom", methods=["POST"])
def book_room():
    """
    Room booking handler (registered user)
    :return: message for user
    """
    data = json.loads(request.get_data().decode("utf-8"))
    query = (
        f"SELECT id_user "
        f"FROM uzivatel NATURAL JOIN session_table "
        f'WHERE (session_table.id_session = "{data.get("CookieUserID")}");'
    )
    try:
        id_user = Connector().query(query)[0]["id_user"]
        calculate_price_and_book(data, id_user)
        return jsonify("Reservation completed")
    except Exception as ex:
        print(ex)
        return jsonify("Reservation failed")


@app.route("/nonRegBooking", methods=["POST"])
def non_reg_booking():
    """
    Room booking handler (without registration)
    :return: message for user
    """
    data = json.loads(request.get_data().decode("utf-8"))
    return register_before_booking(data, register=False)


@app.route("/regBooking", methods=["POST"])
def reg_booking():
    """
    Room booking handler (with registration)
    :return: message for user
    """
    data = json.loads(request.get_data().decode("utf-8"))
    return register_before_booking(data, register=True)


@app.route("/getBookings", methods=["POST"])
def get_bookings():
    """
    Get all users bookings handler (logged-in user)
    :return: bookings list
    """
    if request.method == "POST":
        db = Connector()
        data = json.loads(request.get_data().decode("utf-8"))
        query = (
            f"SELECT hotels_table.hotel_id, hotels_table.free_cancellation, uzivatel.*, reservation_table.*, "
            f"rooms_table.name as room_name, hotels_table.name as hotel_name "
            f"FROM session_table NATURAL JOIN uzivatel NATURAL JOIN reservation_table "
            f"JOIN rooms_table ON reservation_table.id_room=rooms_table.id_room "
            f"JOIN hotels_table ON rooms_table.hotel_id=hotels_table.hotel_id "
            f'WHERE (session_table.id_session = "{data.get("CookieUserID")}");'
        )
        bookings = db.query(query, disconnect=False)
        for booking in bookings:
            for key in booking:
                booking[key] = serialize_string(booking[key])
        return jsonify(bookings)


@app.route("/getAllBookings", methods=["POST"])
def get_all_bookings():
    """
    Get all bookings handler (administrator/reception)
    :return: bookings list
    """
    if request.method == "POST":
        db = Connector()
        data = json.loads(request.get_data().decode("utf-8"))
        role = int(get_user_role(data.get("CookieUserID"))["role"])
        if role < 4:
            query = (
                f"SELECT uzivatel.*, reservation_table.*, rooms_table.name AS room_name, hotels_table.name AS hotel_name "
                f"FROM uzivatel NATURAL JOIN reservation_table "
                f"JOIN rooms_table ON reservation_table.id_room=rooms_table.id_room "
                f"JOIN hotels_table ON rooms_table.hotel_id=hotels_table.hotel_id;"
            )
            bookings = db.query(query, disconnect=False)
            for booking in bookings:
                for key in booking:
                    booking[key] = serialize_string(booking[key])
            return jsonify(bookings)
        else:
            return jsonify([])


@app.route("/removeBooking", methods=["POST"])
def remove_booking():
    """
    Remove booking handler
    :return: message for user
    """
    data = json.loads(request.get_data().decode("utf-8"))
    query = (
        f"DELETE FROM reservation_table "
        f'WHERE id_reservation={data.get("id_reservation")};'
    )
    try:
        Connector().query(query, expecting_result=False)
        return jsonify("Booking removed successfully.")
    except Exception as ex:
        print(ex)
        return jsonify("Booking removal has failed.")


@app.route("/updateBooking", methods=["POST"])
def update_booking():
    """
    Update booking handler
    :return: message for user
    """
    db = Connector()
    data = json.loads(request.get_data().decode("utf-8"))
    query = (
        f"UPDATE reservation_table "
        f'SET check_in = "{data.get("check_in")}", '
        f'check_out = "{data.get("check_out")}", '
        f'approved = "{data.get("approved")}" '
        f'WHERE id_reservation="{data.get("id_reservation")}";'
    )
    try:
        db.query(query, expecting_result=False)
        return jsonify("Booking updated successfully.")
    except Exception as ex:
        print(ex)
        return jsonify("Booking update has failed.")


# Search and availability function
@app.route("/checkDates", methods=["POST"])
def check_dates():
    """
    Check availability in date range handler
    :return: available
    """
    data = json.loads(request.get_data().decode("utf-8"))
    reserved_rooms_count = get_room_reservation_count(
        data.get("id_room"), data.get("start_date"), data.get("end_date")
    )
    total_room_count = int(get_total_room_count(data.get("id_room"))["count"])
    if total_room_count >= reserved_rooms_count + int(data.get("room_count")):
        return jsonify({"available": True})
    else:
        return jsonify({"available": False})


@app.route("/searchHotels", methods=["POST"])
def search_hotel():
    """
    Check availability in date range handler from search action
    :return: available
    """
    data = json.loads(request.get_data().decode("utf-8"))
    if data.get("filter") == "":
        query = (
            f"SELECT rooms_table.id_room, rooms_table.bed_count FROM "
            f"hotels_table JOIN rooms_table ON hotels_table.hotel_id = rooms_table.hotel_id "
            f'WHERE rooms_table.hotel_id = "{data.get("hotel_id")}";'
        )
    else:
        query = (
            f"SELECT hotels_table.name, rooms_table.id_room, rooms_table.bed_count FROM "
            f"hotels_table JOIN rooms_table ON hotels_table.hotel_id = rooms_table.hotel_id "
            f'WHERE rooms_table.hotel_id = "{data.get("hotel_id")}" AND (LOWER(hotels_table.name) '
            f'LIKE LOWER("%{data.get("filter")}%") OR LOWER(hotels_table.address) '
            f'LIKE LOWER("%{data.get("filter")}%"));'
        )
    rooms = Connector().query(query)
    hotel_available = False
    for count, room in enumerate(rooms):
        wanted_room_count = round(int(data.get("adult_count")) / int(room["bed_count"]))
        reserved_rooms_count = get_room_reservation_count(
            room["id_room"], data.get("start_date"), data.get("end_date")
        )
        total_room_count = int(get_total_room_count(room["id_room"])["count"])
        if total_room_count >= reserved_rooms_count + wanted_room_count:
            hotel_available = True
    if hotel_available:
        return jsonify({"available": True})
    else:
        return jsonify({"available": False})


if __name__ == "__main__":
    try:
        app.run(debug=True, host=FLASK_HOST)
    except Exception as e:
        print(e, file=sys.stderr)
