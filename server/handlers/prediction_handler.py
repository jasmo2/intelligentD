"""
csv handler will query,get,add and delete file reference.
"""
import tornado
import pandas
import os
import uuid
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
        self._tmp = os.path.dirname(os.path.dirname(os.path.realpath(__file__))) + "/tmp/"


    def post(self):
        """
        upload prediction csv
        """
        fileinfo = self.request.files['prediction_csv'][0]
        print("fileinfo is", fileinfo)
        fname = fileinfo['filename']
        extn = os.path.splitext(fname)[1]
        cname = str(uuid.uuid4()) + extn
        fh = open(self._tmp + cname, 'wb')
        fh.write(fileinfo['body'])


        df = pandas.read_csv(self._tmp + cname)
        X = df.ix[:, 1:(len(df.columns))].as_matrix()

        model = self._db['decision'].find({"fname": 1})
        prediction = executeModel(res['modelo'], X)
        print(prediction)
        
        try:
            self._db['decision'].insert({"prediction_csv": cname})
            self.write({'status': 200, 'error': '', 'prediction_csv': cname})
        except Exception as e:
            self.write(dumps({'status': 500, 'error': str(e)}))

        print("Prediction csv uploaded, cname{}".format(cname))
