import binascii
import hashlib
import uuid
import os


def hash_password(password):
    salt = hashlib.sha256(os.urandom(60)).hexdigest().encode('ascii')
    encoded_password = binascii.hexlify(hashlib.pbkdf2_hmac('sha512', password.encode('utf-8'), salt, 100000))
    return (salt + encoded_password).decode('ascii')


def verify_password(db_password, password):
    salt = db_password[:64]
    stored_password = db_password[64:]
    encoded_password = hashlib.pbkdf2_hmac('sha512', password.encode('utf-8'), salt.encode('ascii'), 100000)
    return binascii.hexlify(encoded_password).decode('ascii') == stored_password


def random_uuid():
    return str(uuid.uuid1())