from flask import Flask
from pymongo import MongoClient
from os import environ
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

# ======= DB Setup ==========
uri = environ.get('MONGODB_URI')
client = MongoClient(uri)
# db = client.get_default_database()
db_name = environ.get('MONGODB_DATABASE')
db = client.get_database(name=db_name)
# ===========================

# ======= Collections ==========
events = db.events
descriptions = db.descriptions
print('TESTING PRINTS')
print(uri)
print(db_name)
print('AHHHH')
for i in events.find():
    print(i)
for i in descriptions.find():
    print(i)
# =========================