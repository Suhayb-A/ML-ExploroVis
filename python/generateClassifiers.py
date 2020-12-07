import os, time
import numpy as np
from matplotlib import pyplot as plt
from sklearn.neural_network import MLPClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.naive_bayes import GaussianNB
from Counterfactual import generateBoundary

def generateClassifier(classifierName, data, labels, args):
	if classifierName == 'Artificial Neural Network':
		classifier = generateANN(**args)
		trainable = True
	if classifierName == 'K-Nearest Neighbor':
		classifier = generateKNN(**args)
		trainable = False
	if classifierName == 'Support Vector Machine':
		classifier = generateSVM(**args)
		trainable = False
	if classifierName == 'Decision Tree':
		classifier = generateDTree(**args)
		trainable = True
	if classifierName == 'Naive Bayes':
		classifier = generateNB()
		trainable = False
	if classifierName == 'Random Forrest':
		classifier = generateRandomForrest(**args)
		trainable = True
	return generateStats(classifier, data, labels, trainable)


def generateANN(hidden_layer_sizes, activation, alpha):
	classifier = MLPClassifier(hidden_layer_sizes=hidden_layer_sizes,
		activation=activation, alpha=alpha)
	return classifier

def generateKNN(k):
	classifier = KNeighborsClassifier(n_neighbors=k)
	return classifier

def generateSVM(kernel, degree, C):
	classifier = SVC(kernel=kernel, degree=degree, C=C)
	return classifier

def generateDTree(criterion, max_depth, min_samples_split, min_samples_leaf):
	classifier = DecisionTreeClassifier(criterion=criterion,
		max_depth=max_depth, min_samples_split=min_samples_split,
		min_samples_leaf=min_samples_leaf)
	return classifier

def generateNB():
	return GaussianNB()

def generateRandomForrest(n_estimators, criterion, max_depth, min_samples_split, min_samples_leaf):
	classifier = RandomForestClassifier(n_estimators=n_estimators,
		criterion=criterion, max_depth=max_depth,
		min_samples_split=min_samples_split,
		min_samples_leaf=min_samples_leaf)
	return classifier

def generateStats(classifier, data, labels, trainable):
	# Populates statistics lists
	boundary = []
	duration = []
	precision = []
	recall = []
	accuracy = []
	predFnames = []
	groundFnames = []
	corFnames = []
	predArrs = []
	groundArrs = []
	corArrs = []
	# Statistics generation
	iterations = 20 if trainable else 1
	for i in range(iterations):
		if trainable:
			startTime = time.time()
			for j in range(10):
				classifier.partial_fit(data, labels, classes=np.unique(labels))
			endTime = time.time()
			if len(duration) > 0:
				duration.append(endTime-startTime + duration[-1])
			else:
				duration.append(endTime-startTime)
		else:
			startTime = time.time()
			classifier.fit(data, labels)
			endTime = time.time()
			duration.append(endTime-startTime)
		p, r, a, b, pred, ground, cor = step(classifier, data, labels)
		precision.append(p)
		recall.append(r)
		accuracy.append(a)
		boundary.append(b)
		predArrs.append(pred)
		groundArrs.append(ground)
		corArrs.append(cor)
	#return precision, recall, accuracy, predFnames, groundFnames, corFnames
	return precision, recall, accuracy, duration, predArrs, groundArrs, corArrs, boundary

def average(lst):
	return sum(lst) / len(lst) 

def toColor(arr):
	uniqueElements = np.unique(arr)
	m = {0: 'Red', 1: 'Blue', 2: 'Green', 3: 'Yellow', 4: 'Pink'}
	l = [0] * len(arr)
	for i, element in enumerate(arr):
		l[i] = m[element]
	return l

def generateNaiveBoundary(model, X):
	x_min, x_max = X[:, 0].min() - 1, X[:, 0].max() + 1
	y_min, y_max = X[:, 1].min() - 1, X[:, 1].max() + 1
	xx, yy = np.meshgrid(np.arange(x_min, x_max, 0.1), np.arange(y_min, y_max, 0.1))
	xxl = xx.tolist()
	yyl = yy.tolist()
	mesh = []
	for i in range(len(xxl)):
		for j in range(len(xxl[0])):
			mesh.append([xxl[i][j], yyl[i][j]])
	Z = model.predict(np.c_[xx.ravel(), yy.ravel()]).reshape(len(xxl), len(xxl[0]))
	boundaryIndicies = [0] * len(xxl) * len(xxl[0])
	boundary = []
	for i in range(len(xxl)-1):
		for j in range(len(xxl[0])-1):
			boundaryIndicies[i*len(xxl)+j] = 1 if (Z[i,j] != Z[i,j+1] or Z[i,j] != Z[i+1,j]) else 0
	for i in range(len(boundaryIndicies)):
		if boundaryIndicies[i] == 1:
			boundary.append(mesh[i])
	return boundary

def step(classifier, data, labels):
	nClasses = len(np.unique(labels))
	truePositives = [0]*nClasses
	falsePositives = [0]*nClasses
	trueNegetives = [0]*nClasses
	falseNegetives = [0]*nClasses
	y_pred = []
	correct = 0
	incorrect = 0
	predictions = np.zeros(data.shape[0])
	correctPreds = np.zeros(data.shape[0])
	startTime = float(time.time())
	endTime = float(time.time())
	for count, instance in enumerate(data):
		instance = instance.reshape(1, -1)
		y_ = classifier.predict(instance)[0]
		y_pred.append(y_)
		y = labels[count]
		if y == y_:
			correct += 1
			correctPreds[count] = 1
			truePositives[y_] += 1
			for k in range(nClasses):
				if k != y:
					trueNegetives[k] += 1
		else:
			incorrect += 1
			falsePositives[y_] += 1
			for k in range(nClasses):
				if k != y_:
					falseNegetives[k] += 1
	interPrecision = []
	interRecall = []
	for k in range(nClasses):
		if (truePositives[k] == 0 and falsePositives[k] == 0):
			interPrecision.append(0)
		else:
			interPrecision.append(truePositives[k]/(truePositives[k]+falsePositives[k]))
		if (truePositives[k] == 0 and falseNegetives[k] == 0):
			interRecall.append(0)
		else:
			interRecall.append(truePositives[k]/(truePositives[k]+falseNegetives[k]))
	precision = (average(interPrecision))
	recall = (average(interRecall))
	accuracy = (correct/(correct+incorrect))
	boundary = generateNaiveBoundary(classifier, data)
	pred= ((data, y_pred))
	ground = ((data, labels))
	cor= ((data, correctPreds))
	return precision, recall, accuracy, boundary, pred, ground, cor














