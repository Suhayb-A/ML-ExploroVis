import numpy as np
from sklearn.neighbors import NearestNeighbors
import networkx as nx

def bootstrap(func, trainable):
  def inner(data, args):
    data_raw = data.loc[:, ['x', 'y']].to_numpy();
    cluster = func(**args)

    if not trainable:
      return [{
        'scatter': data.assign(cluster = cluster.fit_predict(data_raw))
      }]

    results = []
    old_centroids = []
    for i in range(args['n_clusters']):
      old_centroids.append([0, 0])
    for i in range(150):
      cluster.partial_fit(data_raw)
      centroids = cluster.cluster_centers_
      for j, centroid in enumerate(centroids):
        done = True
        if centroid[0] != old_centroids[j][0] or centroid[1] != old_centroids[j][1]:
          done = False
          break
      if done:
        break
      old_centroids = centroids
      results.append({
        'scatter': data.assign(cluster = cluster.predict(data_raw)),
        'boundary': generateNaiveBoundary(cluster, data_raw)
      })
    return results
  return inner;

def generateNaiveBoundary(model, X):
	x_min, x_max = X[:, 0].min() - 1, X[:, 0].max() + 1
	y_min, y_max = X[:, 1].min() - 1, X[:, 1].max() + 1
	xx, yy = np.meshgrid(np.arange(x_min, x_max, 0.1), np.arange(y_min, y_max, 0.1))
	xxl = xx.tolist()
	yyl = yy.tolist()
	mesh = []
	dist = xxl[0][0] + xxl[0][1]
	for i in range(len(xxl)):
		for j in range(len(xxl[0])):
			mesh.append([xxl[i][j] + dist/2, yyl[i][j] + dist/2])
	Z = model.predict(np.c_[xx.ravel(), yy.ravel()]).reshape(len(xxl), len(xxl[0]))
	boundaryIndicies = [0] * len(xxl) * len(xxl[0])
	boundary = []
	for i in range(len(xxl)-1):
		for j in range(len(xxl[0])-1):
			try:
				boundaryIndicies[i*len(xxl)+j] = 1 if (Z[i,j] != Z[i,j+1] or Z[i,j] != Z[i+1,j]) else 0
			except:
				print(len(boundaryIndicies))
				print(Z.shape)
				print(i)
				print(j)
				print(len(xxl))
				input(len(xxl[0]))
	for i in range(len(boundaryIndicies)):
		if boundaryIndicies[i] == 1:
			boundary.append(mesh[i])
	if len(boundary) > 2:
		boundary = np.asarray(boundary)
		clf = NearestNeighbors(2).fit(boundary)
		G = clf.kneighbors_graph()
		T = nx.from_scipy_sparse_matrix(G)
		order = list(nx.dfs_preorder_nodes(T, 0))
		boundary = (boundary[order]).tolist()
	return boundary






