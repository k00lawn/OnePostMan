from flask import Flask , render_template


app = Flask(__name__)

@app.route('/auth')
def login():
    return render_template('fb_login.html')

@app.route('/')
def index():
    return "hello bitch"

if __name__ == "__main__":
    app.run(debug=True,port=4200,ssl_context='adhoc')