# KMeans

The KMeans algorithm was one of the first clustering algorithms to be developed,
and conceptually it is one of the most simple.

## How it works?

KMeans works by taking a set of (user specified) random points (k) which would
represent the means of each cluster. Each point in the
dataset will be grouped by the mean it is closest to. Then, new means are
recomputed by finding the mean of all of he points in each cluster. The process
will be repeated until the means stabilize and no longer change, which implies
convergence.

## Use cases

KMeans by itself does not tend to work on most raw datsets. This is because it
relies on both (typically Euclidean) distance as a metric, and only produces
globular clusters, which is a very strong assumption when it comes to most data.
KMeans can be quite useful for data that has undergone dimensionality reduction,
and can be used as a part of a more complex technique, such as in spectral
clustering.
\
\
[learn more](https://en.wikipedia.org/wiki/K-means_clustering)