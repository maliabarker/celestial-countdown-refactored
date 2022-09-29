from flask import render_template, request
import json
import pytz
from timezonefinder import TimezoneFinder
from geopy.geocoders import Nominatim
from datetime import datetime
import calendar

from db import *
from extensions import find_closest_date, find_three_events, find_monthly_events

geolocator = Nominatim(user_agent="geoapiExercises")
obj = TimezoneFinder()

@app.route('/', methods=['GET', 'POST'])
def index():
    current_month = datetime.now().month

    event = find_closest_date()
    events_desc = find_three_events()

    dt = event['date']
    time = dt.strftime("%b %d, %Y %X")
    jstime = dt.strftime("%m/%d/")
    json_str = json.dumps(jstime)
    
    city = "San Francisco"
    location = geolocator.geocode(city)
    obj = TimezoneFinder()
    result = obj.timezone_at(lng=location.longitude, lat=location.latitude)

    timezone = pytz.timezone(result)
    d_aware = timezone.localize(dt)
    event_time = d_aware.strftime("%B %d, %Y %Z")
    converted_result = result.replace("_", " ")
    print(converted_result)
    json_tz_str = json.dumps(result)

    if request.method == 'POST':
        city = request.form.get('city')
        location = geolocator.geocode(city)
        obj = TimezoneFinder()
        result = obj.timezone_at(lng=location.longitude, lat=location.latitude)
        timezone = pytz.timezone(result)
        d_aware = timezone.localize(dt)
        event_time = d_aware.strftime("%B %d, %Y %Z")
        converted_result = result.replace("_", " ")
        json_tz_str = json.dumps(result)

    return render_template('index.html', time=time, event=event, json_str=json_str, events_desc=events_desc, city=city, lat=location.latitude, lon=location.longitude, tz=converted_result, event_time=event_time, json_tz_str=json_tz_str, current_month=current_month)

@app.route('/calendar')
def calendar_index():
    current_month = datetime.now().month
    return render_template('calendar.html', current_month=current_month)

@app.route('/<month>/events')
def monthly_events_index(month):
    month_name = calendar.month_name[int(month)]
    events = find_monthly_events(int(month))
    return render_template('events.html', events=events, month=month_name, months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'])

if __name__ == '__main__':
    app.run(port=5001, debug=True)