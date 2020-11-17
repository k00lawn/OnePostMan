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
        api = tweepy.API(auth,wait_on_rate_limit=True,wait_on_rate_limit_notify=True)

        return api

    def user_details(self):

        api = self.make_auth()
        me = api.me()
        details = dict()

        details['user_id'] = me.id
        details['name'] = me.name
        details['followers'] = me.followers_count
        details['followings'] = me.friends_count
        details['screen_name'] = me.screen_name
        details['user_time_zone'] = me.time_zone

        return details

    def get_tweets(self):

        api = self.make_auth()

        tweets_data = dict()
        tweets_data['tweets'] = []
        tweets_data['id'] = []
        tweets_data['created_on'] = []
        tweets_data['retweet_count'] = []
        tweets_data['favorite_count'] = []
        tweets_data['language'] = []

        tweets = api.user_timeline()

        for i in tweets:
            tweets_data['tweets'].append(i.text)
            tweets_data['id'].append(i.id)
            tweets_data['created_on'].append(i.created_at)
            tweets_data['retweet_count'].append(i.retweet_count)
            tweets_data['favorite_count'].append(i.favourite_count)
            tweets_data['language'].append(i.lang)

        return tweets_data

    def get_replies(self):
        api = self.make_auth()
        mentions = []
        for i in tweepy.Cursor(api.mentions_timeline,count=200).items(1000):
            rid = i.in_reply_to_status_id
            replied_user_sname = i.user.screen_name
            replied_user_name = i.user.name
            reply = i.text
            tweet = api.get_status(rid).text
            mentions.append((replied_user_name,replied_user_sname,reply,tweet))

        return mentions

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

    def post_tweet_testing(self):

        api = self.make_auth()

        if self.img is not None:
            print('posting with the img')
            api.update_with_media(self.img,self.msg)
        else:
            print('posting without img')
            api.update_status(self.msg)
