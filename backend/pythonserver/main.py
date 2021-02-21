from fb_class import FacebookApi
from tw_class import TwitterApi
from scheduler import now_time
from time import sleep
from threading import Thread
from mondb import *
import os


BASE_IMG_PATH = os.path.join(os.path.dirname(os.getcwd()) , 'nodeserver\\images')
# print(BASE_IMG_PATH in os.listdir())
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
                page_name = user_details['fb_page_details'][0]['name']
                page_id = user_details['fb_page_details'][0]['id']
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
        
        imgname = schedule['img']

        if imgname is not None:
            imgname = imgname.split('/')[-1]
            img = os.path.join(BASE_IMG_PATH, imgname)
        
        else:
            img = None

        return schedule_id, user_id, caption, img, date, fb, tw

    def schedule(self):
        print("OPM main server is running...")
        
        while True:
            sleep(1.5)            
            schedules = get_schedules()

            if schedules:
                schedule_details = schedules[0]
                schedule_id, user_id, caption, img, date, fb, tw = self.get_data_from_schedule(schedule_details)

                if date <= now_time():
                    user_details = get_user_details(user_id)
                    print(schedule_details)
                    fb_token, tw_user_access_token, tw_user_token_secret = self.get_user_data_db(user_details, fb, tw)
                    delete_schedule(schedule_id)        

                    if fb:
                        fapi = FacebookApi(caption=caption, img=img, user_token=fb_token)
                        fapi.post()
                    if tw:
                        tapi = TwitterApi(img=img, msg=caption, token=tw_user_access_token ,token_secret=tw_user_token_secret)
                        tapi.post_tweet()

                    if img is not None:
                        self.delete_img(img)

            
opm = Opm()
opm.schedule()

