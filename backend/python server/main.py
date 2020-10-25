from fb_class import FacebookApi
from ig_class import IgBot
from tw_class import TwitterApi
from mondb import *
import os
from scheduler import now_time

fb_token = 'EAAwwZC2kAAlsBAIcHEsOjavqZBCTlRdsXvOmUPhdYbpZASRikz9GIQ95jYNQv8mzQLbOHuIeJGQve3Icqr4CtADZAFZAnxBDxKZB8kCOykCSTXAR1ki1Bb881xeHGfzrY3dgAmvuxjzjsUckO3yJ7s590XWiuFZBZA1aXsZCTCl170u5aHNwJlpms'
tw_user_access_token = '1308334561831481345-nfHZ8d32aNWDgT5K2ll3Ul4OTiVRBA'
tw_user_token_secret = "wXqpxoTVHXC6hPiHqkmgzMW4uulyOHdkQHcS4MrywVxMW"
uname = 'testing_with_selenium'
upass = 'selenium123'
BASE_IMG_PATH = os.path.join(os.path.dirname(os.getcwd()) , 'nodeserver\\images')

class Opm():

    def get_page_details(self , token ):
        fapi = FacebookApi(user_token=token)
        user_details = fapi.user_details()
        page_details = [i for i in user_details['page_details']]
        post_pages(token=token, page_details=page_details)

    def delete_img(self, imgname):
        os.unlink(imgname)

    def schedule(self):
        while True:
            schedules = get_schedules()[0]

            user_details = get_user_details(schedules['user_id'])
            caption = schedules['caption']
            img = schedules['img'] if schedules['img'] is not None else None

            social_media = schedules['social_media']
            if schedules['date'] == now_time():
                if 'fb' in social_media:
                    fapi = FacebookApi()
                    fapi.post()
                if 'tw' in social_media:
                    tapi = TwitterApi()
                    tapi.post_tweet()
                if 'ig' in social_media:
                    igapi = IgBot()
                    igapi.post()

                delete_schedule(schedules['user_id'])


    def testing(self):
        while True:
            schedules = get_schedules()[0]

            if schedules != 'n':
                user_id = schedules['user_id']
                caption = schedules['caption']
                imgname = schedules['img'].split('/')[-1]
                img = os.path.join(BASE_IMG_PATH,imgname) if schedules['img'] is not None else None
                fb = schedules['facebook']
                ig = schedules['instagram']
                tw = schedules['twitter']

                if fb:
                    fapi = FacebookApi(caption = caption , img = img , date = now_time() , user_token = fb_token )
                    fapi.post()
                if tw:
                    tapi = TwitterApi(img=img, msg=caption, date=now_time(), token = tw_user_access_token ,token_secret  =tw_user_token_secret )
                    tapi.post_tweet()
                if ig:
                    igapi = IgBot(username = uname , passwd = upass , img = img , caption = caption , date = now_time() )
                    igapi.post()

                self.delete_img(img)
                delete_schedule(user_id)