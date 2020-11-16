from fb_class import FacebookApi
from tw_class import *
from datetime import datetime
from json import dumps
import requests
import re


def creds():

    details = dict()
    details['fb_url'] = "https://graph.facebook.com/{}/insights?metric={}&access_token={}&since={}&until={}"
    details['tw_url'] = "https://api.twitter.com/2/tweets?ids={}&tweet.fields=public_metrics&expansions=attachments.media_keys&media.fields=public_metrics,quote_count"
    docs = 'https://developer.twitter.com/en/docs/twitter-api/metrics'

    later = re.sub('\u00252', '%2', 'sdsd')
    fb_metrics = ['page_impressions_unique', 'page_engaged_users', '']

    return details


def get_epoch():

    nowtime = datetime.now()
    year, month, day = nowtime.year, nowtime.month, nowtime.day
    nepoch = datetime(year, month, day).timestamp()
    bepoch = datetime(year, month - 2, day - 1).timestamp()

    return nepoch , bepoch


def user_insights(pg_id):
    pass


def testing_fb_default():                 # pg_id,user_id,metric_names
    pg_id = '106101627910928'
    pg_token = 'EAAwwZC2kAAlsBAFu8Fgn3Mg0rcHEYKNEwXaAUE6muyFGxJBAvbR62zFuZAVi1G1seuZBeIrN1hODhQUKJehkg3cqsOud8g45NgxWoOZBBDtGAJ4LJDOF3fibpLTiSMwMIHDTYAZAjaR4zAK1wQXIAIHhX3D3ZALvcPFdvIi89qdmJ1BS1mfJn4THxDmPkQw81vnprF8aMV99jYguSohTNE'
    nepoch , bepoch = get_epoch()
    url = creds()['fb_url'].format(pg_id, 'page_impressions_unique,page_engaged_users', pg_token, bepoch, nepoch)

    res = requests.get(url)
    data = res.json()

    return data


def testing_tw_default():              # user_tw_id,user_id,metric_names
    headers = {'Authorization': f'Bearer {bearer_token}'}
    user_id = '1377403244'
    tweet_id = '1327657238350106624,1327653077453733889,1325850219041320961,1325848472310919171,1325845464638398464'
    url = creds()['tw_url'].format(tweet_id)
    res = requests.get(url , headers = headers)
    data = res.json()
    print(dumps(data,indent=4))


'https://api.twitter.com/2/tweets/1327657238350106624?tweet.fields=non_public_metrics,organic_metrics&media.fields=non_public_metrics,organic_metrics&expansions=attachments.media_keys'
, oauth_nonce="OAUTH_NONCE", oauth_signature="OAUTH_SIGNATURE", oauth_signature_method="HMAC-SHA1", oauth_timestamp="OAUTH_TIMESTAMP", oauth_token="ACCESS_TOKEN", oauth_version="1.0"


headers = {'authorization': 'OAuth oauth_consumer_key="x6nSMWg3uV58kOGm0MY22b13Y"',

           }