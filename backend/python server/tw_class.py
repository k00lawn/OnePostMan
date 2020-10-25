from scheduler import *
import tweepy

bearer_token = 'AAAAAAAAAAAAAAAAAAAAALa9HwEAAAAA%2BADq9E%2FGmK265myVGUixB4yJbTM%3D4WubAhhGOVjXgn8uEBoycNb2YrJOkDdAUUoMKp7fvsGg7WpmCf'
tw_user_access_token = '1308334561831481345-nfHZ8d32aNWDgT5K2ll3Ul4OTiVRBA'
tw_user_token_secret = "wXqpxoTVHXC6hPiHqkmgzMW4uulyOHdkQHcS4MrywVxMW"

now_time = now_time()


class TwitterApi():

    def __init__(self, img=None, date = None, msg=None, token=None , token_secret=None):
        self.img = img
        self.date = date
        self.msg = msg
        self.token = token
        self.token_secret = token_secret

    def creds(self):
        tw_api = dict()

        tw_api['app_id'] = "18857398"
        tw_api['app_key'] = "x6nSMWg3uV58kOGm0MY22b13Y"
        tw_api['app_secret'] = "b5YiG83NUvjHsCWlvtxmJ9H99pG9rvDJhMMC6Q51enbXQfLEhl"
        tw_api['api_dashboard'] = "https://developer.twitter.com/en/portal/dashboard"

        return tw_api

    def make_auth(self):

        tw_details = self.creds()
        auth = tweepy.OAuthHandler(tw_details['app_key'],tw_details['app_secret'])
        auth.set_access_token(self.token,self.token_secret)
        api = tweepy.API(auth)

        return api

    def user_details(self):
        api = TwitterApi.make_auth(self)
        tweets = api.home_timeline()[0]
        details = dict()

        details['user_id'] = tweets.user.id
        details['name'] = tweets.user.name
        details['screen_name'] = tweets.user.screen_name
        details['user_time_zone'] = tweets.user.time_zone

        return details

    def get_tweets(self):

        api = TwitterApi.make_auth(self)
        user_details = TwitterApi.user_details(self)
        name = user_details['name']

        tweets = api.home_timeline()
        data = [(i.text,i.id) for i in tweets]

        return data

    def post_tweet(self):

        api = self.make_auth()
        scheduler = schedule_time(self.date)

        if scheduler:

            if self.img is not None:
                print('posting with the img')
                api.update_with_media(self.img,self.msg)
            else:
                print('posting without img')
                api.update_status(self.msg)
