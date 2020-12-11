# DBSCAN

DBSCAN or Density based spatial clustering of applications with noise, is a
density based clustering algorithm that seeks to cluster points based on their
proximity to other points.

## How it works?

A scanning radius (epsilon), represents the maximum distance that a point can be
away from any point in a cluster to be considered part of that cluster. First, DBSCAN finds a set of 'core points', such that each core point has at least some specified number of points in it's epsilon neighborhood. Then, at each core point, all of the epsilon neighbors of that core point as considered part of that point's cluster, and all of the points in the epsilon nieghborhood of those points will be considered as part of that cluster, repeating until all of the points have either been clustered, or are not reachable from any cluster. Any such point is considered an outlier.

## Use cases

DBSCAN works best when the distribution of points has similar density throughout the dataset. If the density of different regions is different, it becomes difficult or impossible to set epsilon in a meaninful way. Further, as dimensionality increases, it becomes increasingly hard to conceptualize the density of points, and also makes it harder to set epsilon. DBSCAN makes no assumptions about the nature of the data distribution, and therefore can cluster any shape of data.
\
\
[learn more](https://en.wikipedia.org/wiki/DBSCAN)