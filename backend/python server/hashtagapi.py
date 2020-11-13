import spacy
import requests as req
import json
import re


def derive(caption):

    npl = spacy.load('en_core_web_sm')
    doc = npl(caption)
    nouns = [str(i).replace(' ','') if len(str(i).split()) > 1 else str(i) for i in doc.noun_chunks]

    return nouns

def get_response(tag_name):
    url = 'https://www.instagram.com/graphql/query/?query_hash=9b498c08113f1e09617a1703c22b2f32&variables=%7B%22tag_name%22%3A%22{tag}%22%2C%22first%22%3A4%2C%22after%22%3A%22QVFEVjVWTHBuQ2xzNXZVckNEWVd6eGQ1Z0w4RnBocFZCRDdESHRnUXBmZHNNeExqZUhGVHZXZGtpcWgzMmlNWE5WbnBnZUZfOTBLMXp6RF9RTjMxa1hhWQ%3D%3D%22%7D'.format(tag = tag_name)
    res = req.get(url)
    
    return res.json()

def hashtags(res):
    tags = re.findall(r'#\w*',res)
    hashtags = []
    chunks = []

    count = 0
    for i in tags:
        if count == 15:
            hashtags.append(' '.join(chunks))
            chunks = []
            count = 0
        else:
            chunks.append(i)
            count += 1

    return hashtags


def get_hashtag(caption):
    nouns = derive(caption)
    all_tags = []

    for i in nouns:
        res = get_response(i)
        tags = hashtags(str(res))
        all_tags.append(tags)

    return all_tags
    
    
