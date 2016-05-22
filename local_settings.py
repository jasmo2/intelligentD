__author__ = 'jasmo2'
"""
copy this file as local_settings.py and override default configuration
"""
import re
import os

port = int(os.getenv('PORT', "8001"))
mongodb_host= os.getenv('MONGODB_URI', "localhost:27017")
# 'mongodb://heroku_lts058td:j3du8tkk8j064g937dbd1n0lk8@ds011893.mlab.com:11893/heroku_lts058td'
mongodb_name = re.search( r'/(\w+)', mongodb_host).group(0).replace("/","") if os.getenv('MONGODB_URI')  else "deveploment_db"
