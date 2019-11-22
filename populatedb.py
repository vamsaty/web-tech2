#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Fri Nov 22 01:37:53 2019

@author: shailesh
"""


from flask import Flask
from flask import  request, jsonify
from flask_pymongo import  PyMongo
from flask_cors import CORS, cross_origin
import recommenderSystem2 as rs
import json
import math
from flask_pymongo import  PyMongo
import random
import pymongo

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/wt2"

mongo = pymongo.MongoClient('mongodb://localhost:27017/wt2', maxPoolSize=50, connect=False)

db = pymongo.database.Database(mongo, 'wt2')
user_actions = pymongo.collection.Collection(db, 'user_actionsWT')


#
sampleDict = set([])
for i in range(10000):
	sampleDict.add((random.randint(1,21),random.randint(1,2001)))

sampleDict = [list(l) for l in sampleDict]

for l in sampleDict:
	l.append(math.floor((random.random()*3) + 1))
	user_actions_id = user_actions.insert_one({'user': l[0], 'community_id': l[1], 'action': random.randint(1,4)})
