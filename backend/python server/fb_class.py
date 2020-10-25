import json
from datetime import timedelta
import facebook
from scheduler import *
import requests


class FacebookApi:

    def __init__(self, img=None, date=None, caption=None, user_token=None, page_token=None):
        self.img = img
        self.date = date
        self.msg = caption
        self.token = user_token
        self.pg_token = page_token

    def creds(self):

        fb_api = dict()
        fb_api['app_id'] = '3431573256929883'
        fb_api['app_secret'] = 'c13e000ac59b6d2d8d27ad838a4264ee'
        fb_api['version'] = 'v8.0'
        fb_api['graph_domain'] = f'https://developers.facebook.com/tools/explorer/{fb_api["app_id"]}/'
        fb_api['debugger_url'] = "https://graph.facebook.com/{}/oauth/access_token?grant_type=fb_exchange_token&client_id={}&client_secret={}&fb_exchange_token={}"
        fb_api['page_debugger_url'] = "https://graph.facebook.com/{}/{}/accounts?access_token={}"

        return fb_api

    def user_details(self):

        graph = facebook.GraphAPI(access_token=self.token)

        user_details = dict()

        profile = graph.get_object('me')
        user_details['user_id'] = profile['id']
        user_details['user_name'] = profile['name']
        user_details['page_details'] = []

        account = graph.get_object(f'{ user_details["user_id"] }/accounts')
        for i in account['data']:
            user_details['page_details'].append(( i['name'], i['id'], i['access_token'] , i['category']))

        return user_details

    def get_feeds(self):

        graph = facebook.GraphAPI(access_token=self.token)
        user_details = self.user_details()
        user_id = user_details['user_id']
        page_id = user_details['page_id']
        profile = graph.get_object(f'{page_id}/feed')
        data = json.dumps(profile,indent=4)
        return data

    def extend_access_token(self):

        app = self.creds()
        access_token = self.token
        app_id = app['app_id']
        app_secret = app['app_secret']
        url = app['debugger_url'].format(app['version'], app_id, app_secret, access_token)
        res = requests.get(url)
        access_token_info = res.json()
        self.token = access_token_info['access_token']
        print()
        print(f'Extended the short lived access token ... ')
        print(f'New token : {self.token}')

    def post(self):

        user_details = self.user_details()
        user_id = user_details['user_id']
        page = user_details['page_details']
        page_id = page[0][1]
        access_token = page[0][2]

        scheduler = schedule_time(self.date)

        graph = facebook.GraphAPI(access_token=access_token)

        if scheduler:
            if self.img is None:
                print('posting without img')
                graph.put_object(page_id,'feed',message = self.msg)
                print('posted the feed')

            else:

                if self.img.endswith('.jpg') or self.img.endswith('.png'):
                    print('ok its time to upload with img')
                    img = open(self.img, 'rb')
                    graph.put_photo(image=img,album_path=f"{page_id}/photos", message = self.msg)
                    print('posted the feed')
                else:
                    pass
