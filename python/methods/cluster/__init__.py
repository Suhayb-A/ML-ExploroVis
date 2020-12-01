from sklearn import cluster;

def basic(func):
  def inner(data, args):
    results = cluster.DBSCAN(**args).fit(data.loc[:, ['x', 'y']])
    data['cluster'] = results.labels_
    return {
      'data': data.to_dict('records')
    }
  return inner;

methods = {
  'DBSCAN': {
    'title': 'DBSCAN',
    'algorithm': basic(cluster.DBSCAN)
  }
}