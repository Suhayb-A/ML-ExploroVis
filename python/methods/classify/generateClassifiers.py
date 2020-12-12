import os, time
import numpy as np
from methods.classify.Counterfactual import generateBoundary
from sklearn.neighbors import NearestNeighbors
import networkx as nx
from methods.boundGen import generate_boundary

ITERATIONS = 20

def bootstrap(func, trainable):
	def inner(data, args):
		classifier = func(**args)

		results = []
		labels = data.loc[:, 'g']

		npdata = data.loc[:, ['x', 'y']].to_numpy();
		for i in range(ITERATIONS if trainable else 1):
			if trainable:
				for j in range(10):
					classifier.partial_fit(npdata, labels, classes=np.unique(labels))
			else:
				classifier.fit(npdata, labels)

			p, r, a, boundary, pred, corr = step(classifier, npdata, labels)

			results.append({
				'scatter': data.assign(prediction = pred, correctness = corr),
				'boundary': boundary,
				'stats': {
					'precision': p,
					'recall': r,
					'accuracy': a,
					}
			})

		return results

	return inner

def average(lst):
	return sum(lst) / len(lst) 

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
	boundary = generate_boundary(classifier, data)
	return precision, recall, accuracy, boundary, y_pred, correctPreds














