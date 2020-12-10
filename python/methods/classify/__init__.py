from methods.classify.generateClassifiers import bootstrap
from sklearn.neighbors import KNeighborsClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.naive_bayes import GaussianNB
from methods import inputs

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
    'hidden_layer_sizes': [args['neurons_per_layer']] * args['layers']
  })

methods = {
  'ann' : {
    'title': 'Artificial Neural Network',
    'parameters': [inputs.Range('neurons_per_layer', 'neurons_per_layer', 16, 3, 64),
      inputs.Range('layers', 'layers', 2, 1, 5),
      inputs.Select('activation', 'Activation', 'relu', ['identity', 'logistic', 'tanh', {'relu': 'Rectified Linear Unit'}])],
    'algorithm': ann
  },
  'KNN' : {
    'title': 'K-Nearest Neighbor',
    'parameters': [inputs.Range('n_neighbors', 'K', 3, 1, 9)],
    'algorithm': bootstrap(KNeighborsClassifier, trainable = False)
  },
  'SVM' : {
    'title': 'Support Vector Machine',
    'parameters': [inputs.Range('C', 'Regularization parameter', 1.0, 0.1, 1, step = 0.01),
     inputs.Select('kernel', 'Kernel', 'linear', ['linear', 'rbf', 'sigmoid', 'poly']),
     inputs.Range('degree', 'Degree', 3, 3, 5)],
    'algorithm': bootstrap(SVC, trainable = False)
  },
  'decision_tree' : {
    'title': 'Decision Tree',
    'parameters': [inputs.Range('max_depth', 'Max Depth', 3, 2, 7),
     inputs.Range('min_samples_leaf', 'Min Samples Leaf', 2, 1, 10),
     inputs.Range('min_samples_split', 'Min Samples Split', 2, 1, 10)],
    'algorithm': bootstrap(DecisionTreeClassifier, trainable = False)
  },
  'naive_bayes' : {
    'title': 'Naive Bayes',
    'parameters': [],
    'algorithm': bootstrap(GaussianNB, trainable = False)
  },
  'ANN' : {
    'title': 'Random Forrest',
    'parameters': [],
    'algorithm': bootstrap(RandomForestClassifier, trainable = False)
  },
}

# DecisionTreeClassifier, RandomForestClassifier


# def generateANN(hidden_layer_sizes, activation, alpha):
# 	classifier = MLPClassifier(hidden_layer_sizes=hidden_layer_sizes,
# 		activation=activation, alpha=alpha)
# 	return classifier

# def generateKNN(k):
# 	classifier = KNeighborsClassifier(n_neighbors=k)
# 	return classifier

# def generateSVM(kernel, degree, C):
# 	classifier = SVC(kernel=kernel, degree=degree, C=C)
# 	return classifier

# def generateDTree(criterion, max_depth, min_samples_split, min_samples_leaf):
# 	classifier = DecisionTreeClassifier(criterion=criterion,
# 		max_depth=max_depth, min_samples_split=min_samples_split,
# 		min_samples_leaf=min_samples_leaf)
# 	return classifier

# def generateNB():
# 	return GaussianNB()

# def generateRandomForrest(n_estimators, criterion, max_depth, min_samples_split, min_samples_leaf):
# 	classifier = RandomForestClassifier(n_estimators=n_estimators,
# 		criterion=criterion, max_depth=max_depth,
# 		min_samples_split=min_samples_split,
# 		min_samples_leaf=min_samples_leaf)
# 	return classifier