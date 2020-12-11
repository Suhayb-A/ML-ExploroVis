# KMeans

The KMeans algorithm was one of the first clustering algorithms to be developed, and conceptually it is one of the most simple. KMeans works by taking a set of k (user specified) random points (the means), and saying that each point in the dataset belongs to the cluster of the mean it is closest to. Then, means are recomputed by finding the mean of all of he points in the cluster. The algorithm repeats until the means are not updated after a single pass, which implies convergence. 

KMeans by itself does not tend to work on most raw datsets. This is because it relies on both (typically Euclidean) distance as a metric, and only produces globular clusters, which is a very strong assumption when it comes to most data. KMeans can be quite useful for data that has undergone dimensionality reduction, and can be used as a part of a more complex technique, such as in spectral clustering.

[learn more](https://en.wikipedia.org/wiki/K-means_clustering)