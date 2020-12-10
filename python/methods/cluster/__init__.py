from sklearn.cluster import KMeans, SpectralClustering, DBSCAN, MiniBatchKMeans
from methods import inputs
from methods.cluster.generateCluster import bootstrap;
RANDOM_STATE = 10;

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
  'Spectral': {
    'title': 'Spectral',
    'parameters': [inputs.Range('n_clusters', 'Number of Clusters', 3, 2, 5), inputs.Hidden('random_state', RANDOM_STATE)],
    'algorithm': bootstrap(SpectralClustering, trainable=False)
  },
  'DBSCAN': {
    'title': 'DBSCAN',
    'parameters': [inputs.Range('eps', 'Search Radius', 0.25, 0.05, 0.5, step = 0.01),
    inputs.Range('min_samples', 'Minimum Number of Samples', 5, 1, 25)],
    'algorithm': bootstrap(DBSCAN, trainable=False),
  },
  'KMeans': {
    'title': 'KMeans',
     'parameters': [inputs.Range('n_clusters', 'Number of Clusters', 3, 2, 5)],
    'algorithm': bootstrap(MiniBatchKMeans, trainable=True)
  }
}