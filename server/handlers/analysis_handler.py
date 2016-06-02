"""
csv handler will query,get,add and delete file reference.
"""
import tornado
import pandas
import os
from bson.objectid import ObjectId
from bson.json_util import dumps, loads
import pickle

from datamining.datamining import DataMinning

class AnalysisHandler(tornado.web.RequestHandler):
    def initialize(self, db):
        """
        Initializes the instance with a mongodn database instance
        :param db: an instance to pymongo database object
        """
        self._db = db
        self._tmp = os.path.dirname(os.path.dirname(os.path.realpath(__file__))) + "/tmp/"

    def post(self):

        args = loads(self.request.body.decode("utf-8"))


        pre_df = pandas.read_csv(self._tmp + args['train_csv'])
        columns = self.getColumnNames(args['selectedVariables'])
        columns.append(pre_df.columns[-1])
        df = pre_df[columns]

        objectCols = []
        myDic = {}
        print(df.columns)
        print(len(df.columns))
        for index in range(0, len(df.columns)-1):
            type = df[df.columns[index]].dtype
            print(type)
            if(type.kind == 'O'):
                objectCols.append(index)
                myDic[index] = {}
                print("object: " + str(index) + ", " +str(df.columns[index]))

        for index in myDic:
            uniqueColVals = df[df.columns[index]].unique()
            cont = 0
            for v in uniqueColVals:
                myDic[index][v] = cont
                cont = cont + 1
            myToInt = lambda x:myDic[index][x]
            df[df.columns[index]] = df[df.columns[index]].map(myToInt)

        X = df.ix[:, 0:(len(df.columns)-1)].as_matrix()
        print("X: {}".format(X))
        y = df.iloc[:, (len(df.columns)-1):len(df.columns)].as_matrix()
        y = y.transpose()
        print(X)
        print(y[0])
        dm = DataMinning()
        res = dm.analyse(X, y[0])
        prediction = dm.executeModel(res['modelo'], X[1:2])
        print("pred>" + str(prediction))

        try:
            self._db['decision'].update_one({"train_csv": args['train_csv']},
                {
                    "$set":{ "variables": df.columns.values.tolist(), "model": res['modelo'], "myDic": pickle.dumps(myDic) }
                }, upsert = True )
            self.write({'status': 200, 'error': res['crossvalidation'], 'train_csv': args['train_csv']})
        except Exception as e:
            raise tornado.web.HTTPError(500)
            self.write(dumps({'status': 500, 'error': res['crossvalidation']}))

    def getColumnNames(self,objects_array):
        columns_names = []
        for obj in objects_array:
            columns_names.append(obj['label'])
        return columns_names

