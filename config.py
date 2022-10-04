from json import load
from dotenv import load_dotenv
import os

load_dotenv()

class Config(object):
    """Set environment variables"""
    SECRET_KEY = os.getenv("SECRET_KEY")