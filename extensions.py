from db import *
from datetime import datetime, timedelta
import calendar
import pymongo

# def fix_dates():
#     for doc in db.events.find():
#         if isinstance(doc['date'], str):
#             new_date = datetime.fromisoformat(doc['date'])
#             db.events.update_one({'_id': doc['_id']}, {'$set': {'date': new_date}})
   
#     for doc in db.descriptions.find():
#         if isinstance(doc['date'], str):
#             new_date = datetime.fromisoformat(doc['date'])
#             db.descriptions.update_one({'_id': doc['_id']}, {'$set': {'date': new_date}})
    
#     print('DONE')



def find_closest_date():
    date = events.aggregate(
        [
            {
                '$match': {
                    'date': {'$gte': datetime.today()}
                }
            },
            {
                '$addFields': {
                    'date_dist': {'$abs': [{'$subtract': ["$date", datetime.now()]}]}
                }
            },
            {'$sort': {'date_dist': 1}},
            {'$limit': 1}
        ]
    )
    for x in date:
        return x

def find_three_events():
    dates = descriptions.aggregate(
        [
            {
                '$match': {
                    'date': {'$gte': datetime.today()}
                }
            },
            {
                '$addFields': {
                    'date_dist': {'$abs': [{'$subtract': ["$date", datetime.now()]}]}
                }
            },
            {'$sort': {'date_dist': 1}},
            {'$limit': 3}
        ]
    )
    return dates

def find_monthly_events(month_num):
    currentYear = datetime.now().year
    last_day_of_month = calendar.monthrange(currentYear, month_num)[1]
    print(last_day_of_month)
    data = descriptions.find({'date': {'$gte': datetime(currentYear, month_num, 1), '$lte': datetime(currentYear, month_num, last_day_of_month)}}).sort('date', pymongo.ASCENDING)
    return data