"""app.py
revision: 0.1 24.4.2014 initial by David Levy

Tornado server for mongodb tornado angular tutorial
"""
import os
import sys
import tornado
import pymongo
from tornado.options import  options
from tornado import ioloop, web
sys.path.insert(0, './server')

from handlers.index_handler import IndexHandler
from handlers.train_handler import TrainHandler
from handlers.test_handler import TestHandler


#adding local directory to path
sys.path.append(os.path.dirname(os.path.realpath(__file__)))

"""
Loading default setting files
"""
import settings

"""
searching for a local_setting.py file that overrides default configuration
"""
try:
    tornado.options.parse_config_file(
        os.path.join(os.path.dirname(os.path.realpath(__file__)),'local_settings.py'),
        False)
except Exception as e:
    print (tornado.options.parse_config_file(
        os.path.join(os.path.dirname(os.path.realpath(__file__)),'local_settings.py'),
        False))
    #TODO: handle different exceptions
    print ('local_settings.py not defined, using default settings')

"""
Connecting to the mongodb database
"""
mongo_client = pymongo.MongoClient(options.mongodb_host)
db = mongo_client[options.mongodb_name]



def init_db(db):
    try:
        db.create_collection('decision')
    except:
        pass
    db['decision'].ensure_index('_id', unique=True)
    try:
        db.create_collection('user')
    except:
        pass
    try:
        db['user'].insert({'username':'admin','password':'admin','role':'admin'})
    except:
        pass
    db['user'].ensure_index('username', unique=True)
    db['user'].ensure_index('_id', unique=True)


static_path = options.static_path

app = tornado.web.Application([
      (r'/', IndexHandler),
      (r'/train_upload', TrainHandler,dict(db=db)),
      (r'/test', TestHandler)
    #   (r'/prediction_upload', PredictionHandler,dict(db=db))
      #api prefix means that we load json data
    ],
    static_path=static_path,
    autoreload=True,
    debug=True
)

if __name__ == '__main__':
    #read settings from commandline
    options.parse_command_line()
    if options.init_db:
        init_db(db)
    print ('server running on http://localhost:{}'.format(options.port))
    app.listen(options.port,xheaders=True)
    ioloop = tornado.ioloop.IOLoop.instance()
    ioloop.start()
