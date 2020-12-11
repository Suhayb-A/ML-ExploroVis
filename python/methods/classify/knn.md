# K-Nearest Neighbors

The K-Nearest Neighbors, or KNN, algorithm is a very simple algorithm which simply takes a dataset, and for any new point finds the k (user specified) nearest points to that point, and uses the plurality class out of those found to determine the class of the new point.

For instance, if a point's 3 nearest neighbors are of class A, A, and B respectively, the 3-Nearest Neighbors would return A as the class for that point. If the next 2 closest neighbors were also of class B, then B is the plurality class for 5-NN and class B would be chose if k=5.

## Use Cases

KNN works nicely on all kinds of data distributions, making no assumptions about the shape of the data. KNN suffers when one or more classes is underrepresented because this implies that it is more likely for points to be of the more represented class.

Because the algorithm is reliant on the dataset, there is no training time, however the cost of a single prediction is dependent on the size of the dataset. Further, unlike other methods, the whole data must be stored somehow for lookup, meaning that the applicability of this algorithm is limited when dealing with large datasets or small memory. 
\
\
[learn more](https://en.wikipedia.org/wiki/K-nearest_neighbors_algorithm)