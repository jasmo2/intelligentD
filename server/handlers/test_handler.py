"""
Simple Index Handler
"""
from tornado import web
import os
from tornado.options import options
from datamining.datamining import analyse, executeModel
import numpy as np
import csv

class TestHandler(web.RequestHandler):
    def get(self):
        """
        Loading the main page for the application
        As we are working in a single web page application it will be the only page to load
        """


        X = np.array([[0, 0], [0, 0], [0, 0], [1, 1], [1,1], [1,1]])
        y = np.array([0, 0, 0, 1, 1, 1])
        res = analyse(X, y)

        prediction = executeModel(res['modelo'], X[4:5])
        # self.render("index_path")


        with open('eggs.csv', 'w', newline='') as csvfile:
            spamwriter = csv.writer(csvfile, delimiter=',',
                                    quoting=csv.QUOTE_MINIMAL)
            spamwriter.writerow(['Spam'] * 5 + ['Baked Beans'])
            spamwriter.writerow(['Spam', 'Lovely Spam', 'Wonderful Spam'])

        self.write(str(res['cossvalidation']) + str(prediction))
