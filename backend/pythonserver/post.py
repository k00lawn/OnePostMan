import aiohttp
import facebook


FB_BASE_URL = "https://graph.facebook.com"
TW_BASE_URL = ""

async def request(url, method, return_json = False, headers = None, data = None):

    data = None

    if method == 'get':
        async with aiohttp.ClientSession(trust_env=True) as session:
            async with session.get(url) as raw_data:
                if return_json:
                    data = await raw_data.json()
                    return data

    elif method == 'post':

        async with aiohttp.ClientSession(trust_env=True) as session:

            if headers is None and data is None:
                async with session.post(url) as raw_data:
                    if return_json:
                        data = await raw_data.json()
                        print(data)
                        return data
            else:
                async with session.post(url, file = data) as raw_data:
                    if return_json:
                        data = await raw_data.json()
                        print(data)
                        return data

async def post_fb(caption = None, img = None, page_id = None, page_access_token = None):
    
    if img is None:
        url = f"{FB_BASE_URL}/{page_id}/feed?message={caption}&access_token={page_access_token}"
        await request(url= url, method='post')

    else:
        graph = facebook.GraphAPI(access_token= page_access_token)
        img = open(img, 'rb')
        graph.put_photo(image=img,album_path=f"{page_id}/photos", message = caption )



async def post_tw(api, caption = None, img = None):

    
    if img is not None:
        api.update_with_media(img, caption)
    else:
        api.update_status( caption )

