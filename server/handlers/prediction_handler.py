"""
csv handler will query,get,add and delete file reference.
"""
import tornado
import pandas
import os
import uuid
import time
from bson.objectid import ObjectId
from bson.json_util import dumps, loads
from slugify import slugify
from datamining.datamining import DataMinning
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
        analysisCSV = self.get_argument('trainCsv')
        print("fileinfo is", fileinfo)
        fname = fileinfo['filename']
        extn = os.path.splitext(fname)[1]
        cname = str(uuid.uuid4()) + extn
        fh = open(self._tmp + cname, 'wb')
        fh.write(fileinfo['body'])
        fh.close()

        df = pandas.read_csv(self._tmp + cname)
        cursor = self._db['decision'].find_one({"train_csv": analysisCSV})

        myDic = pickle.loads(cursor['myDic'])

        for index in myDic:
            myToInt = lambda x:myDic[index][x]
            df[df.columns[index]] = df[df.columns[index]].map(myToInt)

        X = df.ix[:, 0:(len(df.columns))].as_matrix()
        dm = DataMinning()
        prediction = dm.executeModel(cursor['model'], X)
        dataf = pandas.DataFrame(data=prediction, columns=["Target"])
        df = self.revertToDefaultValues(df,myDic)
        df["Target"] = dataf["Target"]
        df.to_csv(self._tmp + 'prediction_{}.csv'.format(ObjectId()))
        # confution_matix = dm.confution_matix()


        try:
            self._db['decision'].update_one({"train_csv": analysisCSV},
                                            {
                                                "$set": {"prediction_csv": cname}
                                            }, upsert=True)
            self.write(df.to_json())
        except Exception as e:
            raise tornado.web.HTTPError(500)
            self.write(dumps({'status': 500, 'error': str(e)}))

        print("Prediction csv uploaded, cname{}".format(cname))

    def get(self):
        """
        upload prediction csv
        """
        analysisCSV = self.get_argument('trainCsv')
        cursor = self._db['decision'].find_one({"train_csv": analysisCSV})
        prediction_csv = cursor['prediction_csv']
        ifile  = open(prediction_csv, "r")
        self.set_header ('Content-Type', 'text/csv')
        self.set_header ('Content-Disposition', 'attachment; filename='+"prediction.csv"+'')
        self.write(ifile.read())

    def revertToDefaultValues(self,df,myDic):
        for index in myDic:
            def getKey(valToevaluate):
                for key, val in myDic[index].items():
                    if val == valToevaluate:
                        return key
            df[df.columns[index]] = df[df.columns[index]].map(getKey)
        return df
