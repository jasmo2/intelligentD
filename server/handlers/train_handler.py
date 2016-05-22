"""
csv handler will query,get,add and delete file reference.
"""
import tornado
import pandas
import uuid
import os
from bson.objectid import ObjectId
from bson.json_util import dumps, loads

from datamining.datamining import analyse, executeModel

class TrainHandler(tornado.web.RequestHandler):
    def initialize(self, db):
        """
        Initializes the instance with a mongodn database instance
        :param db: an instance to pymongo database object
        """
        self._db = db
        self._tmp = os.path.dirname(os.path.dirname(os.path.realpath(__file__))) + "/tmp/"

    def post(self):
        """
        upload train csv
        # """
        # train = loads(self.request.body.decode("utf-8"))
        # if not train['train_csv']:
        #     self.write(dumps({'status':-1,'error':'name is mandatory'}))
        #     return

        fileinfo = self.request.files['file'][0]
        print("fileinfo is", fileinfo)
        fname = fileinfo['filename']
        extn = os.path.splitext(fname)[1]
        cname = str(uuid.uuid4()) + extn
        fh = open(self._tmp + cname, 'wb')
        fh.write(fileinfo['body'])
        try:
            self._db['decision'].insert({"train_csv": cname})

            self.write({'status': 200, 'error': '', 'train_csv': cname})
        except Exception as e:
            self.write(dumps({'status': 500, 'error': str(e)}))

        print("Train csv uploaded, cname{}".format(cname))


