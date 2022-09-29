from db import *
from datetime import datetime, timedelta
import calendar
import pymongo

def find_closest_date():
    date = events.aggregate(
        [{'$match': 
            {'date': 
                {'$gte': datetime.today(), 
                '$lte': datetime.today() + timedelta(days=30)
                }
            }
        },

        {'$project':
            {'eventName': 1,
            'calendar': 1,
            'color': 1,
            'date': 1,
            'date_dist': {'$abs': [{'$subtract': ["$date", datetime.now()]}]}
            }
        },

        {'$sort': {'date_dist': 1}},

        {'$limit': 1}]
    )
    for x in date:
        return x

def find_three_events():
    dates = descriptions.aggregate(
        [{'$match': 
            {'date': 
                {'$gte': datetime.today(), 
                '$lte': datetime.today() + timedelta(days=50)
                }
            }
        },
        {'$project':
            {'eventName': 1,
            'description': 1,
            'img': 1,
            'date': 1,
            'dt': 1,
            'date_dist': {'$abs': [{'$subtract': ["$date", datetime.now()]}]}
            }
        },

        {'$sort': {'date_dist': 1}},

        {'$limit': 3}]
    )
    return dates

def find_monthly_events(month_num):
    currentYear = datetime.now().year
    last_day_of_month = calendar.monthrange(currentYear, month_num)[1]
    print(last_day_of_month)
    data = descriptions.find({'date': {'$gte': datetime(currentYear, month_num, 1), '$lte': datetime(currentYear, month_num, last_day_of_month)}}).sort('date', pymongo.ASCENDING)
    return data