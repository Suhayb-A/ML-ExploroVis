from methods.classify.generateClassifiers import bootstrap
from sklearn.neighbors import KNeighborsClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.naive_bayes import GaussianNB
from methods import inputs
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

def ann(data, args):
  return bootstrap(MLPClassifier, trainable = True)(data, {
    'activation': args['activation'],
    'hidden_layer_sizes': [args['neurons_per_layer']] * args['layers'],
    'random_state': RANDOM_STATE
  })

methods = {
  'ann' : {
    'title': 'Artificial Neural Network',
    'parameters': [inputs.Range('neurons_per_layer', 'Neurons Per Layer', 16, 3, 64),
      inputs.Range('layers', 'Number of Layers', 2, 1, 5),
      inputs.Select('activation', 'Activation Function', 'relu', [{'identity': 'Identity / no-op activation'}, {'logistic': 'Logistic Sigmoid'}, {'tanh': 'Hyperbolic tan'}, {'relu': 'Rectified Linear Unit'}])],
    'algorithm': ann
  },
  'KNN' : {
    'title': 'K-Nearest Neighbor',
    'parameters': [inputs.Range('n_neighbors', 'Number of Neighbors', 3, 1, 9)],
    'algorithm': bootstrap(KNeighborsClassifier, trainable = False)
  },
  'SVM' : {
    'title': 'Support Vector Machine',
    'parameters': [inputs.Range('C', 'Regularization parameter', 1.0, 0.1, 1, step = 0.01),
     inputs.Select('kernel', 'Kernel', 'linear', [{'linear': 'Linear'}, {'rbf': 'rbf'}, {'sigmoid': 'Sigmoid'}, {'poly':'Poly'}]),
     inputs.Range('degree', 'Degree', 3, 3, 5)],
    'algorithm': bootstrap(SVC, trainable = False)
  },
  'decision_tree' : {
    'title': 'Decision Tree',
    'parameters': [inputs.Range('max_depth', 'Max Depth', 3, 2, 7),
     inputs.Range('min_samples_leaf', 'Min Samples Leaf', 2, 1, 10),
     inputs.Range('min_samples_split', 'Min Samples Split', 2, 2, 10), inputs.Hidden('random_state', RANDOM_STATE)],
    'algorithm': bootstrap(DecisionTreeClassifier, trainable = False)
  },
  'naive_bayes' : {
    'title': 'Naive Bayes',
    'parameters': [],
    'algorithm': bootstrap(GaussianNB, trainable = False)
  },
  'random_forrest' : {
    'title': 'Random Forrest',
    'parameters': [inputs.Hidden('random_state', RANDOM_STATE)],
    'algorithm': bootstrap(RandomForestClassifier, trainable = False)
  },
}