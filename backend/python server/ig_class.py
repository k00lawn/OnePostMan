import instabot
from scheduler import *


class IgBot:

    def __init__(self,username = None,passwd = None , caption = None , img = None , date = None):
        self.username = username
        self.passwd = passwd
        self.caption = caption
        self.img = img
        self.date = date
        self.bot = instabot.Bot()

    def login(self):
        user = self.bot.login(username = self.username , password = self.passwd )
        return

    def get_details(self):
        pass

    def post(self):

        self.login()
        schedule = schedule_time(self.date)

        if schedule:
            if self.img.endswith('.jpg') or self.img.endswith('.png'):
                self.bot.upload_photo(caption=self.caption,photo=self.img)
            else:
                self.bot.upload_video(caption=self.caption,video=self.img)

        self.bot.logout()
