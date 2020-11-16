import pymongo
from pymongo import MongoClient
from bson.objectid import ObjectId

url = 'mongodb+srv://b33r:LrHpoFtRpBzoVDm8@cluster0.mzdpt.mongodb.net/opmdb?retryWrites=true&w=majority'
cluster = MongoClient(url)
db = cluster['opmdb']


def get_schedules():

    collection = db['schedule']
    count = collection.count_documents({})

    if count != 0:
        result = collection.find({}).sort('date', 1)
        return result
    else :
        return 'none'


def get_user_details(user_id):
    collection = db['users']
    user_details = collection.find_one({'_id': ObjectId(user_id)})
    return user_details


def post_token_and_pages(user_id, token, page_details):

    collection = db['users']
    collection.update_one({'_id': ObjectId(user_id)}, {'$set': {'fb_access_token': token}})
    collection.update_one({'_id': ObjectId(user_id)}, {'$set': {'page_details': page_details}})


def delete_schedule(schedule_id, ):

    try:
        collection = db['schedule']
        collection.delete_one({'_id': ObjectId(schedule_id)})

    except :
        print('nothing to delete')


def delete_all():
    collection = db['schedule']
    collection.delete_many({})




