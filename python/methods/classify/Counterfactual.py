import numpy as np
import pandas as pd
from sklearn.metrics import mean_squared_error as MSE
from sklearn.preprocessing import normalize
from copy import deepcopy
from tqdm import tqdm

def generate_counterfactual(model, x, feature, step_size=0.01, epsilon=0.01, max_steps=90):
	x = x.reshape(1, -1)
	y = model.predict(x)
	y_class = y[0]
	x_prime_l = np.copy(x)
	x_prime_r = np.copy(x)
	y_prime_l = y[0]
	y_prime_r = y[0]
	y_prime_l_old = y[0]
	y_prime_r_old = y[0]
	steps = 0
	while steps <= max_steps:
		# Update candidate counterfactuals
		x_prime_l[0, feature] = x_prime_l[0, feature] + step_size
		x_prime_r[0, feature] = x_prime_r[0, feature] - step_size
		# Check if left is appropriate counterfactual
		y_prime_l = model.predict(x_prime_l)[0]
		if y_prime_l != y_class:
			return x_prime_l
		y_prime_r = model.predict(x_prime_r)[0]
		# Do same for right
		if y_prime_r != y_class:
			return x_prime_r
		steps += 1
	return None

def generateBoundary(model, data):
	features = [i for i in range(data.shape[1])]
	hypersurface = []
	# Create boundary hypersurface
	for i in tqdm(range(data.shape[0])):
		for j in features:
			cf = generate_counterfactual(model, data[i], j)
			if cf is not None:
				hypersurface.append(cf[0])
	if len(hypersurface) > 0:
		return normalize(hypersurface)
	else:
		return []