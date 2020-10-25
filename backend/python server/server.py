from flask import Flask , jsonify
from flask_restful import Api , Resource , reqparse
from flask_cors import CORS, cross_origin
from main import Opm

app = Flask(__name__)

CORS(app, support_credentials=True)


@cross_origin(supports_credentials=True)
def login():
  return jsonify({'success': 'ok'})


api = Api(app)

user_access_token = reqparse.RequestParser()
user_access_token.add_argument('token',type=str)


class GetAccessToken(Resource):
    def post(self):
        token = user_access_token.parse_args()
        Opm.get_page_details(token)
        return jsonify({'status' : 'ok'})


api.add_resource(GetAccessToken , '/api/accessToken')

opm = Opm()
opm.testing()

if __name__ == '__main__':
    app.run(debug=True,port=4000)



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
