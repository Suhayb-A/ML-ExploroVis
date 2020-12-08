import numpy as np

def bootstrap(func, trainable):
  def inner(data, args):
    data_raw = data.loc[:, ['x', 'y']].to_numpy();
    cluster = func(**args)

    if not trainable:
      return [{
        'scatter': data.assign(cluster = cluster.fit_predict(data_raw))
      }]

    results = []
    for i in range(30):
      for j in range(5):
        cluster.fit(data)

      results.append({
        'scatter': data.assign(cluster = cluster.predict(data_raw)),
        'boundary': generateNaiveBoundary(cluster, data_raw)
      })
    return results
  return inner;

def generateNaiveBoundary(model, X):
	x_min, x_max = X.loc[:, 'x'].min() - 1, X.loc[:, 'x'].max() + 1
	y_min, y_max = X.loc[:, 'y'].min() - 1, X.loc[:, 'y'].max() + 1
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
	return boundary