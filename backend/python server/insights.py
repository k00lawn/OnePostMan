from dateutil.relativedelta import relativedelta as rd
from fb_class import FacebookApi
from datetime import datetime
from tw_class import *
from json import dumps
import requests




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
    beforetime = rd(months=-2) + nowtime
    year, month, day = beforetime.year, beforetime.month, beforetime.day
    bepoch = datetime(year, month, day).timestamp()

    return nepoch , bepoch


def user_insights(pg_id):
    pass


def fb_insights():                 # pg_id,user_id,metric_names
    
    pg_id = '106101627910928'
    pg_token = 'EAAwwZC2kAAlsBAFu8Fgn3Mg0rcHEYKNEwXaAUE6muyFGxJBAvbR62zFuZAVi1G1seuZBeIrN1hODhQUKJehkg3cqsOud8g45NgxWoOZBBDtGAJ4LJDOF3fibpLTiSMwMIHDTYAZAjaR4zAK1wQXIAIHhX3D3ZALvcPFdvIi89qdmJ1BS1mfJn4THxDmPkQw81vnprF8aMV99jYguSohTNE'
    nepoch , bepoch = get_epoch()
    url = creds()['fb_url'].format(pg_id, 'page_impressions_unique,page_engaged_users', pg_token, bepoch, nepoch)

    res = requests.get(url)
    data = res.json()

    return data


def tw_insights():              # user_tw_id,user_id,metric_names

    headers = {'Authorization': f'Bearer {bearer_token}'}
    user_id = '1377403244'
    tweet_id = '1327657238350106624,1327653077453733889,1325850219041320961,1325848472310919171,1325845464638398464'
    url = creds()['tw_url'].format(tweet_id)
    res = requests.get(url , headers = headers)
    data = res.json()
    print(dumps(data,indent=4))


url = 'https://api.twitter.com/2/tweets/1327657238350106624?tweet.fields=non_public_metrics,organic_metrics&media.fields=non_public_metrics,organic_metrics&expansions=attachments.media_keys'


'''
headers = {'authorization': 'OAuth oauth_consumer_key="x6nSMWg3uV58kOGm0MY22b13Y",oauth_nonce="kYjzVBB8Y0ZFabxSWbWovY3uYSQ2pTgmZeNu2VS4cg",oauth_signature="tnnArxj06cWHq44gCs1OSKk%2FjLY%3D",oauth_signature_method="HMAC-SHA1",oauth_timestamp="1605539833",oauth_token="1308334561831481345-nfHZ8d32aNWDgT5K2ll3Ul4OTiVRBA",oauth_version="1.0"'}
headers = {'authorization': 'OAuth oauth_consumer_key="x6nSMWg3uV58kOGm0MY22b13Y",,oauth_signature_method="HMAC-SHA1",oauth_timestamp="1605539833",oauth_token="1308334561831481345-nfHZ8d32aNWDgT5K2ll3Ul4OTiVRBA",oauth_version="1.0"'}

'''

