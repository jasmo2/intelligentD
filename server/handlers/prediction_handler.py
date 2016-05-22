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
from datamining.datamining import analyse, executeModel
import pickle

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
        fileinfo = self.request.files['file'][0]
        print("fileinfo is", fileinfo)
        fname = fileinfo['filename']
        extn = os.path.splitext(fname)[1]
        cname = str(uuid.uuid4()) + extn
        fh = open(self._tmp + cname, 'wb')
        fh.write(fileinfo['body'])
        fh.close()

        df = pandas.read_csv(self._tmp + cname)


        myDic = pickle.load(open("dictionary.p", "rb"))

        for index in myDic:
            myToInt = lambda x:myDic[index][x]
            df[df.columns[index]] = df[df.columns[index]].map(myToInt)

        X = df.ix[:, 1:(len(df.columns))].as_matrix()

        cursor = self._db['decision'].find_one({"fname": 1})
        prediction = executeModel(cursor['model'], X)

        dataf = pandas.DataFrame(data=prediction, columns=["target"])

        df["target"] = dataf["target"]
        df.to_csv('predictions.csv')
        # dataf.to_csv('predictions.csv')



        try:
            self._db['decision'].insert({"prediction_csv": cname})
            self.write(df.to_json())
        except Exception as e:
            raise tornado.web.HTTPError(500)
            self.write(dumps({'status': 500, 'error': str(e)}))

        print("Prediction csv uploaded, cname{}".format(cname))

    def get(self):
        """
        upload prediction csv
        """
        ifile  = open("predictions.csv", "r")
        self.set_header ('Content-Type', 'text/csv')
        self.set_header ('Content-Disposition', 'attachment; filename='+"prediction.csv"+'')
        self.write(ifile.read())