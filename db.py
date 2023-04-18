from flask import Flask
from pymongo import MongoClient
from os import environ
from config import Config
from geopy import geocoders

app = Flask(__name__)
app.config.from_object(Config)

# ======= GeoPy Setup ==========
api_key = environ.get('GEOCODE_API_KEY')
geolocator = geocoders.OpenCage(api_key=api_key)

# ======= DB Setup ==========
uri = environ.get('MONGODB_URI')
client = MongoClient(uri)
db_name = environ.get('MONGODB_DATABASE')
db = client.get_database(name=db_name)
# ===========================

# ======= Collections ==========
events = db.events
descriptions = db.descriptions
# =========================