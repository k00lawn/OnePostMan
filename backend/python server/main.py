from fb_class import FacebookApi
from tw_class import TwitterApi
from scheduler import now_time
from time import sleep
from mondb import *
import os



fb_token = 'EAAwwZC2kAAlsBAIcHEsOjavqZBCTlRdsXvOmUPhdYbpZASRikz9GIQ95jYNQv8mzQLbOHuIeJGQve3Icqr4CtADZAFZAnxBDxKZB8kCOykCSTXAR1ki1Bb881xeHGfzrY3dgAmvuxjzjsUckO3yJ7s590XWiuFZBZA1aXsZCTCl170u5aHNwJlpms'
tw_user_access_token = '1308334561831481345-nfHZ8d32aNWDgT5K2ll3Ul4OTiVRBA'
tw_user_token_secret = "wXqpxoTVHXC6hPiHqkmgzMW4uulyOHdkQHcS4MrywVxMW"
uname = 'testing_with_selenium'
upass = 'selenium123'
BASE_IMG_PATH = os.path.join(os.path.dirname(os.getcwd()) , 'nodeserver\\images')
BASE_VID_PATH = os.path.join(os.path.dirname(os.getcwd()) , 'nodeserver\\videos')


class Opm():

    def extend_and_post_pages(self, user_id, token):

        fapi = FacebookApi( user_token = token)
        long_access_token = fapi.extend_access_token()
        user_details = fapi.user_details()
        page_details = user_details['page_details']
        post_token_and_pages(user_id=user_id, token=long_access_token, page_details=page_details)

    def delete_img(self, imgname):
        try :
            os.unlink(imgname)
        except FileExistsError:
            print(f'{imgname} is not found')

    def get_user_data_db(self , user_details, fb, tw):

        fb_token = None
        tw_user_access_token = None
        tw_user_token_secret = None

        try:
            if fb:
                fb_token = user_details['fb_access_token']
            if tw:
                tw_user_access_token = user_details['tw_access_token']
                tw_user_token_secret = user_details['tw_access_token_secret']
        except KeyError as error:
            print(error)

        return fb_token, tw_user_access_token, tw_user_token_secret

    def get_data_from_schedule(self , schedule):

        schedule_id = schedule['_id']
        user_id = schedule['userId']
        caption = schedule['caption']
        date = schedule['date']
        fb = schedule['facebook']
        tw = schedule['twitter']

        try:
            imgname = schedule['img'].split('/')[-1]
            img = os.path.join(BASE_IMG_PATH, imgname)
        except KeyError:
            img = None

        return schedule_id, user_id, caption, img, date, fb, tw

    def schedule(self):

        while True:

            print('testing in the opm')
            schedules = get_schedules()[0]
            sleep(5)

            if schedules != 'n':

                schedule_id, user_id, caption, img, date, fb, tw = self.get_data_from_schedule(schedules)
                user_details = get_user_details(user_id)
                fb_token, tw_user_access_token, tw_user_token_secret = self.get_user_data_db(user_details, fb, tw)

                if date <= now_time():
                    if fb:
                        fapi = FacebookApi(caption=caption, img=img, user_token=fb_token)
                        fapi.post()
                    if tw:
                        tapi = TwitterApi(img=img, msg=caption, token=tw_user_access_token ,token_secret=tw_user_token_secret)
                        tapi.post_tweet()

                    self.delete_img(img)
                    delete_schedule(schedule_id)