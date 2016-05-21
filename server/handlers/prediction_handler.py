"""
csv handler will query,get,add and delete file reference.
"""
import tornado
import pandas
from bson.objectid import ObjectId
from bson.json_util import dumps, loads
from slugify import slugify

class PredictionHandler(tornado.web.RequestHandler):
    def initialize(self, db):
        """
        Initializes the instance with a mongodn database instance
        :param db: an instance to pymongo database object
        """
        self._db = db


        def post(self):
            """
            upload train csv
            """
            train = loads(self.request.body.decode("utf-8"))
            if not train['train_csv']:
                self.write(dumps({'status':-1,'error':'name is mandatory'}))
                return

            fileinfo = self.request.files['train_csv'][0]
            print ("fileinfo is", fileinfo)
            fname = fileinfo['filename']
            fh.write(fileinfo['body'])

            print("Prediction csv uploaded")

            try:
                self._db['model'].insert(train)
                self.write({'status':0,'error':'','slug':blog['slug']})
            except Exception as e:
                self.write(dumps({'status':-2,'error':str(e)}))
