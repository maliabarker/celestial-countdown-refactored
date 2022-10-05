from flask import Flask
from pymongo import MongoClient
from os import environ
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

# ======= DB Setup ==========
uri = environ.get('MONGODB_URI')
client = MongoClient(uri)
db = client.get_default_database()
# ===========================

# ======= Collections ==========
events = db.events
descriptions = db.descriptions
# =========================