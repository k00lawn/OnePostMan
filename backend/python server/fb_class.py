from datetime import datetime as dt
from scheduler import *
import facebook
import requests



class FacebookApi:

    def __init__(self, img=None, date=None, caption=None, user_token=None, page_id=None):
        self.img = img
        self.date = date
        self.msg = caption
        self.token = user_token
        self.pg_id = page_id
        self.base_url = "https://graph.facebook.com"
        self.version = "v9.0"


        try:
            self.graph = facebook.GraphAPI(access_token=self.token)
            self.user_details = dict()

            profile = self.graph.get_object('me')
            self.user_details['user_id'] = profile['id']
            self.user_details['user_name'] = profile['name']
            self.user_details['page_details'] = []

            account = self.graph.get_object(f'{ self.user_details["user_id"] }/accounts')
            for i in account['data']:
                self.user_details['page_details'].append(( i['name'], i['id'], i['access_token'] , i['category']))

        except KeyError as error:
            return {'error': error}

        except facebook.GraphAPIError as error:
            return {'error': error}

    def creds(self):

        fb_api = dict()
        fb_api['app_id'] = '3431573256929883'
        fb_api['app_secret'] = 'c13e000ac59b6d2d8d27ad838a4264ee'
        fb_api['graph_domain'] = f'https://developers.facebook.com/tools/explorer/{fb_api["app_id"]}/'
        fb_api['debugger_url'] = "https://graph.facebook.com/{}/oauth/access_token?grant_type=fb_exchange_token&client_id={}&client_secret={}&fb_exchange_token={}"
        fb_api['page_debugger_url'] = "https://graph.facebook.com/{}/{}/accounts?access_token={}"
        fb_api['insights_url'] = "https://graph.facebook.com/{}/insights?metric=page_impressions_unique,page_engaged_users&access_token={}"

        return fb_api

    def get_all_feeds(self):

        try:
            # graph = facebook.GraphAPI(access_token=self.token)
            page_id = self.pg_id
            base_url = f'{page_id}/feed?limit=100'
            data = dict()
            data['feeds'] = []

            feeds = self.graph.get_object(base_url)
            data['feeds'].append(feeds['data'])

            while 'next' in feeds['paging'].keys():

                after = feeds['paging']['next'].split('&')[-1]
                feeds = self.graph.get_object(f"{base_url}&{after}")
                data['feeds'].append(feeds['data'])

            return data

        except facebook.GraphAPIError as error:
            return {'error': error}

        except KeyError as error:
            return {'error': error}

    def split_date(self,date):
        new_date = date.split('-')
        year, month, day = int(new_date[0]), int(new_date[1]), int(new_date[2][:2])
        return dt(year,month,day)

    def recent_five_feeds(self):

        try:
            # graph = facebook.GraphAPI(access_token=self.token)
            data = dict()
            feeds = self.graph.get_object(id=self.pg_id, fields='feed.limit(5)')
            data['feeds'] = feeds['feed']['data']

            return data

        except facebook.GraphAPIError as error:
            return {'error': error}

        except KeyError as error:
            return {'error': error}

    def get_comments(self):

        try:
            # graph = facebook.GraphAPI(access_token=self.token)
            feeds = self.recent_five_feeds()['feeds']
            comments = dict()
            for i in feeds:
                post_id = i['id']
                message = i['message']
                post_comments = self.graph.get_object(id=post_id, fields='comments.limit(200)')
                if 'comments' in post_comments.keys():
                    comments.update({post_id: (post_comments['comments']['data'], message)})

            return comments

        except facebook.GraphAPIError as error:
            return {'error': error}

        except KeyError as error :
            return {'error': error}

    def get_pg_id(self , pg_token):

        pg_data = self.user_details['page_details']
        id = 0

        for i in pg_data:
            if i[2] == pg_token:
                id = i[1]
                break

        return id

    def get_page_token(self, pg_id):

        try:
            pg_data = self.user_details['page_details']
            pg_token = 0

            for i in pg_data:
                if i[1] == pg_id:
                    pg_token = i[2]
                    break

            return pg_token

        except KeyError as error:
            return {'error': error}

    def extend_access_token(self):

        app = self.creds()
        app_id = app['app_id']
        app_secret = app['app_secret']
        url = app['debugger_url'].format(app['version'], app_id, app_secret, self.token)
        res = requests.get(url)
        access_token_info = res.json()

        try:
            long_token = access_token_info['access_token']
            return long_token
        except KeyError as error:
            return access_token_info

    def post(self):

        try:
            page = self.user_details['page_details']
            page_id = page[0][1]
            access_token = self.get_page_token(page_id)

            graph = facebook.GraphAPI(access_token=access_token)

            if self.img is None:

                print('posting without img')
                graph.put_object(page_id,'feed',message = self.msg)
                print('posted the feed')

            else:

                if self.img.endswith('.jpg') or self.img.endswith('.png'):

                    print('fb - ok its time to upload with img')
                    img = open(self.img, 'rb')
                    graph.put_photo(image=img,album_path=f"{page_id}/photos", message = self.msg)
                    print('fb - posted the feed')
                else:
                    pass

        except KeyError as error:
            return {'error': error}

        except facebook.GraphAPIError as error:
            return {'error': error}

'''
from fb_class import FacebookApi as fa
user_token,page_id="EAAwwZC2kAAlsBAIcHEsOjavqZBCTlRdsXvOmUPhdYbpZASRikz9GIQ95jYNQv8mzQLbOHuIeJGQve3Icqr4CtADZAFZAnxBDxKZB8kCOykCSTXAR1ki1Bb881xeHGfzrY3dgAmvuxjzjsUckO3yJ7s590XWiuFZBZA1aXsZCTCl170u5aHNwJlpms","106101627910928"
'''