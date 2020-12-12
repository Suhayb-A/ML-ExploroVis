import numpy as np

GRID_STEP = 0.01;
OFFSET = 0.11

def generate_boundary(model, X):
	x_min, x_max = X[:, 0].min() - OFFSET, X[:, 0].max() + OFFSET
	y_min, y_max = X[:, 1].min() - OFFSET, X[:, 1].max() + OFFSET
	x = np.arange(x_min, x_max, GRID_STEP);
	y = np.arange(y_min, y_max, GRID_STEP);

  # Generate a grid
	xx, yy = np.meshgrid(x, y)

	# Predict all points on the grid
	predictions = model.predict(np.c_[xx.ravel(), yy.ravel()])

	return {
    'predictions': predictions.tolist(),
    'dimensions': [len(x), len(y)],
    'xRange': [x_min, x_max],
    'yRange': [y_min, y_max],
  };