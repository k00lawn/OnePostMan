import json
from datetime import datetime as dt
from time import sleep
import facebook


def now_time():
    return dt.now()


class FacebookApi:

    def __init__(self,img=None,hour=None,minute=None,msg=None, token = None):
        self.img = img
        self.h = hour
        self.m = minute
        self.msg = msg
        self.token = token

    def user_details(self):

        graph = facebook.GraphAPI(access_token=self.token)

        user_details = dict()

        profile = graph.get_object('me')
        user_details['user_id'] = profile['id']
        account = graph.get_object(f'{ user_details["user_id"] }/accounts')
        account_data = json.dumps(account, indent=4)

        user_details['user_name'] = profile['name']
        user_details['accounts'] = account_data

        for i in account['data']:
            user_details['page_name'] = i['name'] or None
            user_details['page_id'] = i['id'] or None
            user_details['page_access_token'] = i['access_token']

        return user_details

    def get_feeds(self):

        graph = facebook.GraphAPI(access_token=self.token)

        user_details = FacebookApi(token=self.token).user_details()
        user_id = user_details['user_id']
        page_id = user_details['page_id']
        profile = graph.get_object(f'{page_id}/feed')
        data = json.dumps(profile,indent=4)
        return data

    def post(self):

        user_details = FacebookApi(token=self.token).user_details()
        user_id = user_details['user_id']
        page_id = user_details['page_id']
        access_token = user_details['page_access_token']

        graph = facebook.GraphAPI(access_token=access_token)

        while True:
            hour, minn = now_time().hour, now_time().minute
            print('time to upload'.center(60,'-'))
            print(f'now the time is : {now_time()}')
            print(f'hour : {self.h}')
            print(f'min : {self.m}')
            if self.h == 0 or hour == self.h :
                if minn == self.m or self.m == 0:
                    print('ok its time to upload')
                    graph.put_object(page_id,'feed',message = self.msg) #106101627910928 is the dummy acc's id
                    print('posted the feed')
                    break

                else:
                    print('sleeping for 10 secs')
                    sleep(10)

