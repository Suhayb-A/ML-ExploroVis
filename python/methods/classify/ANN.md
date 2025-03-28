# Artificial Neural Networks

Artificial neural networks, or more precisely here, the multilayer perceptron,
is an algorithm to classify data that gradually trains a set of weights so that,
given an input vector or matrix representing a data point, the network can
perform a series of matrix multiplication operations such that the final output
returns the desired action, in this case a classification.

## How it works?

Admittedly, this section is very hard to conceptualize by written description alone. The authors recommend viewing the following [YouTube series](https://www.youtube.com/watch?v=aircAruvnKk&list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi) for an excellent guide towards visualizing neural networks.

Neural networks are best visualized by graphs of nodes, such that nodes are organized into vertical columns, and every node in the previous layer in connected via an edge to every node in the next layer. Each one of these nodes is referred to as a neuron, and every column a layer. The edges are referred to as weights. The first layer is referred to as the input layer, and is the raw input to the network. The final layer is called the output layer, with each neuron in the output layer representing a certain action, such the classes in classification. The middle layers are called hidden layers, and this is where most of the computation takes place. A neuron is simply something that holds a number, and the values of the neurons in the next layer are calculated by summing the weighted (via the weights) values of the previous layer. After the sum, an 'activation function' (such as sigmoid or tanh) is applied. This process repeats to the next layer and so on, until the output layer is reached. The action is given as the argmax of the neurons in the output layer. This process is called forward propagation.

While the network architecture is a hyperparameter, the values of the weights are not. They are trained by a process called back-propagation, which, through calculus, calculates small changes to make to each of the weights so that the output layer would look more similar to the desired output.
\
\
[learn more](https://en.wikipedia.org/wiki/Artificial_neural_network)