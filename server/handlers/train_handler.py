"""
csv handler will query,get,add and delete file reference.
"""
import tornado
import pandas
import uuid
import os
from bson.objectid import ObjectId
from bson.json_util import dumps, loads
import pickle
from datamining.datamining import DataMinning

class TrainHandler(tornado.web.RequestHandler):
    def initialize(self, db):
        self._db = db
        self._tmp = os.path.dirname(os.path.dirname(os.path.realpath(__file__))) + "/tmp/"

    def post(self):
        fileinfo = self.request.files['file'][0]
        cname = 'train_{}.csv'.format(ObjectId())
        fh = open(self._tmp + cname, 'wb')
        fh.write(fileinfo['body'])
        fh.close()
        df = pandas.read_csv(self._tmp + cname)

        try:
            self._db['decision'].insert({
                        "train_csv": cname,
                        "variables": df.columns.values.tolist()
            })
            self.write({'status': 200,
                        'train_csv': cname,
                        "variables": df.columns.values.tolist()
                        })
        except Exception as e:
            print(e)
            raise tornado.web.HTTPError(500)

        print("Train csv uploaded, cname{}".format(cname))

    def get_train_csv(self,cname):
        df = pandas.read_csv(self._tmp + cname)
        objectCols = []
        myDic = {}
        print(df.columns)
        print(len(df.columns))
        for index in range(0, len(df.columns) - 1):
            type = df[df.columns[index]].dtype
            print(type)
            if (type.kind == 'O'):
                objectCols.append(index)
                myDic[index] = {}
                print("object: " + str(index) + ", " + str(df.columns[index]))

        for index in myDic:
            uniqueColVals = df[df.columns[index]].unique()
            cont = 0
            for v in uniqueColVals:
                myDic[index][v] = cont
                cont = cont + 1
            myToInt = lambda x: myDic[index][x]
            df[df.columns[index]] = df[df.columns[index]].map(myToInt)

        X = df.ix[:, 1:(len(df.columns) - 1)].as_matrix()
        y = df.ix[:, (len(df.columns) - 1):len(df.columns)].as_matrix()
        y = y.transpose()
        dm = DataMinning()
        result = dm.analyse(X, y[0])
        prediction = dm.executeModel(result['modelo'], X[1:2])
        print("pred>" + str(prediction))
        return prediction
