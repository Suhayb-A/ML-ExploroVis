# Spectral Clustering

Spectral clustering is an algorithm based on KMeans that addresses some of its weaknesses (see related section). Spectral clustering first created a similarity matrix, that is, a symetric matrix of shape NxN such that the matrix indexed at i,j has a value demonstrating the 'similarity' between instance i and j in the dataset. Similarity is tyipcially inversely related to something like Euclidean distance. Afterwards, spectral clustering uses the spectrum (eigenvalues) to reduce the dimensionality of the dataset, and then KMeans is perfromed.

Spectral clustering thus is able to overcome the challenges of KMeans, being able to handle high dimensionality by reducing it, and the tendancy of Euclidean distance to be a poor metric choice in high dimensions by making similar instances be placed close together in low dimensional space. Spectral clustering therefor can handle data of almost all distributions, however is much clostlier than the other algorithms because computing the eigenvalues of a large matrix is costly. 

[learn more](https://en.wikipedia.org/wiki/Spectral_clustering)