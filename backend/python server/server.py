from threading import Thread
from flask_restful import Api , Resource , reqparse
from flask_cors import CORS, cross_origin
# from multiprocessing import Process
from hashtagapi import get_hashtag
from flask import Flask, jsonify
from main import Opm


app = Flask(__name__)

CORS(app, support_credentials=True)


@cross_origin(supports_credentials=True)
def login():
  return jsonify({'success': 'ok'})


api = Api(app)

# user access token endpoint ------------------------------------------------------------------------------

user_access_token = reqparse.RequestParser()
user_access_token.add_argument('access_token',type=str)
user_access_token.add_argument('userId',type=str)


class GetAccessToken(Resource):

    def post(self):
        data = user_access_token.parse_args()
        print(data)
        opm = Opm()
        opm.extend_and_post_pages(user_id=data['userId'], token=data['access_token'])
        return jsonify({'status' : 'ok'})


# user caption endpoint -----------------------------------------------------------------------------------

user_caption = reqparse.RequestParser()
user_caption.add_argument('caption',type=str)


class GetCaption(Resource):
    def post(self):
        caption = user_caption.parse_args()
        hashtags = get_hashtag(caption['caption'])
        return jsonify({'data': hashtags})


api.add_resource(GetAccessToken , '/api/accessToken')
api.add_resource(GetCaption , '/api/caption')


if __name__ == '__main__':

    opm = Opm()
    opm = Thread(target=opm.schedule)
    opm.start()
    app.run(debug=True, port=4000)
    opm.join()



# if __name__ == '__main__':

#     opm = Opm()
#     opm = Process(target=opm.schedule , args=())
#     opm.start()
#     app.run(debug=True, port=4000, use_reloader = False)
#     opm.join()


'''
app.add_url_rule(
    '/api/createTask',
    view_func=GraphQLView.as_view('schedule',
    schema = schema ,
    graphiql = False
                                 )
)


user_post_data = reqparse.RequestParser()
user_post_data.add_argument('caption',type=str)
user_post_data.add_argument('time',type=str)
user_post_data.add_argument('image',type=str)
user_post_data.add_argument('facebook',type=str)
user_post_data.add_argument('instagram',type=str)
user_post_data.add_argument('twitter',type=str)

class Schedule(Resource):
    def get(self):
        return jsonify({'error' : 'only  accepts post req'})

    def post(self):
        data = user_post_data.parse_args()
        # details = data
        return jsonify({'data' : data })

api.add_resource(Schedule,'/api/createTask')
'''
