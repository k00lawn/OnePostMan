from fb_class import FacebookApi
import facebook as fb


def ask_time():
    time_to_post = input('Time to upload : ')
    time_to_post = time_to_post.strip().split('-')
    new_time = []

    for i in time_to_post:
        if i != '':
            new_time.append(int(i))

    return new_time


token = 'EAAwwZC2kAAlsBACzx4uAXnaZCg8sObsEb9ZADZBdaEaeSv4NkkS7LRDdCEtuwwjJEBvWHgtoFKm6RUUOyvF2Ik1Wr4Y9X7q0qOQDrL9YZCTtxsWGQ8nwDJbzjlsIhF78PWszfpNdgFYa3pFur4GhBdZAsH79lxgMYQlSOswEsJnGxfFaQt3s3dZCfo1lMM43a9HuGEF9z7xSiIyGmZCwJKjn'

graph = fb.GraphAPI(access_token=token)



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

    fapi = FacebookApi(hour=hour,minute=minn,graph=graph,msg=msg,img=img)
    fapi.post()

else:
    fapi = FacebookApi(hour=None,minute=None,graph=graph,msg=None,img=None)
    page_name = fapi.user_details()
    details = fapi.get_feeds()
    print(f'page name is : {page_name}')
    print(details)

