from spacy.matcher import Matcher
import requests as req
import spacy
import re


def doc(caption):
    # nouns = [str(i).replace(' ','') if len(str(i).split()) > 1 else str(i) for i in doc.noun_chunks]
    npl = spacy.load('en_core_web_sm')
    pattern = [[{"POS": "PROPN"}],[{"POS": "VERB"}]]
    matcher = Matcher(npl.vocab)
    matcher.add("nouns", None, pattern[0])
    matcher.add("verb", None, pattern[1])

    doc = npl(caption)
    matches = matcher(doc)

    words = [doc[s:e] for i, s, e in matches]

    return words


def get_response(tag_name):

    headers = dict()
    headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
    headers['Cookie'] = 'mid=XPVwhgALAAHSmhJvmu5jJQxja72y; datr=MaO6Xog9Z8DpEx8p7uteMmZ-; ig_did=28BB23DD-1D47-4704-85E4-CEDF1670C57A; shbid=5055; ig_nrcb=1; csrftoken=V8xlYyIygRT5A9CPdrUsWdc47DMYXnJA; ds_user_id=1183474885; sessionid=1183474885%3A7T1LU5m2G5m5vZ%3A18; fbm_124024574287414=base_domain=.instagram.com; shbts=1606708329.4379528; rur=PRN; fbsr_124024574287414=mtPtrpjBENiexrjXraGiCQ3CT5Lk0payXz9M7hooTQY.eyJ1c2VyX2lkIjoiMTAwMDU1NDg2MDI1MDg4IiwiY29kZSI6IkFRQ0NvZzhJLW5tY3dmSU1CcVYzOHhKckxZMmc1LWY0Vy1renMtTi1QRXQ1TDI0RWpNTzlRa2YycWdFcFVtUDFITi0yXzNkUlVqcmdUMnhxYnI3TkVXc3JDcHJYSkxJSVd5dXptQTRJQkVOc2gtejBHVDJzazhCYjNNSnZZWV93d2J1WWprZ3U5ZkJTUjAwU1NKc3FrcEsteUxmRmVlTGI2eUFBazA5d3lBZEwwYlBkeE1raV9IcG53eVBKNnpmbmRRZFdFckJlcGtNUloxSTh2M055OFhFN1NSYmxGS1oxYk5iYjhYVUcxLXh4Rk5ZaG1HSFBvM0diM0NhYi00M1BfeHZQbVBFTllfd2JqX2pfeTY5QWp5bjIyMlNDclhmUTdEMXQ4bFFOYjNaVHM4bFVCM21EWF9fOXRWcmkwQTJoSFlDRGJJc0JMaVkxdEVGNDZMQmdQZUNIIiwib2F1dGhfdG9rZW4iOiJFQUFCd3pMaXhuallCQUUwUVMxeExaQmY0OXJ5RzZVcFpCNXZ5Umh1Nm9WaFlYWkJwZVR4MnE3V0s0czJQOFBIZU9GVTdRSmpPSzYzaHN1T09reDZOZnB2S2JmcFkwdll5Zkt4NHZJTlQ0RW9ISTBENTVPZzZMek81SWdQTlB0UE5LQ0RaQTRzMlNnWkNueUUyZzZBbGNHYzNDSUpnT0I4aFNnZHgyNFpDZ0pzWkIySENmOEd5MFpDZnc1Mlg4VVZCQU9NWkQiLCJhbGdvcml0aG0iOiJITUFDLVNIQTI1NiIsImlzc3VlZF9hdCI6MTYwNjczOTQ2MH0; urlgen="{\"202.191.1.238\": 133000}:1kjiKv:nCYnwr3sadM9vGKDhqZX1ryqg4E'
    headers['Accept-Encoding'] = 'gzip, deflate, br'

    url = 'https://www.instagram.com/graphql/query/?query_hash=9b498c08113f1e09617a1703c22b2f32&variables=%7B%22tag_name%22%3A%22{tag}%22%2C%22first%22%3A4%2C%22after%22%3A%22QVFEVjVWTHBuQ2xzNXZVckNEWVd6eGQ1Z0w4RnBocFZCRDdESHRnUXBmZHNNeExqZUhGVHZXZGtpcWgzMmlNWE5WbnBnZUZfOTBLMXp6RF9RTjMxa1hhWQ%3D%3D%22%7D'.format(tag = tag_name)
    res = req.get(url, headers = headers)
    
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
    words = doc(caption)
    all_tags = []

    for i in words:
        res = get_response(i)
        tags = hashtags(str(res))
        all_tags.append(tags)

    return all_tags
    
    
