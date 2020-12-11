from textblob import TextBlob
from cleaner import clean
from fb_class import FacebookApi
from tw_class import *

def check_polarity(comment):
    comment = ' '.join(clean(comment))
    num = TextBlob(comment)
    score = num.polarity

    return score


def check_if_ques(comment):
    questions = ['what', 'where', 'who', 'when', '?', 'how']
    count = 0
    c = comment.lower().split()
    for i in c:
        if i in questions:
            count += 1
            break
        else:
            pass

    if count == 0:
        return False
    else:
        return True


def get_sentiments(fb=False, tw=False):
    user_token = "EAAwwZC2kAAlsBAIcHEsOjavqZBCTlRdsXvOmUPhdYbpZASRikz9GIQ95jYNQv8mzQLbOHuIeJGQve3Icqr4CtADZAFZAnxBDxKZB8kCOykCSTXAR1ki1Bb881xeHGfzrY3dgAmvuxjzjsUckO3yJ7s590XWiuFZBZA1aXsZCTCl170u5aHNwJlpms"
    page_id = "106101627910928"
    token = '1308334561831481345-nfHZ8d32aNWDgT5K2ll3Ul4OTiVRBA'
    token_secret = "wXqpxoTVHXC6hPiHqkmgzMW4uulyOHdkQHcS4MrywVxMW"
    tw_uname = 'eric43187350' 
    polarized_comment = dict()
    qna_comment = dict()

    if fb:
        fapi = FacebookApi(user_token=user_token, page_id=page_id)
        comments = fapi.get_comments()
        for i in comments:

            post_id = i
            polarized_comment[post_id]= []
            qna_comment[post_id] = []
            message = comments[i][1]
            for j in comments[i][0]:
                commented_by = j['from']['name']
                comment = j['message']
                if check_if_ques(comment):
                    qna_comment[post_id].append((commented_by,comment,message))
                else:
                    score = check_polarity(comment)
                    if score > 0:
                        polarized_comment[post_id].append((commented_by, comment, message, 'positive'))
                    elif score < 0:
                        polarized_comment[post_id].append((commented_by, comment, message, 'negative'))
    if tw:
        tapi = TwitterApi(token = token, token_secret=token_secret, username = tw_uname)
        comments = tapi.get_replies()

        for i in comments:
            commented_by = i[0]
            comment = i[2]
            message = i[3]
            tweet_id = i[4]

            polarized_comment[tweet_id] = []
            qna_comment[tweet_id] = []
            if check_if_ques(comment):
                qna_comment[tweet_id].append((commented_by,comment,message))
            else:
                score = check_polarity(comment)

                if score > 0:
                    polarized_comment[tweet_id].append((commented_by, comment, message, 'positive'))
                elif score < 0:
                    polarized_comment[tweet_id].append((commented_by, comment, message, 'negative'))

    return polarized_comment, qna_comment
