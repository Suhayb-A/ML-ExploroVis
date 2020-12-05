from sklearn.neighbors import KNeighborsClassifier
import numpy as np;

def KNeighbors(data, args):
  # FIXME: Used for testing
  #**args
  STEP = 0.1
  X = data.loc[:, ['x', 'y']];
  y = data['g'];
  x_min, x_max = X.loc[:, 'x'].min() - 1, X.loc[:, 'x'].max() + 1
  y_min, y_max = X.loc[:, 'y'].min() - 1, X.loc[:, 'y'].max() + 1
  xx, yy = np.meshgrid(np.arange(x_min, x_max, STEP),
                      np.arange(y_min, y_max, STEP))

  results = KNeighborsClassifier(2).fit(X, y)
  Z = results.predict_proba(np.c_[xx.ravel(), yy.ravel()])

  return [{
    'scatter': data.to_dict('records'),
    'bound': Z.tolist()
  }]

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
  'nearest_neighbors' : {
    'title': 'Nearest Neighbors',
    'algorithm': KNeighbors
  }
}