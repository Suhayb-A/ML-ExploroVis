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
  args: [inputs.Range(arg_id, ...), ...],
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
    'args': [inputs.Range('eps', 'Search Radius', 0.25, 0.1, 1)],
    'algorithm': basic(cluster.DBSCAN)
  }
}