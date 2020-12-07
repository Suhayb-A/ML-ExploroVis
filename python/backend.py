import numpy as np
import pandas as pd
from generateClassifiers import generateClassifier
from sklearn.datasets import make_moons, make_circles, make_blobs

datasetsDict = {'Moons': make_moons, 'Circles': make_circles, 'Globular': make_blobs}

def generateClassifierDataframe(classifier, args, datasetName, noise):
	if datasetName == 'Moons' or datasetName == 'Circles':
		data, labels = datasetsDict[datasetName](noise=noise)
	precision, recall, accuracy, time, pred, ground, correction, boundary = generateClassifier(classifier, data, labels, args)
	return pd.DataFrame({'precision': precision, 'recall': recall,
		'accuracy': accuracy, 'pred': pred, 'ground': ground, 'correction': correction,
		'boundary': boundary, 'duration': time})

if __name__ == "__main__":
	print(generateClassifierDataframe('Artificial Neural Network', {'hidden_layer_sizes':(32, 16), 'activation':'relu', 'alpha':0.01}, 'Circles', 0.03))
