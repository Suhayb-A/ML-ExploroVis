from sklearn.cluster import KMeans, SpectralClustering, DBSCAN
from methods import inputs
from methods.cluster.generateCluster import bootstrap;

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
    'parameters': [inputs.Hidden('n_clusters', 2), inputs.Hidden('random_state', 0)],
    'algorithm': bootstrap(SpectralClustering, trainable=False)
  },
  'DBSCAN': {
    'title': 'DBSCAN',
    'algorithm': bootstrap(DBSCAN, trainable=False)
  },
  'KMeans': {
    'title': 'KMeans',
    'parameters': [inputs.Hidden('n_clusters', 2)],
    'algorithm': bootstrap(KMeans, trainable=False)
  }
}