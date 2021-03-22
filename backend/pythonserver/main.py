from time import sleep
import os
import tweepy
import asyncio
from post import *
from configparser import ConfigParser
from mondb import OpmDb



BASE_IMG_PATH = os.path.join(os.path.dirname(os.getcwd()) , 'nodeserver\\images')
BASE_VID_PATH = os.path.join(os.path.dirname(os.getcwd()) , 'nodeserver\\videos')


class Opm():

    def __init__(self):
        try:
            config = ConfigParser()
            config.read('config.ini')
            self.cluster = config['mongo']['url']
            self.key = config['tw_creds']['app_key']
            self.secret = config['tw_creds']['app_secret']
            self.auth = tweepy.OAuthHandler(self.key, self.secret)
            self.db = OpmDb(self.cluster)

        except tweepy.error.TweepError as error: 
            print(error)

    def delete_img(self, imgname):
        try :
            os.unlink(imgname)
        except FileExistsError:
            print(f'{imgname} is not found')

    async def post(self, post):

        user_details = self.db.get_user_details(post['userId'])
        image = None

        if post['img'] is not None:
            imageName = post['img'].split('/')[-1]
            image = os.path.join(BASE_IMG_PATH, imageName)

        if post['facebook']:
            page_id = user_details['fb_page_details'][0]['id']
            page_access_token = user_details['fb_page_details'][0]['access_token']
            await post_fb(caption = post['caption'], img = image, page_id = page_id, page_access_token = page_access_token)

        if post['twitter']:
            tw_user_access_token = user_details['tw_access_token']
            tw_user_token_secret = user_details['tw_access_token_secret']
            self.auth.set_access_token(tw_user_access_token, tw_user_token_secret)
            api = tweepy.API(self.auth)
            await post_tw(api = api, caption = post['caption'], img = image)

        if image is not None:
            self.delete_img(image)

        self.db.delete_schedule(post['_id'])

    async def test(self):

        print('running the script ...')
        while True:
            schedules = self.db.get_schedules()
            if schedules:
                await asyncio.wait([self.post(schedule) for schedule in schedules])
            else:
                print('nothing in the schedule collection ...')
                sleep(5)


opm = Opm()

loop = asyncio.new_event_loop()
asyncio.set_event_loop(loop= loop)

loop.run_until_complete(opm.test())