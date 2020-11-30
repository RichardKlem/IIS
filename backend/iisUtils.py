import binascii
import hashlib
import uuid
import os
import datetime

from PIL import Image
from flask import jsonify

from backend.databaseConnector import Connector

HOTELS_PATH = os.getcwd() + "/static/hotels/"
USERS_PATH = os.getcwd() + "/static/users/"
DEFAULT_IMG = os.getcwd() + "/static/default.png"
IMG_EXTENSION = ".jpg"
IMG_FORMAT = "JPEG"
COLOR_FILTER = "RGB"
IMG_QUALITY = 60
IMG_SIZE = (250, 250)


def hash_password(password):
    salt = hashlib.sha256(os.urandom(60)).hexdigest().encode("ascii")
    encoded_password = binascii.hexlify(
        hashlib.pbkdf2_hmac("sha512", password.encode("utf-8"), salt, 100000)
    )
    return (salt + encoded_password).decode("ascii")


def verify_password(db_password, password):
    salt = db_password[:64]
    stored_password = db_password[64:]
    encoded_password = hashlib.pbkdf2_hmac(
        "sha512", password.encode("utf-8"), salt.encode("ascii"), 100000
    )
    return binascii.hexlify(encoded_password).decode("ascii") == stored_password


def random_uuid():
    return str(uuid.uuid1())


def save_image(file, hotel_id=None, room_id=None, user_id=None):
    im = Image.open(file)
    im.thumbnail(IMG_SIZE, Image.ANTIALIAS)
    im = im.convert(COLOR_FILTER)
    if room_id:
        path = HOTELS_PATH + str(hotel_id) + "/" + str(room_id)
    elif user_id:
        path = USERS_PATH + str(user_id)
    else:
        path = HOTELS_PATH + str(hotel_id)
    
    folder_path = ""
    for folder in path.split("/")[:-1]:
        folder_path = folder_path + "/" + folder
    if not os.path.isdir(folder_path):
        os.makedirs(folder_path)
    im.save(path + IMG_EXTENSION, IMG_FORMAT, quality=IMG_QUALITY)


def serialize_string(data):
    if data and isinstance(data, datetime.date):
        return data.strftime("%Y-%m-%d")
    elif (data == "None") or (data is None):
        return ""
    else:
        return data


def calculate_price_and_book(data, id_user):
    db = Connector()
    query = (
        f"SELECT price_night, pre_price "
        f"FROM rooms_table "
        f'WHERE (rooms_table.id_room = "{data.get("id_room")}");'
    )
    prices = db.query(query, disconnect=False)[0]
    price_per_night = prices["price_night"]
    pre_price_per_night = prices["pre_price"]
    start_date = datetime.datetime.strptime(data.get("start_date"), "%Y-%m-%d")
    end_date = datetime.datetime.strptime(data.get("end_date"), "%Y-%m-%d")
    total_price = (
        int((end_date - start_date).days)
        * int(price_per_night)
        * int(data.get("room_count"))
    )
    total_pre_price = (
        int((end_date - start_date).days)
        * int(pre_price_per_night)
        * int(data.get("room_count"))
    )
    query = (
        f"INSERT INTO reservation_table (id_user, id_room, start_date, end_date, "
        f"adult_count, room_count, total_price, approved, pre_price) "
        f'VALUES ({id_user}, {data.get("id_room")}, "{data.get("start_date")}", "{data.get("end_date")}", '
        f'{data.get("adult_count")}, {data.get("room_count")}, {total_price}, '
        f'{data.get("approved")}, {total_pre_price});'
    )
    db.query(query, expecting_result=False, disconnect=False)



def register_before_booking(data, register):
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
            id_user = register_user(
                data.get("name"),
                data.get("birth_date"),
                data.get("phone_number"),
                data.get("address"),
                data.get("email"),
            )
            if register:
                register_password(id_user, data.get("password"))
            calculate_price_and_book(data, id_user)
        except Exception as ex:
            print(ex)
            return jsonify(
                {"status": "Booking Failed, please contact support", "statusCode": 500}
            )
        return jsonify({"status": "Booking completed", "statusCode": 200})


def get_room_reservation_count(id_room, start_date, end_date):
    if not id_room or not start_date or not end_date:
        return 0
    query = (
        f'SELECT reservation_table.room_count FROM reservation_table WHERE (reservation_table.id_room = "{id_room}") AND '
        f'(reservation_table.start_date BETWEEN "{start_date}" AND "{end_date}" OR '
        f'reservation_table.end_date BETWEEN "{start_date}" AND "{end_date}" OR '
        f'"{start_date}" BETWEEN reservation_table.start_date AND reservation_table.end_date);'
    )
    reservations = Connector().query(query)
    r_rooms_count = 0
    for reservation in reservations:
        r_rooms_count = r_rooms_count + reservation["room_count"]
    return int(r_rooms_count)


def get_total_room_count(id_room):
    query = f'SELECT count FROM rooms_table WHERE (rooms_table.id_room = "{id_room}");'
    return Connector().query(query)[0]


def get_user_role(session_key):
    query = (
        f"SELECT uzivatel.role "
        f"FROM uzivatel NATURAL JOIN session_table "
        f'WHERE (session_table.id_session = "{session_key}");'
    )
    return Connector().query(query)[0]


def get_user_name_by_email(email):
    query = f"SELECT uzivatel.name " f"FROM uzivatel WHERE " f'(email = "{email}");'
    return Connector().query(query)


def get_user_id_by_session(session_key):
    query = (
        f"SELECT uzivatel.id_user "
        f"FROM uzivatel NATURAL JOIN session_table "
        f'WHERE (session_table.id_session = "{session_key}");'
    )
    return Connector().query(query)


def register_user(name, birth_date, phone_number, address, email):
    query = (
        f"INSERT INTO uzivatel(name, phone_number, address, email) VALUES ("
        f'"{name}", '
        f'"{phone_number}", '
        f'"{address}", '
        f'"{email}");'
    )
    if birth_date is not None:
        query = (
            f"INSERT INTO uzivatel(name, birth_date, phone_number, address, email) VALUES ("
            f'"{name}", '
            f'"{birth_date}", '
            f'"{phone_number}", '
            f'"{address}", '
            f'"{email}");'
        )
    db = Connector()
    db.query(query, expecting_result=False, disconnect=False)
    return db.get_last_row_id()


def register_password(user_id, password):
    query = (
        f"INSERT INTO password_table "
        f'VALUES ({user_id}, "{hash_password(password)}");'
    )
    Connector().query(query, expecting_result=False)


def hotel_id_by_room(room_id):
    query = f'SELECT hotel_id FROM rooms_table WHERE id_room = "{room_id}";'
    hotel_id = Connector().query(query)[0]
    return hotel_id.get("hotel_id")


def update_user(name, email, phone_number, birth_date, address, id_user):
    query = (
        f"UPDATE uzivatel "
        f'SET name = "{name}", '
        f'email = "{email}", '
        f'phone_number = "{phone_number}", '
        f'address = "{address}" '
        f'WHERE (id_user = "{id_user}");'
    )
    if birth_date is not None:
        query = (
            f"UPDATE uzivatel "
            f'SET name = "{name}", '
            f'email = "{email}", '
            f'phone_number = "{phone_number}", '
            f'address = "{address}", '
            f'birth_date = "{birth_date}" '
            f'WHERE (id_user = "{id_user}");'
        )
    Connector().query(query, expecting_result=False)
