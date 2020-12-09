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
  'K-Nearest Neighbor' : {
    'title': 'K Nearest Neighbors',
    'parameters': [inputs.Range('n_neighbors', 'K', 3, 1, 9)]
    'algorithm': KNeighbors
  },
  'Artificial Neural Network' : {
    'title': 'Artificial Neural Network',
    'parameters': [inputs.Range('neurons_per_layer', 'neurons_per_layer', 5, 3, 10),
    inputs.Range('layers', 'layers', 2, 1, 5),
    inputs.Select('activation', 'Activation', 'relu', ['identity', 'logistic', 'tanh', 'relu'])]
    'algorithm': KNeighbors
  },
  'SVM' : {
    'title': 'SVM',
    'parameters': [inputs.Range('C', 'Regularization parameter', 1.0, 0.1, 1),
    inputs.Select('kernel', 'Kernel', 'linear', ['linear', 'rbf', 'sigmoid', 'poly']),
    inputs.Range('degree', 'Degree', 3, 3, 5)]
    'algorithm': KNeighbors
  },
  'Decision Tree' : {
    'title': 'Decision Tree',
    'parameters': [inputs.Range('max_depth', 'Max Depth', 3, 2, 7),
    inputs.Range('min_samples_leaf', 'Min Samples Leaf', 2, 1, 10),
    inputs.Range('min_samples_split', 'Min Samples Split', 2, 1, 10)]
    'algorithm': KNeighbors
  }
}