from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime as dt


class OpmDb:
    def __init__(self, cluster = None):
        self.host = "localhost"
        self.port = 27017
        self.cluster = cluster

        if self.cluster is not None:
            client = MongoClient(self.cluster)
        else:
            client = MongoClient(host= self.host, port= self.port)
        
        self.db = client['opmdb']
    
    def now_time(self):
        return str(dt.now()).split('.')[0][:-3]
    
    def get_schedules(self):

        schedules = self.db['schedule']
        count = schedules.count_documents({})

        if count != 0:
            result = schedules.find({
            'date' : {'$lte' : self.now_time()}
            })
            return result
        else:
            return False

    def get_user_details(self, user_id):
        users = self.db['users']
        user_details = users.find_one({'_id': ObjectId(user_id)})
        return user_details

    def delete_schedule(self, schedule_id, ):

        schedules = self.db['schedule']
        schedules.delete_one({'_id': ObjectId(schedule_id)})
