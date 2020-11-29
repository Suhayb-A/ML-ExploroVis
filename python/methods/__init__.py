from methods import cluster, classify;

"""
**Data configuration File**
Default data structure:
{
  'title': the title of the data
  'algorithms': algorithms
}
"""
config = [
  {
    '_id': 'cluster',
    'title': 'Cluster',
    'types': cluster.methods
  },
  {
    '_id': 'classify',
    'title': 'Classify',
    'types': classify.methods
  }
]