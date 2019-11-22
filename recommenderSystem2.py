#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sun Oct 27 12:04:38 2019

@author: shailesh
"""
from surprise import SVD,KNNBasic
from surprise import Dataset,Reader
from surprise.model_selection import cross_validate
import random,math
import pandas as pd
'''
#Note:
#Rating scale:
1 -> mouseover
2 -> click
3 -> add to cart
#
#For sample dataset generation:
UID : 1-20

House ID : 1-100


current Algo: Predict rating of each entry using collaborative filtering and then return top K based on rating

THIS INCLUDES ALREADY VISITED SITES
'''

#figure out when training happens


####Data Reading
#sampleDict = set([])
#for i in range(1000):
#	sampleDict.add((random.randint(1,21),random.randint(1,101)))
#
#sampleDict = [list(l) for l in sampleDict]
#
#for l in sampleDict:
#	l.append(math.floor((random.random()*3) + 1))
#############


#######Data conversion and training       #community_id,user,action
#df = pd.DataFrame(sampleDict,columns = ['UID','communityId','rating'])
#reader = Reader(rating_scale = (1,3))
#data = Dataset.load_from_df(df, reader)
#
#
#trainset = data.build_full_trainset()
# 
#
#model = SVD(n_epochs = 20, n_factors = 50, verbose = True)
#model.fit(trainset)

###################
def extractPropListFromResult(result):
#	l = result['result']
	l = []
	for d in result:
		l.append(d['community_id'])
	return l

def makeDfFromData(dictList):   #Current model is to convert entire data into df from scratch, might need to change
	print(dictList)
	l = [[d['user'],d['community_id'],d['action']] for d in dictList]
	print(l)
	df = pd.DataFrame(l,columns = ['UID','communityID','action'])
	reader = Reader(rating_scale = (1,3))
	data = Dataset.load_from_df(df, reader)	
	return data


def outputTopK(model,userID,communityIDs,K):					#Given a list of community IDs, output same list sorted according to user preference
	
		l = [(communityID,model.predict(userID,communityID)) for communityID in communityIDs]
		l.sort(key = lambda x: x[-1	].est,reverse = True)
		return [ele[0] for ele in l[:K]]
	
def trainModel(data):
	trainset = data.build_full_trainset()
	model = SVD(n_epochs = 20, n_factors = 50, verbose = True)
	model.fit(trainset)
	return model
	

	



#data = Dataset.load_builtin('ml-100k')
#
#
#algo = SVD()
#
## Run 5-fold cross-validation and print results
#cross_validate(algo, data, measures=['RMSE', 'MAE'], cv=5, verbose=True)