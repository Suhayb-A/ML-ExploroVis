import os, time
import numpy as np
from matplotlib import pyplot as plt
from sklearn.cluster import KMeans, SpectralClustering, DBSCAN

def generateCluster(clusterName, data, args):
	args['max_iter'] = 1
	if clusterName == 'Spectral':
		cluster = SpectralClustering(**args)
		trainable = True
	if clusterName == 'DBSCAN':
		cluster = DBSCAN(**args)
		trainable = True
	if clusterName == 'KMeans':
		cluster = KMeans(**args)
		trainable = True
	return generateStats(cluster, data)

def generateStats(cluster, data):
	clusters = []
	boundary = []
	for i in range(30):
		for j in range(5):
			cluster.fit(data)
		intermediateClusters = cluster.predict(data)
		clusters.append((data, intermediateClusters))
		boundary.append(generateNaiveBoundary(cluster, data))
	return clusters, boundary

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











