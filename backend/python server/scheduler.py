from time import sleep
from datetime import datetime as dt


def now_time():
    return str(dt.now()).split('.')[0][:-3]


def schedule_time(date):
    date = str(date).split('.')[0][:-3]
    print(f"printing date : {date}")
    print(f"printing nowtime : {now_time()}")
    print()
    while now_time() < date:
        print(f'nowtime != date : {now_time()} != {date}')
        sleep(10)
        pass

    return True
