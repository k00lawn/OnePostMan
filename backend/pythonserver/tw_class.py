from dateutil.relativedelta import relativedelta as rd
from configparser import ConfigParser
from datetime import datetime as dt
import tweepy



class TwitterApi():

    def __init__(self, img=None, date = None, msg=None, username=None,token=None , token_secret=None):
        self.img = img
        self.date = date
        self.msg = msg
        self.uname = username
        self.token = token
        self.token_secret = token_secret

        config = ConfigParser()
        config.read('config.ini')
        self.key = config['tw_creds']['app_key']
        self.secret = config['tw_creds']['app_secret']

        try:

            self.auth = tweepy.OAuthHandler(self.key, self.secret)
            self.auth.set_access_token(self.token,self.token_secret)
            self.api = tweepy.API(self.auth,wait_on_rate_limit=True,wait_on_rate_limit_notify=True)
        
        except tweepy.error.TweepError as error:
            print({'error': error})

    def user_details(self):
        
        try:
            me = self.api.me()
            details = dict()

            details['user_id'] = me.id
            details['name'] = me.name
            details['followers'] = me.followers_count
            details['followings'] = me.friends_count
            details['screen_name'] = me.screen_name
            details['user_time_zone'] = me.time_zone

            return details
        
        except tweepy.error.TweepError as error:
            return {'error': error}
        
        except KeyError as error:
            return {'error': error}

    def get_tweets(self):

        try:
            tweets_data = dict()
            tweets_data['tweets'] = []
            tweets_data['id'] = []
            tweets_data['created_on'] = []
            tweets_data['retweet_count'] = []
            tweets_data['favorite_count'] = []
            tweets_data['language'] = []

            tweets = self.api.user_timeline(tweet_mode='extended')

            for i in tweets:
                tweets_data['tweets'].append(i.full_text)
                tweets_data['id'].append(i.id)
                tweets_data['created_on'].append(i.created_at)
                tweets_data['retweet_count'].append(i.retweet_count)
                tweets_data['favorite_count'].append(i.favorite_count)
                tweets_data['language'].append(i.lang)

            return tweets_data
        
        except tweepy.error.TweepError as error:
            return {'error': error}
        
        except KeyError as error:
            return {'error': error}

    def get_replies(self):
        
        try:
            mentions = []
            for i in tweepy.Cursor(self.api.search,q=f"to:{self.uname}",count=200,tweet_mode='extended').items(1000):

                rid = i.in_reply_to_status_id
                replied_user_sname = i.user.screen_name
                replied_user_name = i.user.name
                reply = i.full_text
                tweet = None
                tweet_id = None

                try:
                    tweet_data = self.api.get_status(rid, tweet_mode='extended')
                    tweet = tweet_data.full_text
                    tweet_id = tweet_data.id
                except tweepy.error.TweepError:
                    pass
                
                reply_time = i.created_at
                beforemonth = rd(months=-2) + dt.now()
                if reply_time >= beforemonth:
                    if tweet is not None:
                        mentions.append((replied_user_name,replied_user_sname,reply,tweet,tweet_id))
                else:
                    break

            return mentions
        
        except tweepy.error.TweepError as error:
            return {'error': error}
        
        except ValueError as error:
            return {'error': error}
        
        except KeyError as error:
            return {'error': error}

    def post_tweet(self):

        try:
            if self.img is not None:
                print('tw - posting with the img')
                self.api.update_with_media(self.img,self.msg)
            else:
                print('tw - posting without img')
                self.api.update_status(self.msg)

        except tweepy.error.TweepError as error:
            return {'error': error}