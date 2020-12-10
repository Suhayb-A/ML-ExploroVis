import os, time
import numpy as np
from methods.classify.Counterfactual import generateBoundary
from sklearn.neighbors import NearestNeighbors
import networkx as nx

ITERATIONS = 20

def bootstrap(func, trainable):
	def inner(data, args):
		classifier = func(**args)

		results = []
		labels = data.loc[:, 'g']

		durration = 0;
		npdata = data.loc[:, ['x', 'y']].to_numpy();
		for i in range(ITERATIONS if trainable else 1):
			startTime = time.time()

			if trainable:
				for j in range(10):
					classifier.partial_fit(npdata, labels, classes=np.unique(labels))
			else:
				classifier.fit(npdata, labels)

			endTime = time.time()
			duration = endTime - startTime

			p, r, a, boundary, pred, corr = step(classifier, npdata, labels)

			results.append({
				'scatter': data.assign(prediction = pred, correctness = corr),
				'boundary': boundary,
				'stats': {
					'precision': p,
					'recall': r,
					'accuracy': a,
					'duration': durration,
					}
			})

		return results

	return inner

def average(lst):
	return sum(lst) / len(lst) 

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
	truePositives = [0] * nClasses
	falsePositives = [0] * nClasses
	trueNegetives = [0] * nClasses
	falseNegetives = [0] * nClasses
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
	if len(boundary) > 2:
		boundary = np.asarray(boundary)
		clf = NearestNeighbors(2).fit(boundary)
		G = clf.kneighbors_graph()
		T = nx.from_scipy_sparse_matrix(G)
		order = list(nx.dfs_preorder_nodes(T, 0))
		boundary = (boundary[order]).tolist()
	return precision, recall, accuracy, boundary, y_pred, correctPreds














