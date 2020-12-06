from methods import cluster, classify;
import copy;

"""
**Data configuration File**
Default data structure:
{
  'title': the title of the data
  'types': algorithm configs
}
"""
config = {
  'cluster': {
    'title': 'Cluster',
    'types': cluster.methods,
    'colors': [
      {
        '_id': 'cluster',
        'title': 'Cluster',
        'values': [{
            'title': 'Not clustered',
            'value': -1
          },{
            'title': 'Cluster 1',
            'value': 0
          },{
            'title': 'Cluster 2',
            'value': 1
          }]
      }
    ]
  },
  'classify': {
    'title': 'Classify',
    'types': classify.methods,
    'colors': [
      {
        '_id': 'prediction',
        'title': 'Prediction',
        'values': [{
            'title': 'Cluster 1',
            'value': 0
          },{
            'title': 'Cluster 2',
            'value': 1
          }]
      },
      {
        '_id': 'correct',
        'title': 'Correctness',
        'values': [{
            'title': 'Correct',
            'value': 0
          },{
            'title': 'Incorrect',
            'value': 1
          }]
      }
    ]
  }
}

# Json
def jsonify_category(c, keys=['title', 'types', 'colors']):
  return {key: (jsonify_types(c[key]) if key == 'types' else c[key]) for key in keys}

def jsonify_types(types, keys=['title', 'parameters']):
  keys 
  return [{**{key: types[type_key].get(key) for key in keys}, '_id': type_key} for type_key in types]

json_config = [{**jsonify_category(config[c]), '_id': c} for c in config];