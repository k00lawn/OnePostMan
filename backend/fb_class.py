import json
from datetime import datetime as dt
from time import sleep


def now_time():
    return dt.now()


class FacebookApi:

    def __init__(self,img,hour,minute,msg,graph):
        self.img = img
        self.h = hour
        self.m = minute
        self.msg = msg
        self.graph = graph

    def post(self):

        while True:
            hour, minn = now_time().hour, now_time().minute
            print('time to upload'.center(60,'-'))
            print(f'now the time is : {now_time()}')
            print(f'hour : {self.h}')
            print(f'min : {self.m}')
            if self.h == 0 or hour == self.h :
                if minn == self.m or self.m == 0:
                    print('ok its time to upload')
                    self.graph.put_object('106101627910928','feed',message = self.msg) #106101627910928 is the dummy acc's id
                    print('posted the feed')
                    break

                else:
                    print('sleeping for 10 secs')
                    sleep(10)

    def get_feeds(self):

        profile = self.graph.get_object('106101627910928/feed')
        data = json.dumps(profile,indent=4)
        return data

    def user_details(self):

        profile = self.graph.get_object('me',fields = 'name')
        data = json.dumps(profile,indent=4)
        name = profile['name']
        return name

