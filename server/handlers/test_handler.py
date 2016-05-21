"""
Simple Index Handler
"""
from tornado import web
import os
from tornado.options import options


class TestHandler(web.RequestHandler):
    def get(self):
        """
        Loading the main page for the application
        As we are working in a single web page application it will be the only page to load
        """

        # self.render("index_path")
        self.write("hello")
