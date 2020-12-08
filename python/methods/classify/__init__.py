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

methods = {
  'ann' : {
    'title': 'Artificial Neural Network',
    'parameters': [inputs.Select('activation', "Activation function", 'relu', ['identity', 'logistic', 'tanh', 'relu'])],
    'algorithm': bootstrap(MLPClassifier, trainable = True)
  },
  'KNN' : {
    'title': 'K-Nearest Neighbor',
    'parameters': [],
    'algorithm': bootstrap(KNeighborsClassifier, trainable = False)
  },
  'SVM' : {
    'title': 'Support Vector Machine',
    'parameters': [],
    'algorithm': bootstrap(SVC, trainable = False)
  },
  'decision_tree' : {
    'title': 'Decision Tree',
    'parameters': [],
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