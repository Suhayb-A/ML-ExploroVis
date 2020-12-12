import numpy as np
from sklearn.neighbors import NearestNeighbors
import networkx as nx
from methods.boundGen import generate_boundary

def bootstrap(model, trainable):
  def inner(data, args):
    data_raw = data.loc[:, ['x', 'y']].to_numpy();
    cluster = model(**args)

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

      generate_boundary(cluster, data_raw)

      results.append({
        'scatter': data.assign(cluster = cluster.predict(data_raw)),
        'boundary': generate_boundary(cluster, data_raw)
      })
    return results
  return inner;
