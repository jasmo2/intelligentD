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
        # print("fileinfo is", fileinfo)
        fname = fileinfo['filename']
        extn = os.path.splitext(fname)[1]
        cname = str(uuid.uuid4()) + extn
        fh = open(self._tmp + cname, 'wb')
        fh.write(fileinfo['body'])
        fh.close()

        df = pandas.read_csv(self._tmp + cname)


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

        # columns_names = self.getTypes(df)

        # df = self.getUniqueValues(df,columns_names)

        pickle.dump( myDic, open("dictionary.p", "wb"))
        translator = pickle.load(open("dictionary.p", "rb"))

        X = df.ix[:, 1:(len(df.columns)-1)].as_matrix()
        print(X)
        y = df.ix[:, (len(df.columns)-1):len(df.columns)].as_matrix()
        y = y.transpose()
        print(X)
        print(y[0])
        res = analyse(X, y[0])
        prediction = executeModel(res['modelo'], X[1:2])
        print("pred>" + str(prediction))

        try:
            self._db['decision'].insert({"fname":1,"train_csv": cname, "model": res['modelo']})

            self.write({'status': 200, 'error': res['cossvalidation'], 'train_csv': cname})
        except Exception as e:
            # self.write(dumps({'status': 500, 'error': str(e)}))
            self.write(dumps({'status': 500, 'error': res['cossvalidation']}))

        print("Train csv uploaded, cname{}".format(cname))

    def getTypes(self,df):
        df_limit = df.drop(df.columns[[-1]], axis=1)
        g = df_limit.columns.to_series().groupby(df_limit.dtypes).groups
        columns_names = {k.name: v for k, v in g.items()}['object']
        print(columns_names)
        return columns_names

    def getUniqueValues(self,df,column_names):
        series_to_df = {}
        for column_name in column_names:
            series_uniq = df[column_name].unique()
            values_dict = {k: idx for idx, k in enumerate(series_uniq)}
            series_to_df[column_name] = df[column_name].replace(values_dict, regex=True)

        series_to_df[df.columns[-1]] = df[df.columns[-1]]
        new_df = pandas.DataFrame(series_to_df)
        print(new_df.head())
        return new_df
