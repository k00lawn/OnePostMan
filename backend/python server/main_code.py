from fb_class import FacebookApi


def ask_time():
    time_to_post = input('Time to upload : ')
    time_to_post = time_to_post.strip().split('-')
    new_time = []

    for i in time_to_post:
        if i != '':
            new_time.append(int(i))

    return new_time


def creds( access_token ):

    fb_api = dict()
    fb_api['access_token'] = access_token
    fb_api['app_id'] = '3431573256929883'
    fb_api['app_secret'] = 'c13e000ac59b6d2d8d27ad838a4264ee'
    fb_api['version'] = 'v8.0'
    fb_api['graph_domain'] = f'https://developers.facebook.com/tools/explorer/{ fb_api["app_id"] }/'
    fb_api['debugger_url'] = f"https://developers.facebook.com/tools/debug/accesstoken/?access_token={ access_token }"
    fb_api['debug'] = 'NO'

    return fb_api


token = input('Enter the token :')

details = creds(token)

choice = input('Ary you gonna upload (y/n) : ')

if choice == 'y':
    msg = input('caption : ')
    img = None

    print('Enter the time to post the feed'.center(60,'-'))
    print('''
    Syntax : hour-min 
    Eg : 17-23 or 0-23 (if you want to post at this hour) or both 0-0 to post now
    ''')

    time = ask_time()

    while len(time) != 2:
        time = ask_time()

    hour , minn = time

    fapi = FacebookApi(hour=hour,minute=minn,token=token,msg=msg,img=img)
    fapi.post()

else:

    fapi = FacebookApi(token=token)
    user_details = fapi.user_details()
    for i in user_details:
        print(f'{i} : {user_details[i]}')
    print(fapi.get_feeds())

