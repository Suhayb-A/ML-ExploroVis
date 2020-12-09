from sklearn import cluster;
from methods import inputs;

def basic(func):
  def inner(data, args):
    results = func(**args).fit(data.loc[:, ['x', 'y']])
    data['cluster'] = results.labels_
    return [{
      'scatter': data.to_dict('records')
    }]
  return inner;


'''
method_id : {
  title: 'Method title",
  parameters: [inputs.Range(arg_id, ...), ...],
  algorithm:
    A function that takes in the (data: pd.dataframe, args:
    hyperparameters).
    Returns:- Array of objects, with each object being a frame.
    Return object format:-
      {
        'scatter': [{x:int, y:int, g:int, ...}, ...] # Scatter plot input
        'bound': [{x,y}, ...]                        # Boundary
        ...                                          # Other stats
      }
}
'''
methods = {
  'DBSCAN': {
    'title': 'DBSCAN',
    'parameters': [inputs.Range('eps', 'Search Radius', 0.25, 0.05, 0.5),
    inputs.Range('min_samples', 'Minimum Number of Samples', 5, 1, 25)],
    'algorithm': basic(cluster.DBSCAN)
  },
  'KMeans': {
    'title': 'KMeans',
    'parameters': [inputs.Range('nclusters', 'Number of Clusters', 3, 2, 5)],
    'algorithm': basic(cluster.KMeans)
  },
  'Spectral': {
    'title': 'Spectral Clustering',
    'parameters': [inputs.Range('nclusters', 'Number of Clusters', 3, 2, 5)],
    'algorithm': basic(cluster.SpectralClustering)
  },
}