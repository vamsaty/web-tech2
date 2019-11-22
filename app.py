# -*- coding: utf-8 -*-
"""
Created on Mon Oct 14 09:10:45 2019

@author: satys
"""    
import json
import calendar
from flask import Flask, render_template, Markup, request, redirect, jsonify, abort, session, redirect, url_for, escape
from datetime import datetime
import requests
from flask_cors import CORS,cross_origin
from flask_static_compress import FlaskStaticCompress
import logging
from flask_pymongo import PyMongo
import pymongo
import urllib
from bson.objectid import ObjectId
from bson import json_util
import base64
import recommenderSystem2 as rs
from io import BytesIO, TextIOWrapper

import sys

app = Flask(__name__)
CORS(app)

app.config['CORS_HEADERS'] = 'Content-Type'
app.config["MONGO_URI"] = "mongodb://localhost:27017/wt2"

mongo = pymongo.MongoClient('mongodb://localhost:27017/wt2', maxPoolSize=50, connect=False)
start = 0
offset = 25
end = offset

db = pymongo.database.Database(mongo, 'wt2')
usercol = pymongo.collection.Collection(db, 'usercol')
commscol = pymongo.collection.Collection(db, 'community')
postscol = pymongo.collection.Collection(db, 'postscol')
ratingscol = pymongo.collection.Collection(db, 'ratingscol')
userinfocol = pymongo.collection.Collection(db, 'user_information')
useractioncol = pymongo.collection.Collection(db, 'user_actionsWT')

@app.route('/api/v1/login',methods=['POST'])
def login():
    username =  request.json['username']
    current_user=usercol.find_one({"Username":username})
    print(current_user)
    if(not(current_user)):
        return "Username does not exists!",400
    
    if(current_user):
        return jsonify({
            'token' : str(current_user.get('_id')),
            'userId' : current_user['UserID'],
            'name' : current_user['Username']
        }), 200
    
    return "not there", 404

@app.route('/api/v1/register',methods=['POST'])
def registration():
    name =  request.json['name']
    email =  request.json['email']
    username =  request.json['username']
    password = request.json['password']
    age = request.json['age']
    phone = request.json['phone']
    address = request.json['address']
    city = request.json['city']
                         
    if(usercol.find_one({"email":email})):
        return "Email exists!",400
    if(usercol.find_one({"username":username})):
        return "Username already exists!",400
    
    usercol.insert_one({
                "name":name,"email":email,
                "username":username,"password":password,
                "age":age, "phone":phone, "address":address, 
                "city":city, "total_expense": 0, 
                "current_groups":[], "old_groups":[],
                "friends":[], "trips":[]
                })

    return "",201



@app.route('/api/v1/personalFeeds/<username>',methods=['GET'])
def personalFeeds(username):
    
    user  = usercol.find_one({'Username' : username})
    if not user:
        return 'not found', 404
    
    data = []
    for i in user['current_communities']:
        com_name = commscol.find_one({'communityID' : i})
        data.append(
            {'name' : com_name['communityName'],
            'communityID' : i}
        )

    return jsonify(data), 200


@app.route('/api/v1/generalFeeds/',methods=['GET'])
def generalFeeds():
    #gets top feeds from the db
    comms = commscol.find({})

    data = []

    global start
    global end
    global offset
    k = 0
    for i in comms:        
        if k < start:
            pass
        elif k == end:
            start = end
            end = end + offset
            return jsonify(data), 200
        else:
            data.append(
                {'name' : i['communityName'],
                'communityID' : i['communityID']}
            )
        k += 1

    return jsonify(data), 200

@app.route('/api/v1/clearScroll',methods=['POST'])
def clearScroll():
    global start,end,offset
    start = 0
    end = offset
    
    return 'cleared scroll data', 200

@app.route('/api/v1/subscribe',methods = ['POST'])
def subscribe():
    # return 'asdf'

    username = request.json['username']
    com_id = request.json['id']

    user = usercol.find_one({'Username' : username})
    if user:
        usercol.update(
            {'_id' : user['_id']},
            {'$push' : {'current_communities' : com_id}}
        )
        return 'done', 200

    return "can't", 400


@app.route('/api/v1/posts',methods=['POST'])
def addPost():
    
    postData = [
        
        {'communityID' : 9,'posts' : []}
    ]

    for x in postData:
        postscol.insert_one(x)

    return 'added', 200



@app.route('/api/v1/posts/<p_id>',methods=['GET'])
def getPosts(p_id): 

    posts = postscol.find_one({'communityID' : int(p_id)})
    if not posts:
        return "",400
    
    data = []
    
    for x in posts['posts']:
        data.append(x)
        
    return jsonify({
        'data' : data
    }), 200



@app.route('/api/v1/post',methods=['POST'])
def putPost():

    postData = [
        {
            'communityID' : request.json['communityID'],
            'value' : {
                'data' : request.json['msg'], 
                'time' : datetime.now(), 
                'by' : request.json['author']
            }
        },
        # {'communityID' : 2, 'value' : {'data' : 'Here we are','time' : datetime.now(),'by' : 'a0'}},
        # {'communityID' : 2, 'value' : {'data' : 'Here we are1','time' : datetime.now(),'by' : 'b0'}},
        # {'communityID' : 2, 'value' : {'data' : 'Here we are2','time' : datetime.now(),'by' : 'c0'}},
        # {'communityID' : 2, 'value' : {'data' : 'Here we are3','time' : datetime.now(),'by' : 'c0'}},
        # {'communityID' : 2, 'value' : {'data' : 'Here we are4','time' : datetime.now(),'by' : 'c0'}},
        # {'communityID' : 9, 'value' : {'data' : 'Here we are5','time' : datetime.now(),'by' : 'd0'}},
        # {'communityID' : 9, 'value' : {'data' : 'Here we are6','time' : datetime.now(),'by' : 'a0'}},
        # {'communityID' : 9, 'value' : {'data' : 'Here we are7','time' : datetime.now(),'by' : 'b0'}},
        # {'communityID' : 9, 'value' : {'data' : 'Here we are8','time' : datetime.now(),'by' : 'c0'}},
        # {'communityID' : 9, 'value' : {'data' : 'Here we are9','time' : datetime.now(),'by' : 'c0'}},
        # {'communityID' : 9, 'value' : {'data' : 'Here we are0','time' : datetime.now(),'by' : 'c0'}},
        # {'communityID' : 9, 'value' : {'data' : 'Here we are12','time' : datetime.now(),'by' : 'd0'}},
        # {'communityID' : 6, 'value' : {'data' : 'Here we are13','time' : datetime.now(),'by' : 'e0'}},
        # {'communityID' : 6, 'value' : {'data' : 'Here we are13','time' : datetime.now(),'by' : 'e0'}},
        # {'communityID' : 6, 'value' : {'data' : 'Here we are11','time' : datetime.now(),'by' : 'e0'}},
        # {'communityID' : 6, 'value' : {'data' : 'Here we are12','time' : datetime.now(),'by' : 'e0'}},
        # {'communityID' : 6, 'value' : {'data' : 'Here we are098','time' : datetime.now(),'by' : 'e0'}},
        # {'communityID' : 6, 'value' : {'data' : 'Here we are125','time' : datetime.now(),'by' : 'e0'}}
    ]



    for x in postData:
        if postscol.find_one({'communityID' : x['communityID']}):
            postscol.update(
                { 'communityID' : x['communityID'] },
                { '$push' : { 'posts' : x['value']  } }
            )
        else:
            postscol.insert_one(
                {
                    'communityID' : x['communityID'],
                    'posts' : [x['value']]
                }
                
            )
    return 'done', 200


@app.route('/api/v1/bio/<username>',methods = ['GET'])
def getBio(username):
    user = usercol.find_one({'Username' : username})
    if not user:
        return 'not found', 400
    data = []
    for x in user:
        clen = 0
        current_communities = []

        for i in x['current_communities']:
            clen += 1
            current_communities.append(i['communityName'])

        data.append({
            '_id' : x['_id'],
            'Username' : x['Username'],
            'noc' : clen,
            'current_communities' : current_communities
        })

    return jsonify(data), 200

@app.route('/api/v1/add',methods=['POST'])
def addFeed():
    title = request.json['title']
    data = request.json['data']

    # groupscol.insert_one({'title' : title, 'data' : data})

    return "", 200



@app.route('/api/v1/submission/<query>',methods=['GET'])
def submission(query):
    feeds = commscol.find({})
    query = urllib.parse.unquote(query)
    # return jsonify([query]),200
    data = []
    for x in feeds:
        if (x['communityName'].lower()).find(query.lower()) != -1:
            data.append(
                {'name' : x['communityName'],
                'communityID' : x['communityID']}
            )

    
    return jsonify(data), 200


def is_higher_priority_action(curr_action, old_action):
    #    action_priority_dict = {"add_to_cart": 3, "click": 2, "hower": 1}
#    curr_priority = action_priority_dict[curr_action]
#    old_priority = action_priority_dict[old_action]
#    return curr_priority > old_priority 
    return curr_action>old_action

@app.route("/user_actions", methods=['POST'])
@cross_origin()
def user_actions():
#    req = request.get_json()
    user = request.json['user']
    community_id = request.json['community_id']
    action = request.json['action']
    relevant_entry = user_actions.find_one({'user': user, 'community_id': community_id})
#    print(relevant_entry['action'])
    if relevant_entry == None:
        user_actions_id = user_actions.insert_one({'user': user, 'community_id': community_id, 'action': action})
    elif is_higher_priority_action(action, relevant_entry['action']):
        user_actions.delete_one(relevant_entry)
        relevant_entry = user_actions.insert_one({'user': user, 'community_id': community_id, 'action': action})
#        relevant_entry.save()
#    new_user_action = user_actions.find_one({'_id': user_actions_id })
    return "Whatever"

@app.route("/user_recommendations/<user>", methods=['POST'])
# @cross_origin()
def user_recommendations(user):
    
    tr_data = []
    output = request.json['community_list']


    userActions = useractioncol.find({'user':int(user)})
    for s in userActions:
        tr_data.append({'user' : s['user'], 'community_id' : s['community_id'], 'action': s['action']})
    df = rs.makeDfFromData(tr_data)
    model = rs.trainModel(df)
    output = rs.outputTopK(model,user,output,8)

    newO = []
    for i in output:
        dax = commscol.find_one({'communityID' : int(i)})
        newO.append({
            'name' : dax['communityName'],
            'communityID' : i
        })

    return jsonify({'result' : newO})

#@app.route("/user_recommendations/propList/<users>", methods=['POST'])
#def preference_sort(user):
#    propList = request.json['properties']
#    u
@app.route('/fill_info',methods = ['POST'])
def fill_info():
    user_info = [
        
    ]
@app.route('/getId/<id>',methods = ['GET'])
def getName(id):
    
    here = commscol.find_one({'communityID' : int(id)})
    if not here:
        return 'failed',404
    for x in here:
        if x != '_id':
            return here[x], 200
    return here['communityName'], 200



if __name__ == "__main__":
    app.run(debug = True)