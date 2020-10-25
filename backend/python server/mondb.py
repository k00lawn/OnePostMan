import pymongo
from pymongo import MongoClient


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
        error = 'none'
        return error


def get_user_details(user_id):
    collection = db['user_details']
    user_details = collection.find_one({'user_id' : user_id})
    return user_id


def post_pages(token,page_details):

    collection = db['user_details']
    collection.update_one({'fb_access_token' : token} , {'page_details' : page_details})


def delete_schedule(user_id):

    try:
        collection = db['schedule']
        collection.delete_one({'user_id': user_id})
    except :
        print('nothing to delete')


def delete_all():
    collection = db['schedule']
    collection.delete_many({})
    collection = db['posts']
    collection.delete_many({})