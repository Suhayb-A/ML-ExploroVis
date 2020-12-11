# Decision Trees

A decision tree is a classifier that establishes a tree structure for classification. At each node in the tree, a decision is made about a particular feature of the feature vector, until ultimately a leaf node is reached, which returns a decision. During training, the decision splits try to minimize the [Gini index](https://en.wikipedia.org/wiki/Gini_coefficient) of the decision, so as to create the most robust splits.

Decision trees have three main hyperparameters to prevent overfitting. The first
is minimum samples split, which says that in order for the algorithm to make a
decision split, each split must represent at least that many samples. This
avoids the scenario in which only a few instances are cut off from the split
which will return a value of low Gini index, but may not be representative of a
general trend in the data. Minimum samples leaf is similar, but requires a leaf
node to have a certain number of samples that follows its path. Finally, the
maximum depth of the tree is also an important hyperparameter. If a tree is not
allowed to go very deep, then it will not be able touse many features to make
decisions. If the depth is greater, it runs the risk of overfitting.

## Use Cases

Decision trees are useful because they are robust to noisy and redundant attributes (they can be ignored), and also because they, unlike most algorithms, are inherently interpretable. In some domains, explanation needs to be given for a particular decision, such as credit worthiness, which is why you may often see decision trees used in these domains rather than more intricate algorithms. For example, if someone is deemed unworthy for a loan, a decision tree will not only return 'not creditworthy', but one can also trace the tree's structure to say that one is not credit worthy because they have only had their job for less than 3 years, had an income of over $80,000, but had a credit score of under 600.
\
\
[learn more](https://en.wikipedia.org/wiki/Decision_tree)